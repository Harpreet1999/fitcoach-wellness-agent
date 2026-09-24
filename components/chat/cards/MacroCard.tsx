'use client';
import { Flame, Beef, Wheat, Droplets } from 'lucide-react';

interface MacroData {
  bmr: number;
  tdee: number;
  target_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  goal: string;
  activity_level: string;
}

export default function MacroCard({ data }: { data: MacroData }) {
  const goalLabel: Record<string, string> = {
    weight_loss: 'Weight Loss',
    maintenance: 'Maintenance',
    muscle_gain: 'Muscle Gain',
  };
  const activityLabel: Record<string, string> = {
    sedentary: 'Sedentary',
    light: 'Light',
    moderate: 'Moderate',
    active: 'Active',
    very_active: 'Very Active',
  };

  const totalCals = data.protein_g * 4 + data.carbs_g * 4 + data.fat_g * 9;
  const proteinPct = Math.round((data.protein_g * 4 / totalCals) * 100);
  const carbsPct = Math.round((data.carbs_g * 4 / totalCals) * 100);
  const fatPct = Math.round((data.fat_g * 9 / totalCals) * 100);

  return (
    <div className="my-2 p-5 rounded-2xl border border-neutral-700 bg-neutral-900 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-neutral-800">
            <Flame className="w-4 h-4 text-neutral-300" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">Daily Targets</div>
            <div className="text-sm font-semibold text-white">{goalLabel[data.goal] || data.goal}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold text-white">{data.target_calories.toLocaleString()}</div>
          <div className="text-xs font-mono text-neutral-500">kcal / day</div>
        </div>
      </div>

      {/* Macro bars */}
      <div className="flex gap-1 h-2 rounded-full overflow-hidden mb-4">
        <div className="bg-neutral-200 rounded-full transition-all duration-500" style={{ width: `${proteinPct}%` }} />
        <div className="bg-neutral-500 rounded-full transition-all duration-500" style={{ width: `${carbsPct}%` }} />
        <div className="bg-neutral-700 rounded-full transition-all duration-500" style={{ width: `${fatPct}%` }} />
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-neutral-800 text-center">
          <Beef className="w-4 h-4 text-neutral-300 mx-auto mb-1" />
          <div className="text-lg font-semibold text-white">{data.protein_g}g</div>
          <div className="text-[10px] font-mono text-neutral-500 uppercase">Protein</div>
          <div className="text-[10px] text-neutral-600">{proteinPct}%</div>
        </div>
        <div className="p-3 rounded-xl bg-neutral-800 text-center">
          <Wheat className="w-4 h-4 text-neutral-300 mx-auto mb-1" />
          <div className="text-lg font-semibold text-white">{data.carbs_g}g</div>
          <div className="text-[10px] font-mono text-neutral-500 uppercase">Carbs</div>
          <div className="text-[10px] text-neutral-600">{carbsPct}%</div>
        </div>
        <div className="p-3 rounded-xl bg-neutral-800 text-center">
          <Droplets className="w-4 h-4 text-neutral-300 mx-auto mb-1" />
          <div className="text-lg font-semibold text-white">{data.fat_g}g</div>
          <div className="text-[10px] font-mono text-neutral-500 uppercase">Fat</div>
          <div className="text-[10px] text-neutral-600">{fatPct}%</div>
        </div>
      </div>

      {/* BMR / TDEE */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-800">
        <div className="text-center">
          <div className="text-sm font-semibold text-neutral-300">{data.bmr.toLocaleString()} kcal</div>
          <div className="text-[10px] font-mono text-neutral-600 uppercase">BMR (Resting)</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold text-neutral-300">{data.tdee.toLocaleString()} kcal</div>
          <div className="text-[10px] font-mono text-neutral-600 uppercase">TDEE ({activityLabel[data.activity_level] || data.activity_level})</div>
        </div>
      </div>
    </div>
  );
}
