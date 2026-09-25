'use client';
import { Lightbulb, CheckCircle2, Moon, Droplets, Apple, RotateCcw, Brain, Activity, Sparkles } from 'lucide-react';

interface HabitData {
  id?: string;
  category: string;
  title: string;
  description: string;
  frequency: string;
  why_it_works: string;
  source: string;
  error?: string;
}

export default function HabitCard({ data }: { data: HabitData }) {
  if (data.error) {
    return (
      <div className="my-2 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-500">
        <p>{data.error}</p>
      </div>
    );
  }

  const renderCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'sleep':
        return <Moon className="w-3 h-3 text-neutral-700 dark:text-neutral-300" />;
      case 'hydration':
        return <Droplets className="w-3 h-3 text-neutral-700 dark:text-neutral-300" />;
      case 'nutrition':
        return <Apple className="w-3 h-3 text-neutral-700 dark:text-neutral-300" />;
      case 'recovery':
        return <RotateCcw className="w-3 h-3 text-neutral-700 dark:text-neutral-300" />;
      case 'mindset':
        return <Brain className="w-3 h-3 text-neutral-700 dark:text-neutral-300" />;
      case 'movement':
        return <Activity className="w-3 h-3 text-neutral-700 dark:text-neutral-300" />;
      default:
        return <Sparkles className="w-3 h-3 text-neutral-700 dark:text-neutral-300" />;
    }
  };

  return (
    <div className="my-1 p-2 sm:p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs animate-fade-up">
      <div className="flex items-start gap-1.5 mb-1.5">
        <div className="p-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 shrink-0">
          {renderCategoryIcon(data.category)}
        </div>
        <div>
          <div className="text-[8px] font-mono uppercase tracking-widest text-neutral-500 capitalize">
            {data.category} Protocol
          </div>
          <div className="text-xs font-semibold text-neutral-800 dark:text-white leading-tight">
            {data.title}
          </div>
        </div>
        <span className="ml-auto text-[8px] font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded whitespace-nowrap shrink-0 border border-neutral-200 dark:border-neutral-700">
          {data.frequency}
        </span>
      </div>

      <p className="text-[10.5px] text-neutral-600 dark:text-neutral-300 leading-relaxed font-light mb-1.5">
        {data.description}
      </p>

      <div className="p-1.5 rounded-md bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/50 mb-1.5">
        <div className="flex items-start gap-1.5">
          <Lightbulb className="w-2.5 h-2.5 text-neutral-600 dark:text-neutral-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-[8px] font-mono uppercase tracking-wider text-neutral-500 mb-0.5">
              Physiological Rationale
            </div>
            <p className="text-[10px] text-neutral-600 dark:text-neutral-400 font-light leading-snug">
              {data.why_it_works}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 text-[8px] font-mono text-neutral-500">
        <CheckCircle2 className="w-2 h-2 text-neutral-700 dark:text-neutral-400" />
        <span>Source: {data.source}</span>
      </div>
    </div>
  );
}
