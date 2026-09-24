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
