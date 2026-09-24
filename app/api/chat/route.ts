import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, Tool, FunctionDeclaration, SchemaType } from '@google/generative-ai';
import {
  logWorkoutRoutine,
  calculateMacrosAndBmr,
  listWorkouts,
  getWorkout,
  getFruitNutrition,
  getRecommendedHabit,
  ToolResult,
} from '@/lib/tools';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyArgs = Record<string, any>;

const functionDeclarations: FunctionDeclaration[] = [
  {
    name: 'log_workout_routine',
    description: 'Logs the user\'s workout routine for a specific day of the week.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        day: { type: SchemaType.STRING, description: 'Day of the week, e.g. Monday' },
        muscleGroups: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: 'Muscle groups trained' },
        notes: { type: SchemaType.STRING, description: 'Optional notes' },
      },
      required: ['day', 'muscleGroups'],
    },
  },
  {
    name: 'calculate_macros_and_bmr',
    description: 'Calculates BMR, TDEE, and daily macro targets using Mifflin-St Jeor equation.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        weight_kg: { type: SchemaType.NUMBER, description: 'Body weight in kg' },
        height_cm: { type: SchemaType.NUMBER, description: 'Height in cm' },
        age: { type: SchemaType.NUMBER, description: 'Age in years' },
        gender: { type: SchemaType.STRING, description: 'male or female' },
        activity_level: { type: SchemaType.STRING, description: 'sedentary, light, moderate, active, or very_active' },
        goal: { type: SchemaType.STRING, description: 'weight_loss, maintenance, or muscle_gain' },
      },
      required: ['weight_kg', 'height_cm', 'age', 'gender', 'activity_level', 'goal'],
    },
  },
  {
    name: 'list_workouts',
    description: 'Lists workouts from the catalog, optionally filtered by category.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        category: { type: SchemaType.STRING, description: 'Strength, Cardio, HIIT, Yoga, Calisthenics, or Mobility' },
      },
      required: [],
    },
  },
  {
    name: 'get_workout',
    description: 'Gets full details of a specific workout by ID.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        id: { type: SchemaType.STRING, description: 'Workout ID, e.g. push_day_strength' },
      },
      required: ['id'],
    },
  },
  {
    name: 'get_fruit_nutrition',
    description: 'Fetches nutritional data for a fruit.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        fruit_name: { type: SchemaType.STRING, description: 'Name of the fruit, e.g. apple, banana' },
      },
      required: ['fruit_name'],
    },
  },
  {
    name: 'get_recommended_habit',
    description: 'Returns a science-backed habit recommendation.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        category: { type: SchemaType.STRING, description: 'sleep, hydration, nutrition, recovery, mindset, or movement' },
      },
      required: ['category'],
    },
  },
];

const tools: Tool[] = [{ functionDeclarations }];

const SYSTEM_PROMPT = `You are FitCoach AI — a friendly, knowledgeable personal fitness and wellness assistant built on Google's Gemini AI.

You help users with:
- Tracking workout splits and logging training schedules
- Calculating personalized calories (BMR/TDEE) and macro targets
- Finding workout routines from your database
- Nutrition data for fruits and foods
- Evidence-based wellness habit recommendations
- General fitness advice and motivation

Key behaviors:
- Be concise, encouraging, and precise
- Always use your tools when the user asks for calculations, workouts, or habits
- Ask clarifying questions when you need weight, height, age, or goal to calculate macros
- Remember details the user shares earlier in the conversation

Available tool IDs in the workout catalog: push_day_strength, pull_day_hypertrophy, leg_day_complete, upper_body_strength, lower_body_hypertrophy, full_body_beginner, hiit_metabolic, hiit_bodyweight, yoga_flow_morning, mobility_full_body`;

export async function POST(request: NextRequest) {
  try {
    const { messages, userProfile } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured', code: 'INVALID_KEY' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash',
      tools,
      systemInstruction: userProfile && Object.keys(userProfile).length > 0
        ? `${SYSTEM_PROMPT}\n\nUser profile from this session: ${JSON.stringify(userProfile)}`
        : SYSTEM_PROMPT,
    });

    const chat = model.startChat({ history: messages.slice(0, -1) });
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const response = result.response;

    const toolsUsed: string[] = [];
    const cardData: ToolResult[] = [];

    const candidate = response.candidates?.[0];
    if (!candidate) {
      return NextResponse.json({ error: 'No response from model', code: 'MODEL_ERROR' }, { status: 500 });
    }

    const functionCallParts = candidate.content.parts.filter(p => p.functionCall);

    if (functionCallParts.length > 0) {
      const functionResponses = [];

      for (const part of functionCallParts) {
        const { name, args } = part.functionCall!;
        const a = args as AnyArgs;
        toolsUsed.push(name);

        let toolResult: ToolResult;

        switch (name) {
          case 'log_workout_routine':
            toolResult = logWorkoutRoutine(a.day, a.muscleGroups, a.notes);
            break;
          case 'calculate_macros_and_bmr':
            toolResult = calculateMacrosAndBmr(a.weight_kg, a.height_cm, a.age, a.gender, a.activity_level, a.goal);
            break;
          case 'list_workouts':
            toolResult = listWorkouts(a.category);
            break;
          case 'get_workout':
            toolResult = getWorkout(a.id);
            break;
          case 'get_fruit_nutrition':
            toolResult = await getFruitNutrition(a.fruit_name);
            break;
          case 'get_recommended_habit':
            toolResult = getRecommendedHabit(a.category);
            break;
          default:
            toolResult = { cardType: 'error', data: { message: `Unknown tool: ${name}` } };
        }

        cardData.push(toolResult);
        functionResponses.push({
          functionResponse: { name, response: toolResult.data },
        });
      }

      const followUp = await chat.sendMessage(functionResponses);
      const finalText = followUp.response.text();
      return NextResponse.json({ text: finalText, toolsUsed, cardData });
    } else {
      return NextResponse.json({ text: response.text(), toolsUsed, cardData });
    }
  } catch (err: unknown) {
    console.error('Chat API error:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    if (msg.includes('quota') || msg.includes('429')) {
      return NextResponse.json({ error: 'API quota exceeded. Please try again.', code: 'QUOTA_EXCEEDED' }, { status: 429 });
    }
    return NextResponse.json({ error: msg, code: 'MODEL_ERROR' }, { status: 500 });
  }
}
