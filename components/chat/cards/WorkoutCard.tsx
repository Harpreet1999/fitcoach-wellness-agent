'use client';
import { Dumbbell, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  intensity: string;
  tips: string;
  muscle_group: string;
}

interface WorkoutData {
  id?: string;
  name: string;
  category: string;
  difficulty: string;
  duration_mins: number;
  primary_muscles: string[];
  tags: string[];
  description: string;
  exercises?: Exercise[];
  error?: string;
}

export default function WorkoutCard({ data }: { data: WorkoutData }) {
  const [expanded, setExpanded] = useState(false);

  if (data.error) {
    return (
      <div className="my-2 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <p className="text-sm text-neutral-500">{data.error}</p>
      </div>
    );
  }

  return (
    <div className="my-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm animate-fade-up">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
              <Dumbbell className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">{data.category}</div>
              <div className="text-base font-semibold text-neutral-800 dark:text-white">{data.name}</div>
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
            {data.difficulty}
          </span>
        </div>

        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">{data.description}</p>

        <div className="flex items-center gap-4 mt-3 text-xs font-mono text-neutral-500">
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{data.duration_mins} min</span>
          <span>{data.primary_muscles?.join(' · ')}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {data.tags?.map((tag) => (
            <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-700/60">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Exercises toggle */}
      {data.exercises && data.exercises.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
          >
            <span>{data.exercises.length} Exercises Included</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expanded && (
            <div className="border-t border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200/70 dark:divide-neutral-800/60 bg-neutral-50/40 dark:bg-neutral-950/20 animate-fade-in">
              {data.exercises.map((ex, i) => (
                <div key={i} className="px-5 py-3 grid grid-cols-3 gap-2 text-xs">
                  <div className="col-span-2">
                    <div className="font-medium text-neutral-800 dark:text-neutral-100">{ex.name}</div>
                    <div className="text-neutral-500 mt-0.5 font-light leading-relaxed">{ex.tips}</div>
                  </div>
                  <div className="text-right text-neutral-600 dark:text-neutral-400 font-mono">
                    <div className="font-semibold text-neutral-800 dark:text-neutral-200">{ex.sets} × {ex.reps}</div>
                    <div className="text-[10px] text-neutral-400 dark:text-neutral-500">{ex.rest_seconds}s rest</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
