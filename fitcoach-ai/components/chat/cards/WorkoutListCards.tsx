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
    <div className="my-2 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm animate-fade-up">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
          <Calendar className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Routine Logged</div>
          <div className="text-base font-semibold text-neutral-800 dark:text-white">{data.day}</div>
        </div>
        <CheckCircle2 className="w-5 h-5 text-neutral-800 dark:text-neutral-200 ml-auto" />
      </div>
      <div className="flex flex-wrap gap-2">
        {data.muscleGroups.map((mg) => (
          <span key={mg} className="text-xs font-medium px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300">
            {mg}
          </span>
        ))}
      </div>
      {data.notes && (
        <p className="mt-3 text-xs text-neutral-500 font-light leading-relaxed">{data.notes}</p>
      )}
    </div>
  );
}

export function WorkoutListCard({ data }: { data: WorkoutListData }) {
  return (
    <div className="my-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm animate-fade-up">
      <div className="px-5 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/40 flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Workout Catalog</span>
        <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500">{data.total} routines</span>
      </div>
      <div className="divide-y divide-neutral-200/70 dark:divide-neutral-800/60">
        {data.workouts.map((w) => (
          <div key={w.id} className="px-5 py-3 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
            <div>
              <div className="text-sm font-medium text-neutral-800 dark:text-white">{w.name}</div>
              <div className="text-xs text-neutral-500 font-mono mt-0.5">
                {w.category} · {w.duration_mins}min · {w.primary_muscles.slice(0, 2).join(', ')}
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              {w.difficulty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
