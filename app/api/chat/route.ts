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

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const CANDIDATE_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-flash-lite-latest',
];

interface ParsedMacroParams {
  weight: number;
  height: number;
  age: number;
  gender: string;
  goal: string;
  activity: string;
}

function parseLocalMacroParams(text: string, profile: Record<string, unknown> = {}): ParsedMacroParams {
  const t = text.toLowerCase();

  // Weight (e.g. "55kg", "55 kg", "55 kilos", "160 lbs")
  let weight = Number(profile.weight_kg) || 75;
  const lbsMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:lbs|pounds)/);
  const kgMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilos|kilograms)/) ||
                  t.match(/(?:weight|weigh|i'm|im|at)\s*(\d+(?:\.\d+)?)\s*(?:kg)?/);
  if (lbsMatch) {
    weight = Math.round(parseFloat(lbsMatch[1]) * 0.453592);
  } else if (kgMatch) {
    weight = parseFloat(kgMatch[1]);
  }

  // Height (e.g. "178cm", "178 cm")
  let height = Number(profile.height_cm) || 178;
  const heightMatch = t.match(/(\d{2,3})\s*(?:cm|centimeters)/) ||
                      t.match(/(?:height|tall|standing)\s*(?:is|:)?\s*(\d{2,3})/);
  if (heightMatch) {
    height = parseInt(heightMatch[1], 10);
  }

  // Age (e.g. "27 years old", "27yo", "age 27")
  let age = Number(profile.age) || 25;
  const ageMatch = t.match(/(\d{1,2})\s*(?:years\s*old|yo|yr|yrs|year|age)/) ||
                   t.match(/(?:age|aged)\s*(?:is|:)?\s*(\d{1,2})/);
  if (ageMatch) {
    age = parseInt(ageMatch[1], 10);
  }

  // Gender
  let gender = (profile.gender as string) || 'male';
  if (t.includes('female') || t.includes('woman') || t.includes('girl')) {
    gender = 'female';
  } else if (t.includes('male') || t.includes('man') || t.includes('guy')) {
    gender = 'male';
  }

  // Goal
  let goal = (profile.goal as string) || 'weight_loss';
  if (t.includes('bulk') || t.includes('gain') || t.includes('muscle') || t.includes('surplus') || t.includes('hypertrophy')) {
    goal = 'muscle_gain';
  } else if (t.includes('cut') || t.includes('loss') || t.includes('deficit') || t.includes('lose') || t.includes('lean')) {
    goal = 'weight_loss';
  } else if (t.includes('maintain') || t.includes('maintenance') || t.includes('recomp')) {
    goal = 'maintenance';
  }

  // Activity level
  let activity = (profile.activity_level as string) || 'moderate';
  if (t.includes('sedentary')) activity = 'sedentary';
  else if (t.includes('very active') || t.includes('very_active') || t.includes('athlete')) activity = 'very_active';
  else if (t.includes('active') || t.includes('heavy')) activity = 'active';
  else if (t.includes('light')) activity = 'light';
  else if (t.includes('moderate')) activity = 'moderate';

  return { weight, height, age, gender, goal, activity };
}

function generateToolCompanionText(toolName?: string, data?: Record<string, unknown>): string {
  switch (toolName) {
    case 'calculate_macros_and_bmr': {
      const cals = data?.target_calories || 2200;
      return `Calculated your personalized metabolic baselines and macro distribution. Your daily caloric target is **${cals} kcal/day**. Meet these targets consistently with nutrient-dense foods to achieve your body composition goal.`;
    }
    case 'get_workout': {
      const name = data?.name || 'routine';
      return `Loaded the **${name}** routine with target sets, reps, and form guidance. Review the protocol card above to begin your session.`;
    }
    case 'list_workouts':
      return `Retrieved curated workout routines matching your criteria from the catalog. Choose a routine to view complete exercise details.`;
    case 'get_fruit_nutrition': {
      const fruit = data?.name || 'fruit';
      return `Retrieved nutritional breakdown for **${fruit}** per 100g serving from the nutrition database.`;
    }
    case 'get_recommended_habit': {
      const habit = data?.title || 'habit';
      return `Here is your science-backed recommendation: **${habit}**. Consistent implementation reinforces systemic recovery.`;
    }
    case 'log_workout_routine':
      return `Successfully logged your workout split into active session memory.`;
    default:
      return `Processed your request and rendered your fitness intelligence card above.`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages, userProfile } = await request.json();

    const lastMessage = messages?.[messages.length - 1];
    const lastUserText = lastMessage?.parts?.[0]?.text?.trim() || '';

    if (!lastUserText) {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const systemInstruction = userProfile && Object.keys(userProfile).length > 0
        ? `${SYSTEM_PROMPT}\n\nUser profile from this session: ${JSON.stringify(userProfile)}`
        : SYSTEM_PROMPT;

      // Sanitize multi-turn history for Gemini: remove empty/invalid parts
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sanitizedHistory = (messages.slice(0, -1) || [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((m: any) => m?.role && m?.parts?.[0]?.text && typeof m.parts[0].text === 'string' && m.parts[0].text.trim().length > 0)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((m: any) => ({
          role: m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.parts[0].text.trim() }],
        }));

      for (const modelName of CANDIDATE_MODELS) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            tools,
            systemInstruction,
          });

          const chat = model.startChat({ history: sanitizedHistory });
          
          // Strict 6s timeout to prevent Vercel 10s serverless invocation timeouts
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Model timeout')), 6000)
          );

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result: any = await Promise.race([chat.sendMessage(lastUserText), timeoutPromise]);
          const response = result.response;

          const toolsUsed: string[] = [];
          const cardData: ToolResult[] = [];

          const candidate = response.candidates?.[0];
          if (!candidate) {
            continue;
          }

          const functionCallParts = candidate.content.parts.filter((p: { functionCall?: unknown }) => p.functionCall);

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

            let finalText = '';
            try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const followUpPromise: Promise<any> = chat.sendMessage(functionResponses);
              const followUpTimeout = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('Followup timeout')), 2500)
              );
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const followUp: any = await Promise.race([followUpPromise, followUpTimeout]);
              finalText = followUp.response.text();
            } catch {
              finalText = generateToolCompanionText(toolsUsed[0], cardData[0]?.data as Record<string, unknown>);
            }
            return NextResponse.json({ text: finalText, toolsUsed, cardData, modelUsed: modelName });
          } else {
            return NextResponse.json({ text: response.text(), toolsUsed, cardData, modelUsed: modelName });
          }
        } catch (err) {
          console.warn(`Model ${modelName} failed or rate-limited:`, err instanceof Error ? err.message : err);
          continue;
        }
      }
    }

    // Resilient local agent fallback: parses user input dynamically so results are never repeated or static
    console.log('Gemini candidates temporarily unavailable/rate-limited, activating dynamic local agent dispatcher');
    const lowerText = lastUserText.toLowerCase();
    const toolsUsed: string[] = [];
    const cardData: ToolResult[] = [];
    let finalText = '';

    if (
      lowerText.includes('macro') ||
      lowerText.includes('cutting') ||
      lowerText.includes('bulking') ||
      lowerText.includes('calories') ||
      lowerText.includes('bmr') ||
      lowerText.includes('tdee') ||
      lowerText.includes('deficit') ||
      lowerText.includes('surplus') ||
      lowerText.includes('split for')
    ) {
      const p = parseLocalMacroParams(lastUserText, userProfile);
      const toolRes = calculateMacrosAndBmr(p.weight, p.height, p.age, p.gender, p.activity, p.goal);
      toolsUsed.push('calculate_macros_and_bmr');
      cardData.push(toolRes);

      const targetCals = (toolRes.data as Record<string, unknown>).target_calories;
      const goalDesc =
        p.goal === 'muscle_gain'
          ? 'controlled caloric surplus targeting clean muscle hypertrophy'
          : p.goal === 'weight_loss'
          ? 'caloric deficit designed to accelerate fat loss while preserving lean mass'
          : 'caloric maintenance balance for stable body composition';

      finalText = `Based on your biometrics (${p.weight}kg, ${p.height}cm, ${p.age} years old ${p.gender}, ${p.activity} activity), here is your ${goalDesc}. Your personalized daily target is approximately **${targetCals} kcal**. Meet these targets consistently with quality nutrition for optimal results.`;
    } else if (lowerText.includes('chest') || lowerText.includes('tricep') || lowerText.includes('push')) {
      const toolRes = getWorkout('push_day_strength');
      toolsUsed.push('get_workout');
      cardData.push(toolRes);
      finalText = `Here is the structured Chest and Triceps strength protocol from the catalog, including compound lifts and accessory volume.`;
    } else if (lowerText.includes('back') || lowerText.includes('bicep') || lowerText.includes('pull')) {
      const toolRes = getWorkout('pull_day_hypertrophy');
      toolsUsed.push('get_workout');
      cardData.push(toolRes);
      finalText = `Here is the Pull Hypertrophy protocol focused on lat width, upper back thickness, and bicep volume.`;
    } else if (lowerText.includes('leg') || lowerText.includes('quad') || lowerText.includes('squat')) {
      const toolRes = getWorkout('leg_day_complete');
      toolsUsed.push('get_workout');
      cardData.push(toolRes);
      finalText = `Here is the complete Leg Day protocol covering quadriceps, hamstrings, and calves for lower-body power.`;
    } else if (lowerText.includes('upper')) {
      const toolRes = getWorkout('upper_body_strength');
      toolsUsed.push('get_workout');
      cardData.push(toolRes);
      finalText = `Here is the Upper Body Strength protocol targeting compound pushing and pulling foundations.`;
    } else if (lowerText.includes('hiit') || lowerText.includes('metabolic') || lowerText.includes('cardio')) {
      const toolRes = getWorkout('hiit_metabolic');
      toolsUsed.push('get_workout');
      cardData.push(toolRes);
      finalText = `Here is the HIIT Metabolic Conditioning routine designed to elevate heart rate and maximize VO2 expenditure.`;
    } else if (lowerText.includes('yoga') || lowerText.includes('flow')) {
      const toolRes = getWorkout('yoga_flow_morning');
      toolsUsed.push('get_workout');
      cardData.push(toolRes);
      finalText = `Here is the Morning Yoga Flow routine for mobility, alignment, and mindful activation.`;
    } else if (lowerText.includes('mobility') || lowerText.includes('stretch')) {
      const toolRes = getWorkout('mobility_full_body');
      toolsUsed.push('get_workout');
      cardData.push(toolRes);
      finalText = `Here is the Full Body Mobility routine for joint health, hip opening, and active recovery.`;
    } else if (lowerText.includes('workout') || lowerText.includes('routine') || lowerText.includes('catalog') || lowerText.includes('list')) {
      let cat: string | undefined = undefined;
      if (lowerText.includes('strength')) cat = 'Strength';
      else if (lowerText.includes('hiit')) cat = 'HIIT';
      else if (lowerText.includes('yoga')) cat = 'Yoga';
      else if (lowerText.includes('calisthenic')) cat = 'Calisthenics';
      else if (lowerText.includes('mobility')) cat = 'Mobility';
      const toolRes = listWorkouts(cat);
      toolsUsed.push('list_workouts');
      cardData.push(toolRes);
      finalText = cat
        ? `Here are the curated ${cat} routines available in the training database.`
        : `Here are the curated workout routines available across all disciplines in the training database.`;
    } else if (
      lowerText.includes('banana') ||
      lowerText.includes('apple') ||
      lowerText.includes('orange') ||
      lowerText.includes('strawberry') ||
      lowerText.includes('fruit') ||
      lowerText.includes('nutrition')
    ) {
      const fruits = ['banana', 'apple', 'orange', 'strawberry', 'blueberry', 'watermelon', 'mango', 'pineapple', 'kiwi'];
      const fruitName = fruits.find(f => lowerText.includes(f)) || 'banana';
      const toolRes = await getFruitNutrition(fruitName);
      toolsUsed.push('get_fruit_nutrition');
      cardData.push(toolRes);
      finalText = `Retrieved verified nutritional profile for ${fruitName.charAt(0).toUpperCase() + fruitName.slice(1)} per 100g serving from the public nutrition database.`;
    } else if (
      lowerText.includes('sleep') ||
      lowerText.includes('habit') ||
      lowerText.includes('recovery') ||
      lowerText.includes('hydration') ||
      lowerText.includes('water') ||
      lowerText.includes('mindset')
    ) {
      let cat = 'sleep';
      if (lowerText.includes('hydration') || lowerText.includes('water')) cat = 'hydration';
      else if (lowerText.includes('recovery') || lowerText.includes('soreness')) cat = 'recovery';
      else if (lowerText.includes('mindset') || lowerText.includes('focus')) cat = 'mindset';
      else if (lowerText.includes('nutrition') || lowerText.includes('diet')) cat = 'nutrition';
      else if (lowerText.includes('movement') || lowerText.includes('step')) cat = 'movement';

      const toolRes = getRecommendedHabit(cat);
      toolsUsed.push('get_recommended_habit');
      cardData.push(toolRes);
      finalText = `Here is your science-backed ${cat} recommendation. Implementing this habit consistently optimizes recovery and metabolic health.`;
    } else if (lowerText.includes('split') || lowerText.includes('log') || lowerText.includes('schedule')) {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const foundDay = days.find(d => lowerText.includes(d.toLowerCase())) || 'Monday';
      const groups: string[] = [];
      if (lowerText.includes('chest')) groups.push('Chest');
      if (lowerText.includes('tricep')) groups.push('Triceps');
      if (lowerText.includes('back')) groups.push('Back');
      if (lowerText.includes('bicep')) groups.push('Biceps');
      if (lowerText.includes('shoulder')) groups.push('Shoulders');
      if (lowerText.includes('leg') || lowerText.includes('quad') || lowerText.includes('hamstring')) groups.push('Legs');
      if (lowerText.includes('core') || lowerText.includes('ab')) groups.push('Core');
      if (groups.length === 0) groups.push('Push Session');

      const toolRes = logWorkoutRoutine(foundDay, groups, `Training split logged for ${foundDay}`);
      toolsUsed.push('log_workout_routine');
      cardData.push(toolRes);
      finalText = `Training routine successfully logged for ${foundDay} (${groups.join(' & ')}) into your active session memory.`;
    } else {
      finalText = `I am FitCoach AI, your personal fitness and wellness intelligence assistant. I can calculate your personalized macros, explore structured workout routines, log your weekly training split, and recommend evidence-based health habits. How can I assist your training today?`;
    }

    return NextResponse.json({ text: finalText, toolsUsed, cardData, modelUsed: 'Local Engine' });
  } catch (err: unknown) {
    console.error('Chat API fatal error:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg, code: 'MODEL_ERROR' }, { status: 500 });
  }
}
