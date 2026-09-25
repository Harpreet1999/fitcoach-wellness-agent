'use client';
import { Calendar, CheckCircle2 } from 'lucide-react';

interface WorkoutLogData {
  day: string;
  muscleGroups: string[];
  notes?: string;
  message?: string;
}

interface WorkoutListData {
  workouts: {
    id: string;
    name: string;
    category: string;
    difficulty: string;
    duration_mins: number;
    tags: string[];
    primary_muscles: string[];
  }[];
  total: number;
}

export function WorkoutLogCard({ data }: { data: WorkoutLogData }) {
  return (
    <div className="my-1.5 p-3.5 sm:p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm animate-fade-up">
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
          <Calendar className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
        </div>
        <div>
          <div className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">Routine Logged</div>
          <div className="text-sm font-semibold text-neutral-800 dark:text-white">{data.day}</div>
        </div>
        <CheckCircle2 className="w-4 h-4 text-neutral-800 dark:text-neutral-200 ml-auto" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {data.muscleGroups.map((mg) => (
          <span key={mg} className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300">
            {mg}
          </span>
        ))}
      </div>
      {data.notes && (
        <p className="mt-2 text-[11px] text-neutral-500 font-light leading-relaxed">{data.notes}</p>
      )}
    </div>
  );
}

export function WorkoutListCard({ data }: { data: WorkoutListData }) {
  return (
    <div className="my-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm animate-fade-up">
      <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/40 flex items-center justify-between">
        <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">Workout Catalog</span>
        <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">{data.total} routines</span>
      </div>
      <div className="divide-y divide-neutral-200/70 dark:divide-neutral-800/60">
        {data.workouts.map((w) => (
          <div key={w.id} className="px-4 py-2 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
            <div>
              <div className="text-xs sm:text-sm font-medium text-neutral-800 dark:text-white">{w.name}</div>
              <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                {w.category} · {w.duration_mins}min · {w.primary_muscles.slice(0, 2).join(', ')}
              </div>
            </div>
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              {w.difficulty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
