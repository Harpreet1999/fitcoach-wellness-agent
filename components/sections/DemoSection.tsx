'use client';
import dynamic from 'next/dynamic';

const ChatInterface = dynamic(() => import('@/components/chat/ChatInterface'), { ssr: false });

const QUICK_PROMPTS = [
  { label: '🏋️ Log PPL Split', prompt: 'Log my PPL split: Push on Monday/Thursday, Pull on Tuesday/Friday, Legs on Wednesday/Saturday' },
  { label: '📊 Calculate Macros', prompt: "I'm 75kg, 178cm, 25 years old male, moderate activity. Calculate macros for cutting." },
  { label: '💪 Chest Workout', prompt: 'Show me the chest and triceps strength workout from your database with all exercises' },
  { label: '🍌 Banana Nutrition', prompt: 'What is the nutritional breakdown of a banana?' },
  { label: '😴 Sleep Habit', prompt: 'Give me a science-backed sleep habit recommendation' },
  { label: '🖼️ Image Gen', prompt: 'Generate a motivational workout image of someone doing dumbbell bench press' },
];

export default function DemoSection() {
  const handlePromptClick = (prompt: string) => {
    // Dispatch a custom event that ChatInterface listens to
    window.dispatchEvent(new CustomEvent('fitcoach-prompt', { detail: prompt }));
  };

  return (
    <section id="demo" className="py-24 border-t border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Live Demo
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
            Ask FitCoach Anything.
          </h2>
          <p className="text-sm text-neutral-400 font-light max-w-xl">
            This is a live agent running on Gemini 2.0 Flash. It uses function calling to invoke real tools — not hardcoded responses.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Quick prompt chips */}
          <div className="lg:col-span-4">
            <div className="sticky top-28">
              <div className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4">
                Try These Prompts
              </div>
              <div className="flex flex-col gap-2">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => handlePromptClick(p.prompt)}
                    className="text-left px-4 py-3.5 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 hover:border-neutral-700 transition-all duration-200 group"
                  >
                    <div className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                      {p.label}
                    </div>
                    <div className="text-xs text-neutral-600 font-mono mt-1 leading-snug line-clamp-2">
                      {p.prompt}
                    </div>
                  </button>
                ))}
              </div>

              {/* Note */}
              <div className="mt-6 p-4 rounded-xl border border-neutral-800 bg-neutral-900/30">
                <div className="text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1">Session Memory</div>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  Your conversation and profile are stored in this browser tab only. Refresh to start fresh.
                </p>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-8">
            <ChatInterface />
          </div>

        </div>
      </div>
    </section>
  );
}
