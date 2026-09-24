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
      <div className="my-2 p-4 rounded-2xl border border-neutral-700 bg-neutral-900">
        <p className="text-sm text-neutral-400">{data.error}</p>
      </div>
    );
  }

  const macros = [
    { label: 'Calories', value: `${data.calories} kcal`, color: 'text-white' },
    { label: 'Protein', value: `${data.protein}g`, color: 'text-neutral-300' },
    { label: 'Carbs', value: `${data.carbs}g`, color: 'text-neutral-300' },
    { label: 'Fat', value: `${data.fat}g`, color: 'text-neutral-300' },
    { label: 'Sugar', value: `${data.sugar}g`, color: 'text-neutral-400' },
  ];

  return (
    <div className="my-2 p-5 rounded-2xl border border-neutral-700 bg-neutral-900 animate-fade-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-neutral-800">
          <Leaf className="w-4 h-4 text-neutral-300" />
        </div>
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">Nutrition Data — per 100g</div>
          <div className="text-base font-semibold text-white capitalize">{data.name}</div>
          {data.family && <div className="text-xs text-neutral-600 font-mono">Family: {data.family}</div>}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {macros.map((m) => (
          <div key={m.label} className="p-2.5 rounded-xl bg-neutral-800 text-center">
            <div className={`text-sm font-semibold ${m.color}`}>{m.value}</div>
            <div className="text-[10px] font-mono text-neutral-600 uppercase mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-[10px] font-mono text-neutral-600 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Data via Fruityvice Public API
      </div>
    </div>
  );
}
