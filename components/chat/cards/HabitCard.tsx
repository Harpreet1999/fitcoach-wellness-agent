'use client';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

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
      <div className="my-2 p-4 rounded-2xl border border-neutral-700 bg-neutral-900">
        <p className="text-sm text-neutral-400">{data.error}</p>
      </div>
    );
  }

  const categoryEmoji: Record<string, string> = {
    sleep: '😴', hydration: '💧', nutrition: '🥗', recovery: '🔄', mindset: '🧠', movement: '🚶',
  };

  return (
    <div className="my-2 p-5 rounded-2xl border border-neutral-700 bg-neutral-900 animate-fade-up">
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2.5 rounded-xl bg-neutral-800 text-xl shrink-0">
          {categoryEmoji[data.category] || '✅'}
        </div>
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-neutral-500 capitalize">{data.category}</div>
          <div className="text-base font-semibold text-white mt-0.5">{data.title}</div>
        </div>
        <span className="ml-auto text-[10px] font-mono text-neutral-500 bg-neutral-800 px-2 py-1 rounded-md whitespace-nowrap shrink-0">
          {data.frequency}
        </span>
      </div>

      <p className="text-sm text-neutral-300 leading-relaxed font-light mb-3">{data.description}</p>

      <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/50 mb-3">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-1">Why it works</div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">{data.why_it_works}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-600">
        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
        <span>Source: {data.source}</span>
      </div>
    </div>
  );
}
