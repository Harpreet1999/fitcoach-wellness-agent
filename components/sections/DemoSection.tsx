'use client';
import dynamic from 'next/dynamic';
import { Calendar, Flame, Dumbbell, Apple, Moon, Sparkles } from 'lucide-react';

const ChatInterface = dynamic(() => import('@/components/chat/ChatInterface'), { ssr: false });

const QUICK_PROMPTS = [
  {
    icon: Calendar,
    title: 'Log Workout Split',
    prompt: 'Log my training split: Push on Monday/Thursday, Pull on Tuesday/Friday, Legs on Wednesday/Saturday',
  },
  {
    icon: Flame,
    title: 'Calculate Macros & BMR',
    prompt: "I'm 75kg, 178cm, 25 years old male, moderate activity. Calculate my macro split for cutting.",
  },
  {
    icon: Dumbbell,
    title: 'Chest & Triceps Routine',
    prompt: 'Show me the chest and triceps strength workout from your catalog with exercise details',
  },
  {
    icon: Apple,
    title: 'Fruit Nutrition Lookup',
    prompt: 'What is the nutritional profile of a banana per 100g?',
  },
  {
    icon: Moon,
    title: 'Sleep Optimization',
    prompt: 'Give me a science-backed sleep habit recommendation',
  },
  {
    icon: Sparkles,
    title: 'Recovery Protocol',
    prompt: 'What are the best habits for muscular and nervous system recovery?',
  },
];

export default function DemoSection() {
  const handlePromptClick = (prompt: string) => {
    window.dispatchEvent(new CustomEvent('fitcoach-prompt', { detail: prompt }));
  };

  return (
    <section id="demo" className="py-24 border-t border-neutral-200 dark:border-neutral-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-14 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Interactive Agent
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-neutral-800 dark:text-white tracking-tight">
            Ask FitCoach Anything.
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light max-w-xl">
            Live fitness intelligence running on Google Gemini. Uses autonomous tool invocation to perform calculations and catalog queries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Quick prompt chips */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3.5 h-4 flex items-center">
              Preset Inquiries
            </div>
            <div className="flex flex-col gap-2.5 flex-1">
              {QUICK_PROMPTS.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.title}
                    onClick={() => handlePromptClick(p.prompt)}
                    className="text-left p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-neutral-950/60 transition-all duration-300 ease-out group shadow-sm focus:outline-none focus:border-neutral-300 dark:focus:border-neutral-700"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 text-neutral-700 dark:text-neutral-300 group-hover:scale-110 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 group-hover:border-neutral-300 dark:group-hover:border-neutral-500 transition-all duration-250 ease-out">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs font-semibold text-neutral-800 dark:text-white group-hover:text-neutral-900 dark:group-hover:text-neutral-50 transition-colors duration-200">
                        {p.title}
                      </div>
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 font-mono mt-2 leading-relaxed line-clamp-2 transition-colors duration-200">
                      {p.prompt}
                    </div>
                  </button>
                );
              })}

              {/* Note */}
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-[#f8f7f5] dark:bg-neutral-900/70 mt-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-1">In-Session Memory</div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                  Conversation history and calculated metrics persist locally in your session storage. Refresh to reset.
                </p>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-8 flex flex-col lg:pt-[30px] min-h-0">
            <ChatInterface />
          </div>

        </div>
      </div>
    </section>
  );
}
