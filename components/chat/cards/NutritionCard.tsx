'use client';
import { Leaf } from 'lucide-react';

interface NutritionData {
  name?: string;
  calories?: number | string;
  protein?: number | string;
  carbs?: number | string;
  fat?: number | string;
  sugar?: number | string;
  family?: string;
  error?: string;
}

export default function NutritionCard({ data }: { data: NutritionData }) {
  if (data.error) {
    return (
      <div className="my-2 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-500">
        <p>{data.error}</p>
      </div>
    );
  }

  const macros = [
    { label: 'Calories', value: `${data.calories} kcal`, color: 'text-neutral-800 dark:text-white' },
    { label: 'Protein', value: `${data.protein}g`, color: 'text-neutral-700 dark:text-neutral-300' },
    { label: 'Carbs', value: `${data.carbs}g`, color: 'text-neutral-700 dark:text-neutral-300' },
    { label: 'Fat', value: `${data.fat}g`, color: 'text-neutral-700 dark:text-neutral-300' },
    { label: 'Sugar', value: `${data.sugar}g`, color: 'text-neutral-600 dark:text-neutral-400' },
  ];

  return (
    <div className="my-1.5 p-3.5 sm:p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm animate-fade-up">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
          <Leaf className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
        </div>
        <div>
          <div className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">Nutrition Profile — per 100g</div>
          <div className="text-sm font-semibold text-neutral-800 dark:text-white capitalize">{data.name}</div>
          {data.family && <div className="text-[11px] text-neutral-500 font-mono">Taxonomy: {data.family}</div>}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {macros.map((m) => (
          <div key={m.label} className="p-1.5 sm:p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/70 dark:border-neutral-700/50 text-center">
            <div className={`text-xs sm:text-sm font-semibold ${m.color}`}>{m.value}</div>
            <div className="text-[8px] sm:text-[9px] font-mono text-neutral-500 uppercase mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-2 text-[9px] font-mono text-neutral-500 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
        Verified via Fruityvice Public Nutrition API
      </div>
    </div>
  );
}
