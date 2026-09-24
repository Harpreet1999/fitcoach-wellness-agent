'use client';
import { useState } from 'react';
import { CheckCircle2, Dumbbell, Calculator, Database, Leaf, Lightbulb, Image as ImageIcon } from 'lucide-react';

type FilterTab = 'all' | 'fitness' | 'nutrition' | 'generation';

const capabilities = [
  {
    category: 'fitness' as FilterTab,
    title: 'Weekly Split Tracking',
    description: 'Log and persist your training schedule. Tell FitCoach your push/pull/legs split and it remembers across your session — Monday: Chest & Triceps, Tuesday: Back & Biceps, and so on.',
    metric: 'Memory Persistent',
    icon: <Dumbbell className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />,
    tool: 'log_workout_routine',
    span: 'md:col-span-8',
  },
  {
    category: 'nutrition' as FilterTab,
    title: 'BMR & Macro Engine',
    description: 'Calculates your Basal Metabolic Rate and daily macro targets using the Mifflin-St Jeor equation — the gold standard in sports nutrition.',
    metric: 'Mifflin-St Jeor',
    icon: <Calculator className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />,
    tool: 'calculate_macros_and_bmr',
    span: 'md:col-span-4',
  },
  {
    category: 'fitness' as FilterTab,
    title: 'Workout Catalog',
    description: 'Access 10+ full workout routines across Strength, HIIT, Yoga, and Mobility. Each with exercises, sets, reps, rest, and coaching tips.',
    metric: '50+ Exercises',
    icon: <Database className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />,
    tool: 'list_workouts / get_workout',
    span: 'md:col-span-4',
  },
  {
    category: 'nutrition' as FilterTab,
    title: 'Live Nutrition Data',
    description: 'Fetch real-time nutritional breakdown for any fruit — calories, protein, carbs, fat, and sugar via the Fruityvice public API.',
    metric: 'Live API',
    icon: <Leaf className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />,
    tool: 'get_fruit_nutrition',
    span: 'md:col-span-4',
  },
  {
    category: 'fitness' as FilterTab,
    title: 'Habit Recommendations',
    description: 'Evidence-based wellness habits across 6 categories: sleep, hydration, nutrition, recovery, mindset, and movement — all sourced from ACSM and NASM guidelines.',
    metric: '24 Habits · 6 Categories',
    icon: <Lightbulb className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />,
    tool: 'get_recommended_habit',
    span: 'md:col-span-4',
  },
  {
    category: 'generation' as FilterTab,
    title: 'AI Intelligence & Reasoning',
    description: 'Contextual, multi-turn reasoning that adapts workout protocols and nutrition targets dynamically to user profile constraints.',
    metric: 'Gemini 3.5 Flash',
    icon: <ImageIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />,
    tool: 'gemini_multiturn_reasoning',
    span: 'md:col-span-8',
  },
];

export default function CapabilitiesGrid() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filtered = activeTab === 'all'
    ? capabilities
    : capabilities.filter(c => c.category === activeTab);

  return (
    <section id="capabilities" className="py-24 border-t border-neutral-200 dark:border-neutral-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              Agent Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-neutral-800 dark:text-white tracking-tight">
              Six Tools. One Agent.
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
              Every capability is wired as a function-callable tool — adhering to Google&apos;s ADK patterns, running live on Gemini 3.5 Flash.
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 self-start md:self-end">
            {(['all', 'fitness', 'nutrition', 'generation'] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-neutral-800 text-neutral-100 dark:bg-neutral-200 dark:text-neutral-900 shadow-xs'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {filtered.map((cap, idx) => (
            <div
              key={idx}
              className={`${cap.span} p-7 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between group shadow-sm`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 group-hover:scale-105 transition-transform duration-200">
                    {cap.icon}
                  </div>
                  <span className="font-mono text-xs text-neutral-600 dark:text-neutral-400 font-semibold px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
                    {cap.metric}
                  </span>
                </div>
                <h3 className="text-xl font-medium text-neutral-800 dark:text-white">{cap.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">{cap.description}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-neutral-200/70 dark:border-neutral-800/60 flex items-center gap-2 text-xs font-mono text-neutral-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                <span>Tool: <code className="text-neutral-700 dark:text-neutral-400">{cap.tool}</code></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
