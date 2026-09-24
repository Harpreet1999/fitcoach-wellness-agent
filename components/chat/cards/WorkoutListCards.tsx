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
    <div className="my-2 p-5 rounded-2xl border border-neutral-700 bg-neutral-900 animate-fade-up">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 rounded-xl bg-neutral-800">
          <Calendar className="w-4 h-4 text-neutral-300" />
        </div>
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">Workout Logged</div>
          <div className="text-base font-semibold text-white">{data.day}</div>
        </div>
        <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto" />
      </div>
      <div className="flex flex-wrap gap-2">
        {data.muscleGroups.map((mg) => (
          <span key={mg} className="text-sm font-medium px-3 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300">
            {mg}
          </span>
        ))}
      </div>
      {data.notes && (
        <p className="mt-3 text-xs text-neutral-500 font-light">{data.notes}</p>
      )}
    </div>
  );
}

export function WorkoutListCard({ data }: { data: WorkoutListData }) {
  const difficultyColor: Record<string, string> = {
    Beginner: 'text-emerald-400',
    Intermediate: 'text-amber-400',
    Advanced: 'text-red-400',
  };
  return (
    <div className="my-2 rounded-2xl border border-neutral-700 bg-neutral-900 overflow-hidden animate-fade-up">
      <div className="px-5 py-3 border-b border-neutral-800 flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Workout Catalog</span>
        <span className="text-xs font-mono text-neutral-600">{data.total} routines</span>
      </div>
      <div className="divide-y divide-neutral-800/60">
        {data.workouts.map((w) => (
          <div key={w.id} className="px-5 py-3 flex items-center justify-between hover:bg-neutral-800/30 transition-colors">
            <div>
              <div className="text-sm font-medium text-white">{w.name}</div>
              <div className="text-xs text-neutral-500 font-mono mt-0.5">
                {w.category} · {w.duration_mins}min · {w.primary_muscles.slice(0, 2).join(', ')}
              </div>
            </div>
            <span className={`text-[10px] font-mono uppercase ${difficultyColor[w.difficulty] || 'text-neutral-400'}`}>
              {w.difficulty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
