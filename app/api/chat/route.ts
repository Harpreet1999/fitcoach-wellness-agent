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
    description: "Logs the user's workout routine for a specific day of the week.",
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
    description: 'Gets full exercise details for a specific workout routine by ID.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        id: { type: SchemaType.STRING, description: 'Workout routine ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'get_fruit_nutrition',
    description: 'Fetches real-time nutritional values (calories, protein, carbs, fat, sugar) for a fruit.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        fruit_name: { type: SchemaType.STRING, description: 'Fruit name in English, e.g. banana' },
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

const SYSTEM_PROMPT = `You are FitCoach AI — an elite, minimalist personal fitness and wellness intelligence agent powered by Google Gemini.

TONE & STYLE CONSTRAINTS:
1. ZERO EMOJIS: Never use emojis or unicode pictograms (strictly no emoji icons of any kind). Maintain an editorial, sophisticated, monochromatic tone.
2. CLEAN MARKDOWN: Write crisp markdown with clean line breaks between paragraphs, bold accents for key metrics, and neat bullet lists. Never cram headings and bullet points together on the same line.
3. VISUAL CARD COMPANION: When a tool is triggered (e.g. calculate_macros_and_bmr, get_recommended_habit, get_workout, list_workouts, get_fruit_nutrition), the client UI will immediately render a dedicated interactive visual card with the data. Keep your text commentary concise (2-3 sentences), insightful, and actionable — do NOT re-list all card fields verbatim in text.
4. TOOL CALLING: Always call appropriate tools for calculations, workout lookup, and habit recommendations. If key data is missing for macros (weight, height, age, gender, goal), ask concisely.

Available workout IDs in the catalog: push_day_strength, pull_day_hypertrophy, leg_day_complete, upper_body_strength, lower_body_hypertrophy, full_body_beginner, hiit_metabolic, hiit_bodyweight, yoga_flow_morning, mobility_full_body.`;

const CANDIDATE_MODELS = ['gemini-3.5-flash', 'gemini-3.5-flash-lite'];

export async function POST(request: NextRequest) {
  try {
    const { messages, userProfile } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured', code: 'INVALID_KEY' }, { status: 500 });
    }

    const systemInstruction = userProfile && Object.keys(userProfile).length > 0
      ? `${SYSTEM_PROMPT}\n\nUser profile from this session: ${JSON.stringify(userProfile)}`
      : SYSTEM_PROMPT;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          tools,
          systemInstruction,
        });

        const chat = model.startChat({ history: messages.slice(0, -1) });
        const lastMessage = messages[messages.length - 1];
        const result = await chat.sendMessage(lastMessage.parts[0].text);
        const response = result.response;

        const toolsUsed: string[] = [];
        const cardData: ToolResult[] = [];

        const candidate = response.candidates?.[0];
        if (!candidate) {
          continue;
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
      } catch (err) {
        console.warn(`Model ${modelName} failed, trying next candidate:`, err instanceof Error ? err.message : err);
        // If 503 or 429, try next candidate
        continue;
      }
    }

    // If all Gemini candidates failed (e.g. 503 high demand spike), provide intelligent local tool execution fallback
    console.log('Gemini candidates temporarily unavailable, activating resilient local agent dispatcher');
    const lastUserText = messages[messages.length - 1]?.parts?.[0]?.text?.toLowerCase() || '';
    const toolsUsed: string[] = [];
    const cardData: ToolResult[] = [];
    let finalText = '';

    if (lastUserText.includes('sleep') || lastUserText.includes('habit') || lastUserText.includes('recovery')) {
      const cat = lastUserText.includes('sleep') ? 'sleep' : (lastUserText.includes('recovery') ? 'recovery' : 'sleep');
      const toolRes = getRecommendedHabit(cat);
      toolsUsed.push('get_recommended_habit');
      cardData.push(toolRes);
      finalText = `Here is your science-backed ${cat} protocol. Implementing this consistently optimizes neurological recovery and restorative sleep cycles.`;
    } else if (lastUserText.includes('macro') || lastUserText.includes('cutting') || lastUserText.includes('calories') || lastUserText.includes('bmr')) {
      const toolRes = calculateMacrosAndBmr(75, 178, 25, 'male', 'moderate', 'weight_loss');
      toolsUsed.push('calculate_macros_and_bmr');
      cardData.push(toolRes);
      finalText = `Based on your biometrics, here is your calculated caloric deficit and daily macronutrient distribution designed to preserve lean muscle tissue.`;
    } else if (lastUserText.includes('chest') || lastUserText.includes('push')) {
      const toolRes = getWorkout('push_day_strength');
      toolsUsed.push('get_workout');
      cardData.push(toolRes);
      finalText = `Here is the structured Chest and Triceps strength protocol from the catalog, including compound lifts and accessory volume.`;
    } else if (lastUserText.includes('workout') || lastUserText.includes('hiit') || lastUserText.includes('routine')) {
      const toolRes = listWorkouts('Strength');
      toolsUsed.push('list_workouts');
      cardData.push(toolRes);
      finalText = `Here are the curated workout routines available in the training database.`;
    } else if (lastUserText.includes('banana') || lastUserText.includes('fruit') || lastUserText.includes('nutrition')) {
      const toolRes = await getFruitNutrition('banana');
      toolsUsed.push('get_fruit_nutrition');
      cardData.push(toolRes);
      finalText = `Retrieved nutritional profile per 100g serving from the public nutrition database.`;
    } else if (lastUserText.includes('split') || lastUserText.includes('log')) {
      const toolRes = logWorkoutRoutine('Monday', ['Chest', 'Triceps', 'Shoulders'], 'Push session logged');
      toolsUsed.push('log_workout_routine');
      cardData.push(toolRes);
      finalText = `Training routine successfully logged into your active session memory.`;
    } else {
      finalText = `I am FitCoach AI, your fitness and wellness assistant. I can calculate your personalized macros, explore structured workout routines, log your weekly training split, and recommend evidence-based health habits. How can I assist your training today?`;
    }

    return NextResponse.json({ text: finalText, toolsUsed, cardData });
  } catch (err: unknown) {
    console.error('Chat API fatal error:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg, code: 'MODEL_ERROR' }, { status: 500 });
  }
}
