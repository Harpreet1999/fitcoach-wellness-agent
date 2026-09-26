'use client';
import { Calendar, Target, TrendingUp, Flame, CheckCircle2 } from 'lucide-react';

export interface TimelineMilestone {
  phase: string;
  weight: string;
  focus: string;
}

export interface TimelineData {
  current_weight_kg: number;
  target_weight_kg: number;
  difference_kg: number;
  estimated_weeks: string;
  estimated_months: string;
  weekly_rate: string;
  calorie_strategy: string;
  goal: string;
  milestones: TimelineMilestone[];
}

export default function TimelineCard({ data }: { data: TimelineData }) {
  const isGain = data.target_weight_kg >= data.current_weight_kg;

  return (
    <div className="my-1.5 p-3.5 sm:p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
            <Calendar className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
          </div>
          <div>
            <div className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">Goal Progression</div>
            <div className="text-xs font-semibold text-neutral-800 dark:text-white">
              {data.current_weight_kg}kg → {data.target_weight_kg}kg ({isGain ? `+${data.difference_kg}kg` : `-${data.difference_kg}kg`})
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-base sm:text-lg font-semibold text-neutral-800 dark:text-white font-sans">
            {data.estimated_months}
          </div>
          <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">{data.estimated_weeks}</div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/70 dark:border-neutral-700/50">
          <div className="flex items-center gap-1.5 mb-0.5">
            <TrendingUp className="w-3 h-3 text-neutral-500" />
            <span className="text-[9px] font-mono uppercase text-neutral-500">Pacing Rate</span>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-white font-mono">
            {data.weekly_rate}
          </div>
        </div>
        <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/70 dark:border-neutral-700/50">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Flame className="w-3 h-3 text-neutral-500" />
            <span className="text-[9px] font-mono uppercase text-neutral-500">Energy Protocol</span>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-white font-mono">
            {data.calorie_strategy}
          </div>
        </div>
      </div>

      {/* Visual Roadmap Track */}
      <div className="mb-3 px-1">
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1.5">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500" />
            Start: {data.current_weight_kg}kg
          </span>
          <span className="flex items-center gap-1 font-semibold text-neutral-800 dark:text-white">
            <Target className="w-3 h-3 text-amber-500" />
            Target: {data.target_weight_kg}kg
          </span>
        </div>
        <div className="relative w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-neutral-600 to-neutral-900 dark:from-neutral-400 dark:to-neutral-100 rounded-full"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Milestones Breakdown */}
      {data.milestones && data.milestones.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
            Progression Roadmap
          </div>
          {data.milestones.map((ms, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 p-2 rounded-lg bg-neutral-50/80 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-neutral-800/80 text-[11px]"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-semibold text-neutral-800 dark:text-white">{ms.phase}</span>
                  <span className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                    {ms.weight}
                  </span>
                </div>
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">
                  {ms.focus}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
