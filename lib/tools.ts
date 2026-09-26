// Tool execution logic — pure functions, no side effects
import { calculateMacros, Gender, ActivityLevel, Goal } from './macros';
import workoutCatalog from '@/data/workoutCatalog.json';
import habitsData from '@/data/habitsData.json';

// --- Types ---
export interface ToolResult {
  cardType: string;
  data: Record<string, unknown>;
}

// --- Tool: log_workout_routine ---
export function logWorkoutRoutine(
  day: string,
  muscleGroups: string[],
  notes?: string
): ToolResult {
  return {
    cardType: 'workout_log',
    data: {
      day,
      muscleGroups,
      notes: notes || '',
      loggedAt: new Date().toISOString(),
      message: `Logged ${muscleGroups.join(' & ')} for ${day}`,
    },
  };
}

// --- Tool: calculate_macros_and_bmr ---
export function calculateMacrosAndBmr(
  weight_kg: number,
  height_cm: number,
  age: number,
  gender: string,
  activity_level: string,
  goal: string
): ToolResult {
  const result = calculateMacros(
    weight_kg, height_cm, age,
    gender as Gender, activity_level as ActivityLevel, goal as Goal
  );
  return { cardType: 'macro_card', data: result as unknown as Record<string, unknown> };
}

// --- Tool: list_workouts ---
export function listWorkouts(category?: string): ToolResult {
  const catalog = workoutCatalog as Array<Record<string, unknown>>;
  const filtered = category
    ? catalog.filter((w) => w.category === category)
    : catalog;
  return {
    cardType: 'workout_list',
    data: {
      workouts: filtered.map((w) => ({
        id: w.id,
        name: w.name,
        category: w.category,
        difficulty: w.difficulty,
        duration_mins: w.duration_mins,
        tags: w.tags,
        primary_muscles: w.primary_muscles,
      })),
      total: filtered.length,
    },
  };
}

// --- Tool: get_workout ---
export function getWorkout(id: string): ToolResult {
  const catalog = workoutCatalog as Array<Record<string, unknown>>;
  const workout = catalog.find((w) => w.id === id);
  if (!workout) {
    return {
      cardType: 'workout_detail',
      data: { error: `Workout "${id}" not found in catalog.` },
    };
  }
  return { cardType: 'workout_detail', data: workout };
}

// --- Tool: get_fruit_nutrition ---
export async function getFruitNutrition(fruitName: string): Promise<ToolResult> {
  try {
    const res = await fetch(
      `https://www.fruityvice.com/api/fruit/${fruitName.toLowerCase()}`
    );
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();
    return {
      cardType: 'nutrition_card',
      data: {
        name: data.name,
        calories: data.nutritions?.calories ?? 'N/A',
        protein: data.nutritions?.protein ?? 'N/A',
        carbs: data.nutritions?.carbohydrates ?? 'N/A',
        fat: data.nutritions?.fat ?? 'N/A',
        sugar: data.nutritions?.sugar ?? 'N/A',
        family: data.family,
        genus: data.genus,
      },
    };
  } catch {
    return {
      cardType: 'nutrition_card',
      data: { error: `Could not find nutrition data for "${fruitName}". Try: apple, banana, mango, orange, watermelon, strawberry, kiwi, pineapple.` },
    };
  }
}

// --- Tool: get_recommended_habit ---
export function getRecommendedHabit(category: string): ToolResult {
  const habits = habitsData as Array<Record<string, unknown>>;
  const categoryHabits = habits.filter((h) => h.category === category);
  if (categoryHabits.length === 0) {
    return {
      cardType: 'habit_card',
      data: { error: `No habits found for category "${category}". Try: sleep, hydration, nutrition, recovery, mindset, movement.` },
    };
  }
  const habit = categoryHabits[Math.floor(Math.random() * categoryHabits.length)];
  return { cardType: 'habit_card', data: habit };
}

// --- Tool: calculate_goal_timeline ---
export function calculateGoalTimeline(
  current_weight_kg: number,
  target_weight_kg: number,
  goal?: string
): ToolResult {
  const diff = Math.round(Math.abs(target_weight_kg - current_weight_kg) * 10) / 10;
  const isGain = target_weight_kg >= current_weight_kg;
  const determinedGoal = goal || (isGain ? 'muscle_gain' : 'weight_loss');

  // Rate of change:
  // For lean muscle gain: 0.35kg to 0.4kg / week (minimizes fat gain)
  // For fat loss: 0.5kg to 0.7kg / week (preserves lean mass)
  const ratePerWeek = isGain ? 0.35 : 0.5;
  const totalWeeks = Math.max(2, Math.round(diff / ratePerWeek));
  const minWeeks = Math.max(2, Math.round(totalWeeks * 0.9));
  const maxWeeks = Math.max(minWeeks + 2, Math.round(totalWeeks * 1.15));

  const minMonths = Math.max(1, Math.round(minWeeks / 4.3));
  const maxMonths = Math.max(minMonths, Math.round(maxWeeks / 4.3));

  const calorieStrategy = isGain
    ? '+300 to +400 kcal/day lean surplus'
    : '-400 to -500 kcal/day controlled deficit';

  const p1Weight = isGain
    ? (current_weight_kg + diff * 0.33).toFixed(1)
    : (current_weight_kg - diff * 0.33).toFixed(1);
  const p2Weight = isGain
    ? (current_weight_kg + diff * 0.66).toFixed(1)
    : (current_weight_kg - diff * 0.66).toFixed(1);

  const milestones = [
    {
      phase: 'Phase 1 · Foundation',
      weight: `${p1Weight} kg`,
      focus: isGain
        ? 'Neuromuscular adaptation, glycogen retention & baseline surplus'
        : 'Metabolic adaptation, initial water balance & steady fat mobilization',
    },
    {
      phase: 'Phase 2 · Progressive Overload',
      weight: `${p2Weight} kg`,
      focus: isGain
        ? 'Peak hypertrophy stimulus with consistent caloric surplus'
        : 'Preserving lean muscle mass with high protein intake and resistance training',
    },
    {
      phase: 'Phase 3 · Goal Attainment',
      weight: `${target_weight_kg} kg`,
      focus: isGain
        ? 'Consolidating new mass into a new metabolic baseline'
        : 'Diet break and gradual transition to maintenance calories',
    },
  ];

  return {
    cardType: 'timeline_card',
    data: {
      current_weight_kg,
      target_weight_kg,
      difference_kg: diff,
      estimated_weeks: `${minWeeks}–${maxWeeks} weeks`,
      estimated_months: `${minMonths}–${maxMonths} months`,
      weekly_rate: isGain ? '+0.35 to +0.40 kg / week' : '-0.50 to -0.70 kg / week',
      calorie_strategy: calorieStrategy,
      goal: determinedGoal,
      milestones,
    },
  };
}

// --- Tool: get_diet_plan ---
export function getDietPlan(
  target_calories: number = 2600,
  goal: string = 'muscle_gain',
  protein_g?: number,
  preference: string = 'omnivore'
): ToolResult {
  const cals = Math.round(target_calories) || 2600;
  const isGain = goal === 'muscle_gain' || goal === 'bulk';
  const isLoss = goal === 'weight_loss' || goal === 'cut';
  const protein = protein_g || (isGain ? 105 : isLoss ? 130 : 100);

  const bCals = Math.round(cals * 0.25);
  const lCals = Math.round(cals * 0.30);
  const sCals = Math.round(cals * 0.20);
  const dCals = cals - bCals - lCals - sCals;

  const bProt = Math.round(protein * 0.25);
  const lProt = Math.round(protein * 0.32);
  const sProt = Math.round(protein * 0.18);
  const dProt = protein - bProt - lProt - sProt;

  const isVeg = preference.toLowerCase().includes('veg');

  const meals = [
    {
      name: 'Breakfast',
      time: '07:30 AM',
      calories: bCals,
      protein_g: bProt,
      foods: isVeg
        ? '3-egg or spiced tofu scramble with spinach, 2 slices whole-grain toast with extra virgin olive oil, 1 bowl oatmeal with sliced banana, pumpkin seeds & honey'
        : '3 whole eggs scrambled, 2 slices artisanal sourdough with olive oil, 1 cup rolled oatmeal with sliced banana and 1 tbsp natural honey',
    },
    {
      name: 'Lunch',
      time: '01:00 PM',
      calories: lCals,
      protein_g: lProt,
      foods: isVeg
        ? 'Paneer or tempeh bowl with 1.5 cups steamed basmati rice, roasted broccoli & bell peppers, and avocado drizzle'
        : '150g grilled chicken breast or lean beef mince, 1.5 cups steamed jasmine rice, roasted zucchini & broccoli, and 1 tbsp olive oil',
    },
    {
      name: 'Pre/Post Workout Snack',
      time: '04:30 PM',
      calories: sCals,
      protein_g: sProt,
      foods: 'High-density smoothie: 1 scoop whey/plant protein, 40g rolled oats, 1 banana, 2 tbsp natural peanut butter, 250ml milk or oat milk',
    },
    {
      name: 'Dinner',
      time: '08:00 PM',
      calories: dCals,
      protein_g: dProt,
      foods: isVeg
        ? 'Slow-cooked yellow dal or lentil curry with roasted sweet potato wedges, sautéed greens, and 50g crumbled paneer/cottage cheese'
        : '160g wild salmon fillet or grilled chicken thighs, baked sweet potato wedges, asparagus, and a leafy olive oil salad',
    },
  ];

  return {
    cardType: 'diet_plan_card',
    data: {
      target_calories: cals,
      protein_target_g: protein,
      goal: isGain ? 'Muscle Gain' : isLoss ? 'Weight Loss' : 'Maintenance',
      strategy: isGain ? 'Calorie-Dense Hypertrophic Protocol' : 'Satiety-Focused Lean Protocol',
      meals,
      tips: [
        'Drink 3.0 to 3.5 liters of water daily to support glycogen storage and digestion.',
        'If eating this volume feels challenging, shift more calories to liquid blends (smoothies with oats, peanut butter, fruit).',
        'Maintain a steady meal window daily to optimize circadian metabolic efficiency.',
      ],
    },
  };
}
