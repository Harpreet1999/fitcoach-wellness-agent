'use client';
import { Utensils, Clock, Flame, ShieldAlert, Sparkles } from 'lucide-react';

export interface MealItem {
  name: string;
  time: string;
  calories: number;
  protein_g: number;
  foods: string;
}

export interface DietPlanData {
  target_calories: number;
  protein_target_g: number;
  goal: string;
  strategy: string;
  meals: MealItem[];
  tips?: string[];
}

export default function DietPlanCard({ data }: { data: DietPlanData }) {
  return (
    <div className="my-1.5 p-3.5 sm:p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
            <Utensils className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
          </div>
          <div>
            <div className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">Diet Structure</div>
            <div className="text-xs font-semibold text-neutral-800 dark:text-white">{data.strategy}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-base sm:text-lg font-semibold text-neutral-800 dark:text-white font-sans">
            {data.target_calories.toLocaleString()} <span className="text-xs font-normal text-neutral-500">kcal</span>
          </div>
          <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">
            {data.protein_target_g}g Protein Target
          </div>
        </div>
      </div>

      {/* Meals Breakdown */}
      <div className="space-y-2 mb-3">
        {data.meals.map((meal, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/50"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-neutral-800 dark:text-white">{meal.name}</span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                  <Clock className="w-2.5 h-2.5" />
                  {meal.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-neutral-600 dark:text-neutral-300 font-medium">
                  {meal.calories} kcal
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-700/70 text-neutral-700 dark:text-neutral-300 font-semibold">
                  {meal.protein_g}g P
                </span>
              </div>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
              {meal.foods}
            </p>
          </div>
        ))}
      </div>

      {/* Coaching Tips */}
      {data.tips && data.tips.length > 0 && (
        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-1 text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Adherence Protocol
          </div>
          <ul className="space-y-1">
            {data.tips.map((tip, idx) => (
              <li key={idx} className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-snug flex items-start gap-1.5">
                <span className="inline-block w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600 mt-1.5 shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
