'use client';
import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Cpu,
  GitBranch,
  Database,
  LayoutDashboard,
  Play,
  Pause,
  ArrowRight,
  CheckCircle2,
  Code2,
  Sparkles,
} from 'lucide-react';

interface Stage {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  icon: typeof MessageSquare;
  tag: string;
  summary: string;
  inputPayload: Record<string, unknown>;
  outputPayload: Record<string, unknown>;
  codeSnippet: string;
}

const STAGES: Stage[] = [
  {
    id: 'intake',
    stepNumber: '01',
    title: 'Input & Memory Intake',
    subtitle: 'Context Enrichment',
    icon: MessageSquare,
    tag: 'CLIENT_PAYLOAD',
    summary:
      'Receives user natural language inquiry, retrieves current session attributes (weight, age, goal) from localStorage, and formats multi-turn chat history into a structured message array.',
    inputPayload: {
      inquiry: "I'm 75kg, 178cm, 25 years old. Calculate my cutting macros.",
      sessionProfile: { age: 25, weight_kg: 75, height_cm: 178, goal: 'weight_loss' },
      historyDepth: 3,
    },
    outputPayload: {
      messages: [
        { role: 'user', content: "I'm 75kg, 178cm, 25 years old. Calculate my cutting macros." },
      ],
      systemContext: 'In-Session Memory Profile Attached',
    },
    codeSnippet: `// lib/memory.ts
const profile = getProfile();
const payload = {
  messages: history.concat(newMsg),
  userProfile: profile
};`,
  },
  {
    id: 'reasoning',
    stepNumber: '02',
    title: 'Gemini 3.5 Flash Reasoning',
    subtitle: 'Intent & Tool Calling',
    icon: Cpu,
    tag: 'LLM_INFERENCE',
    summary:
      'The Gemini model processes system prompts, enforces zero-emoji tone constraints, and determines which of the registered tools to invoke via native function calling.',
    inputPayload: {
      model: 'gemini-3.5-flash',
      toolsDeclared: 6,
      instruction: 'FitCoach AI: Evaluate intent, trigger calculate_macros_and_bmr if biometrics present',
    },
    outputPayload: {
      call: 'calculate_macros_and_bmr',
      arguments: {
        weight_kg: 75,
        height_cm: 178,
        age: 25,
        gender: 'male',
        activity_level: 'moderate',
        goal: 'weight_loss',
      },
    },
    codeSnippet: `// app/api/chat/route.ts
const model = genAI.getGenerativeModel({
  model: 'gemini-3.5-flash',
  tools: [{ functionDeclarations }]
});
const response = await chat.sendMessage(userPrompt);`,
  },
  {
    id: 'dispatch',
    stepNumber: '03',
    title: 'Tool Dispatch Router',
    subtitle: 'Function Dispatching',
    icon: GitBranch,
    tag: 'ORCHESTRATOR',
    summary:
      'The agent runtime detects the functionCall part from Gemini candidates and dispatches execution to the corresponding handler module.',
    inputPayload: {
      requestedTool: 'calculate_macros_and_bmr',
      status: 'DISPATCHING',
      availableRoutes: [
        'calculate_macros_and_bmr',
        'list_workouts',
        'get_workout',
        'get_recommended_habit',
        'get_fruit_nutrition',
        'log_workout_routine',
      ],
    },
    outputPayload: {
      targetModule: 'lib/macros.ts -> calculateMacros()',
      validation: 'PASSED_SCHEMA_CHECK',
    },
    codeSnippet: `switch (functionName) {
  case 'calculate_macros_and_bmr':
    toolResult = calculateMacrosAndBmr(args.weight_kg, args.height_cm, ...);
    break;
  case 'get_recommended_habit':
    toolResult = getRecommendedHabit(args.category);
    break;
}`,
  },
  {
    id: 'execution',
    stepNumber: '04',
    title: 'Deterministic Engine & APIs',
    subtitle: 'Computation & Catalogs',
    icon: Database,
    tag: 'DATA_LAYER',
    summary:
      'Executes verified calculations (Mifflin-St Jeor), reads curated JSON databases (50+ exercises, 24 habit protocols), or calls public APIs (Fruityvice).',
    inputPayload: {
      formula: 'Mifflin-St Jeor BMR Equation',
      activityMultiplier: 1.55,
      deficitPercentage: '18% Caloric Deficit',
    },
    outputPayload: {
      bmr: 1740,
      tdee: 2697,
      target_calories: 2201,
      protein_g: 172,
      carbs_g: 228,
      fat_g: 65,
    },
    codeSnippet: `// lib/macros.ts
const bmr = Math.round(10 * weight + 6.25 * height - 5 * age + 5);
const tdee = Math.round(bmr * activityMultipliers[level]);
const target = goal === 'weight_loss' ? Math.round(tdee * 0.82) : tdee;`,
  },
  {
    id: 'synthesis',
    stepNumber: '05',
    title: 'Dual-Stream Response UI',
    subtitle: 'Visual Card + Markdown',
    icon: LayoutDashboard,
    tag: 'CLIENT_RENDER',
    summary:
      'Client receives both structured card JSON and conversational companion markdown. It mounts rich interactive components (MacroCard, WorkoutCard) while streaming concise text.',
    inputPayload: {
      cardType: 'macro_card',
      data: '{ bmr: 1740, tdee: 2697, target_calories: 2201, ... }',
      textResponse: 'Based on your biometrics, here is your calculated caloric deficit...',
    },
    outputPayload: {
      uiComponentsMounted: ['<MacroCard />', '<ReactMarkdown />'],
      storageUpdated: 'fitcoach_messages',
      renderStatus: '200_SUCCESS',
    },
    codeSnippet: `// components/chat/ChatInterface.tsx
<CardRenderer cards={msg.cards} />
<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {msg.parts[0].text}
</ReactMarkdown>`,
  },
];

export default function AgentFlowVisualizer() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play timeline loop
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStageIndex((prev) => (prev + 1) % STAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const activeStage = STAGES[activeStageIndex];

  return (
    <div className="space-y-6">
      {/* Top Controls & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            Agent Execution Pipeline // Interactive
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-850 text-neutral-700 dark:text-neutral-300 text-xs font-mono hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3" /> <span>Pause Flow</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" /> <span>Auto Play</span>
              </>
            )}
          </button>
          <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
            Stage {activeStage.stepNumber} of 05
          </span>
        </div>
      </div>

      {/* Stepper Timeline Navigation — Inspired by Kanso & AI Anchor */}
      <div className="relative flex items-center justify-between gap-1 overflow-x-auto pb-3 pt-1 px-1">
        {/* Horizontal Spine Connector */}
        <div className="absolute top-5 left-6 right-6 h-[1.5px] bg-neutral-200 dark:bg-neutral-800 -z-0 pointer-events-none" />

        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = idx === activeStageIndex;
          const isPassed = idx < activeStageIndex;
          return (
            <button
              key={stage.id}
              onClick={() => {
                setActiveStageIndex(idx);
                setIsPlaying(false);
              }}
              className="relative z-10 flex flex-col items-center gap-2 min-w-[72px] sm:min-w-[90px] group transition-all"
            >
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-md scale-110'
                    : isPassed
                    ? 'bg-white dark:bg-neutral-900 border-neutral-400 dark:border-neutral-600 text-neutral-900 dark:text-white'
                    : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-600 group-hover:border-neutral-400 dark:group-hover:border-neutral-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-center">
                <span
                  className={`block text-[10px] font-mono tracking-wider uppercase transition-colors ${
                    isActive
                      ? 'text-neutral-950 dark:text-white font-bold'
                      : 'text-neutral-400 dark:text-neutral-500'
                  }`}
                >
                  {stage.stepNumber}
                </span>
                <span
                  className={`hidden sm:block text-[11px] font-medium truncate max-w-[85px] ${
                    isActive ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  {stage.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Block Diagram Stage View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Active Stage Overview & Architectural Rationale */}
        <div className="lg:col-span-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 p-6 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold">
                {activeStage.tag}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                <span>Phase</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{activeStage.stepNumber}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-medium text-neutral-950 dark:text-white tracking-tight">
                {activeStage.title}
              </h4>
              <p className="text-xs font-mono text-neutral-500 mt-0.5 uppercase tracking-wide">
                {activeStage.subtitle}
              </p>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
              {activeStage.summary}
            </p>
          </div>

          {/* Code snippet inspection */}
          <div className="mt-6 pt-4 border-t border-neutral-200/70 dark:border-neutral-800">
            <div className="flex items-center gap-2 mb-2 text-xs font-mono text-neutral-500">
              <Code2 className="w-3.5 h-3.5" />
              <span>Implementation Hook</span>
            </div>
            <pre className="p-3 rounded-xl bg-neutral-100/80 dark:bg-neutral-950/80 border border-neutral-200 dark:border-neutral-800/80 text-[11px] font-mono text-neutral-800 dark:text-neutral-300 overflow-x-auto leading-relaxed">
              {activeStage.codeSnippet}
            </pre>
          </div>
        </div>

        {/* Right: Real-time Payload & Data Flow Inspector */}
        <div className="lg:col-span-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/60 p-6 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                Telemetry & Payload
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Live Schema Verified
              </span>
            </div>

            {/* Inbound state */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-neutral-400" />
                <span>Inbound State</span>
              </div>
              <pre className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-700 dark:text-neutral-300 overflow-x-auto leading-relaxed max-h-36 overflow-y-auto">
                {JSON.stringify(activeStage.inputPayload, null, 2)}
              </pre>
            </div>

            {/* Outbound state */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-emerald-500" />
                <span>Outbound Dispatch</span>
              </div>
              <pre className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-700 dark:text-neutral-300 overflow-x-auto leading-relaxed max-h-36 overflow-y-auto">
                {JSON.stringify(activeStage.outputPayload, null, 2)}
              </pre>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <span>Pattern: Google ADK Engine</span>
            <span>Latency: ~650ms</span>
          </div>
        </div>
      </div>

      {/* Tool Dispatch Matrix Grid */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-500 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Tool Bus</span>
          </div>
          <span className="text-[10px] font-mono text-neutral-400">6 Native Function Declarations</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center">
          {[
            { name: 'calculate_macros', label: 'Macro BMR Engine' },
            { name: 'list_workouts', label: 'Catalog Filter' },
            { name: 'get_workout', label: 'Routine Detail' },
            { name: 'get_recommended_habit', label: 'Habit Protocol' },
            { name: 'get_fruit_nutrition', label: 'Fruityvice API' },
            { name: 'log_workout_routine', label: 'Split Logger' },
          ].map((tool) => (
            <div
              key={tool.name}
              className={`p-2.5 rounded-xl border transition-all ${
                activeStage.id === 'dispatch' || activeStage.id === 'execution'
                  ? 'border-neutral-950 dark:border-white bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white'
                  : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <div className="text-[10px] font-mono font-semibold truncate">{tool.name}</div>
              <div className="text-[9px] text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
                {tool.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
