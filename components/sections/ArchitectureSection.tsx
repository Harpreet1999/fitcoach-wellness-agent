'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import IsometricStackVisualizer from './IsometricStackVisualizer';

type ArchTab = 'Agent' | 'Tools' | 'Frontend' | 'Cloud' | 'Visualizer';

const archData: Record<'Agent' | 'Tools' | 'Frontend' | 'Cloud', { label: string; value: string; detail: string }[]> = {
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

const TAB_ORDER: ArchTab[] = ['Agent', 'Tools', 'Frontend', 'Cloud', 'Visualizer'];

const EASE_OUT_CUBIC: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Framer-motion variants
const panelVariants: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(3px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.32, ease: EASE_OUT_CUBIC },
  },
  exit: {
    opacity: 0, y: -8, filter: 'blur(3px)',
    transition: { duration: 0.18, ease: 'easeIn' },
  },
};

const rowContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.06 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.28, ease: EASE_OUT_CUBIC } },
};

export default function ArchitectureSection() {
  const [activeTab, setActiveTab] = useState<ArchTab>('Agent');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    let text = '';
    if (activeTab === 'Visualizer') {
      text = 'FitCoach AI 5-Stage Architectural Pipeline (Left to Right): Stage 01 (Client Interface) -> Stage 02 (Context Assembly) -> Stage 03 (Gemini Reasoning Core) -> Stage 04 (Tool Dispatch Router) -> Stage 05 (Cloud & Data Vault)';
    } else {
      text = archData[activeTab].map(i => `${i.label}: ${i.value} — ${i.detail}`).join('\n');
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="architecture" className="py-24 border-t border-neutral-200 dark:border-neutral-800/80 bg-[#f3f2ee]/60 dark:bg-neutral-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section eyebrow header */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
            <span>FULL AGENT ENGINEERING SPECIFICATION</span>
          </div>
        </div>

        {/* Section title & Copy button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-light text-neutral-800 dark:text-white tracking-tight font-sans">
              How FitCoach Thinks.
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light max-w-xl">
              Inspect the interactive 3D architectural stack, explore the end-to-end cognitive execution pipeline, or examine technical specifications across agent orchestration and cloud services.
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono text-neutral-700 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-white transition-colors self-start sm:self-auto shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-neutral-800 dark:text-white" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy All Specs'}</span>
          </button>
        </div>

        {/* Specs matrix layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Category tabs sidebar */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
            {TAB_ORDER.map((tab, idx) => {
              const isSelected = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative text-left px-5 py-4 rounded-xl border transition-all duration-250 whitespace-nowrap lg:whitespace-normal flex items-center justify-between overflow-hidden ${
                    isSelected
                      ? 'border-neutral-300 dark:border-neutral-500 bg-white dark:bg-neutral-800 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                  }`}
                >
                  {/* Animated left accent bar for active tab */}
                  {isSelected && (
                    <motion.span
                      layoutId="tab-accent"
                      className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-neutral-700 dark:bg-neutral-300"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className={`text-xs font-mono uppercase tracking-wider pl-1 ${isSelected ? 'font-bold text-neutral-850 dark:text-neutral-100' : 'text-neutral-500'}`}>
                    {tab}
                  </span>
                  <span className={`hidden lg:inline text-xs font-mono ${isSelected ? 'text-neutral-850 dark:text-neutral-100 font-bold' : 'text-neutral-400 dark:text-neutral-600'}`}>
                    0{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detail panel with AnimatePresence */}
          <div className="lg:col-span-9 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-6 sm:p-8"
              >
                {activeTab === 'Visualizer' ? (
                  <IsometricStackVisualizer />
                ) : (
                  <div>
                    <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6 flex items-center justify-between">
                      <h3 className="text-lg font-medium text-neutral-800 dark:text-white">{activeTab} Parameters</h3>
                      <span className="text-xs font-mono text-neutral-500">{archData[activeTab].length} Parameters</span>
                    </div>

                    <motion.div
                      className="divide-y divide-neutral-200/80 dark:divide-neutral-800/60"
                      variants={rowContainerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {archData[activeTab].map((item, i) => (
                        <motion.div
                          key={i}
                          variants={rowVariants}
                          className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-baseline"
                        >
                          <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">{item.label}</div>
                          <div className="sm:col-span-2 space-y-1">
                            <div className="text-sm font-semibold text-neutral-800 dark:text-white">{item.value}</div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400 font-light">{item.detail}</div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Footer note */}
                    <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 bg-[#f8f7f5] dark:bg-neutral-950/50 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-6 rounded-b-2xl">
                      <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-2">
                        GitHub Repository
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                        Full ADK agent code (<code className="text-neutral-800 dark:text-neutral-300 font-mono">app/agent.py</code>), A2UI renderer, FastAPI proxy, deployment manifests, and evaluation datasets are available in the GitHub repository.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
