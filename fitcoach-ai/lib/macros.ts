// Mifflin-St Jeor BMR + TDEE + Macro Calculator
// Source: Mifflin MD, St Jeor ST, et al. (1990). Am J Clin Nutr.

export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'weight_loss' | 'maintenance' | 'muscle_gain';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,       // Little or no exercise
  light: 1.375,         // Light exercise 1-3 days/week
  moderate: 1.55,       // Moderate exercise 3-5 days/week
  active: 1.725,        // Hard exercise 6-7 days/week
  very_active: 1.9,     // Very hard exercise + physical job
};

const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  weight_loss: -500,    // 500 kcal deficit → ~0.5kg/week loss
  maintenance: 0,
  muscle_gain: 300,     // 300 kcal surplus → lean bulk
};

export interface MacroResult {
  bmr: number;
  tdee: number;
  target_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  goal: Goal;
  activity_level: ActivityLevel;
}

export function calculateMacros(
  weight_kg: number,
  height_cm: number,
  age: number,
  gender: Gender,
  activity_level: ActivityLevel,
  goal: Goal
): MacroResult {
  // Mifflin-St Jeor BMR
  const bmr =
    gender === 'male'
      ? 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
      : 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;

  const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[activity_level]);
  const target_calories = Math.round(tdee + GOAL_ADJUSTMENTS[goal]);

  // Macro splits based on goal
  let protein_g: number, fat_g: number, carbs_g: number;

  if (goal === 'weight_loss') {
    protein_g = Math.round(weight_kg * 2.2);  // High protein to preserve muscle
    fat_g = Math.round((target_calories * 0.25) / 9);
    carbs_g = Math.round((target_calories - protein_g * 4 - fat_g * 9) / 4);
  } else if (goal === 'muscle_gain') {
    protein_g = Math.round(weight_kg * 2.0);  // Moderate-high protein
    fat_g = Math.round((target_calories * 0.28) / 9);
    carbs_g = Math.round((target_calories - protein_g * 4 - fat_g * 9) / 4);
  } else {
    protein_g = Math.round(weight_kg * 1.8);  // Maintenance protein
    fat_g = Math.round((target_calories * 0.30) / 9);
    carbs_g = Math.round((target_calories - protein_g * 4 - fat_g * 9) / 4);
  }

  return {
    bmr: Math.round(bmr),
    tdee,
    target_calories,
    protein_g: Math.max(protein_g, 0),
    carbs_g: Math.max(carbs_g, 0),
    fat_g: Math.max(fat_g, 0),
    goal,
    activity_level,
  };
}
