'use client';
import { useState } from 'react';
import { Layers, Copy, Check, GitFork } from 'lucide-react';
import AgentFlowVisualizer from './AgentFlowVisualizer';

type ArchTab = 'Architecture' | 'Agent' | 'Tools' | 'Frontend' | 'Cloud';

const archData: Record<Exclude<ArchTab, 'Architecture'>, { label: string; value: string; detail: string }[]> = {
  Agent: [
    { label: 'Framework', value: 'Google ADK Patterns', detail: 'Agent Development Kit tool orchestration architecture' },
    { label: 'Model', value: 'gemini-3.5-flash', detail: 'Google Gemini 3.5 Flash via AI Studio API' },
    { label: 'Tool Protocol', value: 'Function Calling', detail: 'Gemini native function declarations with auto-dispatch' },
    { label: 'Memory', value: 'In-Session (localStorage)', detail: 'Conversation history + user profile persisted in browser' },
    { label: 'System Prompt', value: 'Instruction-tuned', detail: 'Role-based system prompt with strict zero-emoji styling' },
    { label: 'Original Deployment', value: 'Vertex AI Agent Engine', detail: 'Production: Reasoning Engine ID 5331041500899835904' },
  ],
  Tools: [
    { label: 'log_workout_routine', value: 'Workout Logger', detail: 'Persists weekly training splits to session memory' },
    { label: 'calculate_macros_and_bmr', value: 'Macro Engine', detail: 'Mifflin-St Jeor BMR + TDEE + macro split calculation' },
    { label: 'list_workouts', value: 'Catalog Browser', detail: 'Filters 10+ routines from workoutCatalog.json' },
    { label: 'get_workout', value: 'Routine Detail', detail: 'Full exercise breakdown with sets, reps, tips' },
    { label: 'get_fruit_nutrition', value: 'Nutrition API', detail: 'Live data from Fruityvice public API' },
    { label: 'get_recommended_habit', value: 'Habit Engine', detail: '24 science-backed habits across 6 wellness categories' },
  ],
  Frontend: [
    { label: 'Framework', value: 'Next.js 16', detail: 'App Router, TypeScript, serverless API routes' },
    { label: 'Styling', value: 'Tailwind CSS', detail: 'Monochromatic neutral design system, light/dark mode' },
    { label: 'AI SDK', value: '@google/generative-ai', detail: 'Official Google Generative AI JavaScript SDK' },
    { label: 'Chat State', value: 'React useState + localStorage', detail: 'Messages array with browser persistence' },
    { label: 'Cards', value: 'Custom React Components', detail: 'MacroCard, WorkoutCard, HabitCard, NutritionCard' },
    { label: 'Hosting', value: 'Vercel (Free Tier)', detail: 'Serverless functions, edge network, auto-deploy from GitHub' },
  ],
  Cloud: [
    { label: 'API Provider', value: 'Google AI Studio', detail: 'Free tier: 1,500 requests/day, 1M tokens/min' },
    { label: 'Original Cloud', value: 'Google Cloud (Qwiklabs)', detail: 'Project: qwiklabs-gcp-02-144a03bc65ca, Region: us-east1' },
    { label: 'Firestore (Original)', value: 'Cloud Firestore', detail: 'Collection: workouts — workout catalog (now hardcoded JSON)' },
    { label: 'Storage (Original)', value: 'gs://fitcoach-wellness-media-84920', detail: 'GCS media bucket for generated images/videos' },
    { label: 'Agent Runtime', value: 'Vertex AI Reasoning Engine', detail: 'Resource ID: 5331041500899835904 (workshop deployment)' },
    { label: 'Frontend (Original)', value: 'Cloud Run', detail: 'FastAPI proxy server with A2A protocol and A2UI v0.8' },
  ],
};

const TAB_ORDER: ArchTab[] = ['Architecture', 'Agent', 'Tools', 'Frontend', 'Cloud'];

export default function ArchitectureSection() {
  const [activeTab, setActiveTab] = useState<ArchTab>('Architecture');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    let text = '';
    if (activeTab === 'Architecture') {
      text = 'FitCoach AI Architecture Flow: 1. Input Intake -> 2. Gemini Reasoning Core -> 3. Tool Dispatch Router -> 4. Deterministic Engine & APIs -> 5. Dual-Stream Response UI';
    } else {
      text = archData[activeTab].map(i => `${i.label}: ${i.value} — ${i.detail}`).join('\n');
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="architecture" className="py-24 border-t border-neutral-200 dark:border-neutral-800/80 bg-neutral-100/40 dark:bg-neutral-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section eyebrow header — Kanso Screenshot 1 exact style */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
            <span>FULL AGENT ENGINEERING SPECIFICATION</span>
          </div>
        </div>

        {/* Section title & Copy button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-light text-neutral-900 dark:text-white tracking-tight font-sans">
              How FitCoach Thinks.
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light max-w-xl">
              Inspect the interactive cognitive execution pipeline or explore technical specifications across agent orchestration, tools, and cloud services.
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors self-start sm:self-auto shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-white" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy All Specs'}</span>
          </button>
        </div>

        {/* Specs matrix layout — Kanso style */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Category tabs sidebar */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
            {TAB_ORDER.map((tab, idx) => {
              const isSelected = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-left px-5 py-4 rounded-xl border transition-all duration-200 whitespace-nowrap lg:whitespace-normal flex items-center justify-between ${
                    isSelected
                      ? 'border-neutral-950 dark:border-white bg-white dark:bg-neutral-900 shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/30 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <span className={`text-xs font-mono uppercase tracking-wider ${isSelected ? 'font-bold text-neutral-950 dark:text-white' : 'text-neutral-500'}`}>
                    {tab}
                  </span>
                  <span className={`hidden lg:inline text-xs font-mono ${isSelected ? 'text-neutral-950 dark:text-white font-bold' : 'text-neutral-400 dark:text-neutral-600'}`}>
                    0{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-9 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 p-6 sm:p-8 backdrop-blur-sm shadow-xs transition-colors duration-200">
            {activeTab === 'Architecture' ? (
              <AgentFlowVisualizer />
            ) : (
              <div>
                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-white">{activeTab} Parameters</h3>
                  <span className="text-xs font-mono text-neutral-500">{archData[activeTab].length} Parameters</span>
                </div>

                <div className="divide-y divide-neutral-200/80 dark:divide-neutral-800/60">
                  {archData[activeTab].map((item, i) => (
                    <div key={i} className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-baseline">
                      <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">{item.label}</div>
                      <div className="sm:col-span-2 space-y-1">
                        <div className="text-sm font-semibold text-neutral-900 dark:text-white">{item.value}</div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 font-light">{item.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer note */}
                <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-6 rounded-b-2xl">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-2">
                    GitHub Repository
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                    Full ADK agent code (<code className="text-neutral-900 dark:text-neutral-300 font-mono">app/agent.py</code>), A2UI renderer, FastAPI proxy, deployment manifests, and evaluation datasets are available in the GitHub repository.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
