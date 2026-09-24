'use client';
import { useState } from 'react';
import { Sparkles, Layers, Cpu, Database, Activity, ExternalLink } from 'lucide-react';

interface LayerDetail {
  id: string;
  name: string;
  code: string;
  tagline: string;
  role: string;
  tech: string[];
  specs: { label: string; value: string }[];
}

const LAYER_DETAILS: Record<string, LayerDetail> = {
  interface: {
    id: 'interface',
    name: 'Interface Surface',
    code: 'LAYER 04 // INTERFACE',
    tagline: 'Reactive Client & Visual Card Runtime',
    role: 'Renders the conversational interface, stream parsing, and reactive visual cards (MacroCard, WorkoutCard, HabitCard, NutritionCard). Persists session state locally in browser storage.',
    tech: ['Next.js 16 App Router', 'React 19 Hooks', 'ReactMarkdown + remarkGfm', 'Tailwind CSS Class-Mode'],
    specs: [
      { label: 'Render Protocol', value: 'Hydrated Dynamic Cards' },
      { label: 'Storage Sync', value: 'localStorage (fitcoach_session_messages)' },
      { label: 'Theme Architecture', value: 'Kanso Dual-Mode (Light/Dark)' },
    ],
  },
  agent: {
    id: 'agent',
    name: 'Agent Logic Core',
    code: 'LAYER 03 // AGENT_LOGIC',
    tagline: 'Gemini 3.5 Flash Reasoning Engine',
    role: 'Evaluates user queries, applies strict zero-emoji tone constraints, and autonomously decides when to trigger tool calls versus returning conversational fitness commentary.',
    tech: ['Google Gemini 3.5 Flash', 'Google Generative AI SDK', 'Role-tuned System Instructions', 'Dynamic Profile Memory Injection'],
    specs: [
      { label: 'Inference Latency', value: '~550ms - 850ms' },
      { label: 'Context Window', value: '1M Tokens' },
      { label: 'Tone Constraints', value: 'Strict Zero-Emoji, Editorial Monochromatic' },
    ],
  },
  pipeline: {
    id: 'pipeline',
    name: 'Pipeline & Tool Bus',
    code: 'LAYER 02 // PIPELINE',
    tagline: 'Autonomous Function Calling Dispatcher',
    role: 'Coordinates 6 native function declarations. Validates typed parameters and dispatches execution between sports nutrition formulas, catalog filtering, and public APIs.',
    tech: ['Google ADK Patterns', 'Gemini FunctionDeclarations', 'Mifflin-St Jeor Engine', 'Fruityvice REST Bridge'],
    specs: [
      { label: 'Registered Tools', value: '6 Native Functions' },
      { label: 'Schema Validation', value: 'Strict Type-Safe SchemaType' },
      { label: 'Failover Policy', value: 'Multi-Candidate Fallback + Local Dispatcher' },
    ],
  },
  cloud: {
    id: 'cloud',
    name: 'Cloud & Data Layer',
    code: 'LAYER 01 // CLOUD',
    tagline: 'Google Cloud & AI Studio Infrastructure',
    role: 'Originally deployed on Vertex AI Reasoning Engine with Firestore and Cloud Run at the Google Build with Gemini workshop. Now runs on Google AI Studio Free Tier.',
    tech: ['Google AI Studio (Free Tier)', 'Vertex AI Reasoning Engine (Original)', 'Cloud Firestore (Workout Catalog)', 'Cloud Run (FastAPI Proxy)'],
    specs: [
      { label: 'API Provider', value: 'Google AI Studio (1,500 req/day)' },
      { label: 'Workout Catalog', value: '10+ Structured Multi-Exercise Splits' },
      { label: 'Habit Database', value: '24 ACSM/NASM Evidenced Protocols' },
    ],
  },
};

export default function IsometricStackVisualizer() {
  const [selectedLayer, setSelectedLayer] = useState<string>('agent');
  const active = LAYER_DETAILS[selectedLayer];

  return (
    <div className="space-y-6">
      {/* Top Header Eyebrow */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
            FIG_01 · THE FITCOACH ARCHITECTURE STACK
          </span>
        </div>
        <div className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
          Isometric 3D Projection · Interactive
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Isometric 3D SVG Canvas (Matching screenshot reference) */}
        <div className="lg:col-span-7 relative flex items-center justify-center p-4 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-neutral-100/50 dark:bg-neutral-950 overflow-hidden shadow-xs group">
          {/* Blueprint Dotted Background Grid */}
          <div
            className="absolute inset-0 opacity-[0.25] dark:opacity-[0.20] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Central Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Fig Number Label */}
          <div className="absolute top-4 left-5 text-[10px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase select-none">
            FIG_01 // THE STACK
          </div>

          <svg
            viewBox="0 0 600 680"
            className="w-full max-w-[500px] h-auto drop-shadow-sm select-none"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Vertical Stack Corner Connecting Lines */}
            <g
              className="stroke-neutral-300 dark:stroke-neutral-800"
              strokeWidth="1"
              strokeDasharray="3 3"
            >
              <line x1="300" y1="90" x2="300" y2="450" />
              <line x1="450" y1="165" x2="450" y2="525" />
              <line x1="300" y1="240" x2="300" y2="600" />
              <line x1="150" y1="165" x2="150" y2="525" />
            </g>

            {/* ========================================================= */}
            {/* LAYER 01: CLOUD & INFRASTRUCTURE (Bottom Extruded Base)  */}
            {/* ========================================================= */}
            <g
              onClick={() => setSelectedLayer('cloud')}
              className="cursor-pointer transition-all duration-300 group/l1"
            >
              {/* Slab Side Faces */}
              <polygon
                points="150,525 300,600 300,630 150,555"
                className={`transition-colors ${
                  selectedLayer === 'cloud'
                    ? 'fill-neutral-200 dark:fill-neutral-900 stroke-neutral-950 dark:stroke-white'
                    : 'fill-neutral-200/60 dark:fill-neutral-900/60 stroke-neutral-400 dark:stroke-neutral-700'
                }`}
                strokeWidth="1.2"
              />
              <polygon
                points="300,600 450,525 450,555 300,630"
                className={`transition-colors ${
                  selectedLayer === 'cloud'
                    ? 'fill-neutral-300 dark:fill-neutral-850 stroke-neutral-950 dark:stroke-white'
                    : 'fill-neutral-300/60 dark:fill-neutral-850/60 stroke-neutral-400 dark:stroke-neutral-700'
                }`}
                strokeWidth="1.2"
              />

              {/* Slab Top Face */}
              <polygon
                points="300,450 450,525 300,600 150,525"
                className={`transition-colors ${
                  selectedLayer === 'cloud'
                    ? 'fill-white dark:fill-neutral-900 stroke-neutral-950 dark:stroke-white'
                    : 'fill-white/80 dark:fill-neutral-900/70 stroke-neutral-300 dark:stroke-neutral-700 hover:stroke-neutral-500'
                }`}
                strokeWidth="1.2"
              />

              {/* Text Tag on Face */}
              <text
                x="220"
                y="570"
                transform="rotate(26, 220, 570) skewX(-20)"
                className="text-[9px] font-mono tracking-widest uppercase fill-neutral-400 dark:fill-neutral-500 pointer-events-none"
              >
                LAYER 01 // CLOUD
              </text>

              {/* 3 Cylindrical Canisters (Storage & DB) */}
              {/* Left Cylinder */}
              <g className="stroke-neutral-400 dark:stroke-neutral-600 fill-white dark:fill-neutral-900" strokeWidth="1">
                <path d="M 210,505 v 20 a 16 8 0 0 0 32 0 v -20" />
                <ellipse cx="226" cy="505" rx="16" ry="8" />
              </g>

              {/* Middle Cylinder (ACTIVE NEON DATABASE) */}
              <g className="stroke-emerald-400 dark:stroke-emerald-500 fill-emerald-500/20 dark:fill-emerald-950/60" strokeWidth="1.5">
                <path d="M 284,525 v 25 a 20 10 0 0 0 40 0 v -25" />
                <ellipse cx="304" cy="525" rx="20" ry="10" className="fill-emerald-500 dark:fill-emerald-600" />
              </g>

              {/* Right Cylinder */}
              <g className="stroke-neutral-400 dark:stroke-neutral-600 fill-white dark:fill-neutral-900" strokeWidth="1">
                <path d="M 360,490 v 20 a 16 8 0 0 0 32 0 v -20" />
                <ellipse cx="376" cy="490" rx="16" ry="8" />
              </g>

              {/* Bottom Support Block */}
              <polygon
                points="380,530 420,510 440,520 400,540"
                className="stroke-neutral-400 dark:stroke-neutral-700 fill-white dark:fill-neutral-900"
                strokeWidth="1"
              />
            </g>

            {/* ========================================================= */}
            {/* LAYER 02: PIPELINE & TOOL BUS                            */}
            {/* ========================================================= */}
            <g
              onClick={() => setSelectedLayer('pipeline')}
              className="cursor-pointer transition-all duration-300"
            >
              {/* Pipeline Plane */}
              <polygon
                points="300,330 450,405 300,480 150,405"
                className={`transition-colors ${
                  selectedLayer === 'pipeline'
                    ? 'fill-white dark:fill-neutral-900 stroke-neutral-950 dark:stroke-white'
                    : 'fill-white/80 dark:fill-neutral-900/60 stroke-neutral-300 dark:stroke-neutral-700 hover:stroke-neutral-500'
                }`}
                strokeWidth="1.2"
              />

              {/* Text on Layer */}
              <text
                x="220"
                y="450"
                transform="rotate(26, 220, 450) skewX(-20)"
                className="text-[9px] font-mono tracking-widest uppercase fill-neutral-400 dark:fill-neutral-500 pointer-events-none"
              >
                LAYER 02 // PIPELINE
              </text>

              {/* Dual Bus Rails */}
              <g className="stroke-neutral-400 dark:stroke-neutral-600" strokeWidth="1">
                <line x1="200" y1="380" x2="380" y2="470" />
                <line x1="215" y1="375" x2="395" y2="465" />
                <line x1="230" y1="370" x2="410" y2="460" />
              </g>

              {/* Moving Neon Data Packet Box */}
              <g filter="url(#glow-green)">
                <polygon
                  points="295,415 315,405 325,410 305,420"
                  className="fill-emerald-400 stroke-emerald-500"
                  strokeWidth="1"
                />
                <polygon
                  points="295,415 305,420 305,426 295,421"
                  className="fill-emerald-500 stroke-emerald-600"
                  strokeWidth="1"
                />
                <polygon
                  points="305,420 325,410 325,416 305,426"
                  className="fill-emerald-600 stroke-emerald-700"
                  strokeWidth="1"
                />
              </g>

              {/* Channel Junction Boxes */}
              <polygon
                points="330,430 365,412 385,422 350,440"
                className="stroke-neutral-400 dark:stroke-neutral-600 fill-neutral-100 dark:fill-neutral-800"
                strokeWidth="1"
              />
              <polygon
                points="390,445 420,430 435,438 405,453"
                className="stroke-neutral-400 dark:stroke-neutral-600 fill-neutral-100 dark:fill-neutral-800"
                strokeWidth="1"
              />
            </g>

            {/* ========================================================= */}
            {/* LAYER 03: AGENT LOGIC (Center Neon Cube Node)            */}
            {/* ========================================================= */}
            <g
              onClick={() => setSelectedLayer('agent')}
              className="cursor-pointer transition-all duration-300"
            >
              {/* Agent Plane */}
              <polygon
                points="300,210 450,285 300,360 150,285"
                className={`transition-colors ${
                  selectedLayer === 'agent'
                    ? 'fill-white dark:fill-neutral-900 stroke-neutral-950 dark:stroke-white'
                    : 'fill-white/80 dark:fill-neutral-900/60 stroke-neutral-300 dark:stroke-neutral-700 hover:stroke-neutral-500'
                }`}
                strokeWidth="1.2"
              />

              {/* Text on Layer */}
              <text
                x="220"
                y="330"
                transform="rotate(26, 220, 330) skewX(-20)"
                className="text-[9px] font-mono tracking-widest uppercase fill-neutral-400 dark:fill-neutral-500 pointer-events-none"
              >
                LAYER 03 // AGENT_LOGIC
              </text>

              {/* Logic Bus Channels */}
              <g className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1">
                <line x1="220" y1="260" x2="380" y2="340" />
                <line x1="235" y1="255" x2="395" y2="335" />
              </g>

              {/* Auxiliary Wireframe Node Cubes */}
              <g className="stroke-neutral-400 dark:stroke-neutral-600 fill-white/80 dark:fill-neutral-800/80" strokeWidth="1">
                {/* Secondary module box */}
                <polygon points="380,290 415,272 430,280 395,298" />
                <polygon points="380,290 395,298 395,308 380,300" />
                <polygon points="395,298 430,280 430,290 395,308" />
              </g>

              {/* PROMINENT GLOWING NEON AGENT NODE (Matches Screenshot Center Cube) */}
              <g filter="url(#glow-green)" className="transition-transform duration-300">
                {/* Cube Top Face */}
                <polygon
                  points="300,240 335,222 300,204 265,222"
                  className="fill-emerald-400/90 dark:fill-emerald-400 stroke-emerald-300 dark:stroke-emerald-300"
                  strokeWidth="1.5"
                />
                {/* Cube Left Face */}
                <polygon
                  points="265,222 300,240 300,280 265,262"
                  className="fill-emerald-500/90 dark:fill-emerald-600 stroke-emerald-400 dark:stroke-emerald-400"
                  strokeWidth="1.5"
                />
                {/* Cube Right Face */}
                <polygon
                  points="300,240 335,222 335,262 300,280"
                  className="fill-emerald-600/90 dark:fill-emerald-700 stroke-emerald-400 dark:stroke-emerald-400"
                  strokeWidth="1.5"
                />
              </g>
            </g>

            {/* ========================================================= */}
            {/* LAYER 04: INTERFACE (Top Surface & Selected Neon Bar)     */}
            {/* ========================================================= */}
            <g
              onClick={() => setSelectedLayer('interface')}
              className="cursor-pointer transition-all duration-300"
            >
              {/* Interface Plane */}
              <polygon
                points="300,90 450,165 300,240 150,165"
                className={`transition-colors ${
                  selectedLayer === 'interface'
                    ? 'fill-white dark:fill-neutral-900 stroke-neutral-950 dark:stroke-white'
                    : 'fill-white/80 dark:fill-neutral-900/60 stroke-neutral-300 dark:stroke-neutral-700 hover:stroke-neutral-500'
                }`}
                strokeWidth="1.2"
              />

              {/* Text on Layer */}
              <text
                x="220"
                y="210"
                transform="rotate(26, 220, 210) skewX(-20)"
                className="text-[9px] font-mono tracking-widest uppercase fill-neutral-400 dark:fill-neutral-500 pointer-events-none"
              >
                LAYER 04 // INTERFACE
              </text>

              {/* Top Controls: Circular pill & slots */}
              <g className="stroke-neutral-400 dark:stroke-neutral-600 fill-none" strokeWidth="1">
                <ellipse cx="270" cy="130" rx="6" ry="3" />
                <line x1="280" y1="135" x2="300" y2="145" />
                {/* Secondary Slot */}
                <polygon points="260,115 380,175 365,183 245,123" />
              </g>

              {/* VIBRANT NEON GREEN ACTIVE BAR (Matches "SELECTED ITEM" in Screenshot) */}
              <g filter="url(#glow-green)">
                <polygon
                  points="230,135 390,215 375,225 215,145"
                  className="fill-emerald-400 stroke-emerald-300"
                  strokeWidth="1.5"
                />
                {/* Left facet */}
                <polygon
                  points="215,145 230,135 230,140 215,150"
                  className="fill-emerald-500"
                />
                {/* Front facet */}
                <polygon
                  points="215,145 375,225 375,230 215,150"
                  className="fill-emerald-600 stroke-emerald-500"
                  strokeWidth="1"
                />
              </g>

              {/* Wireframe Card Slot */}
              <polygon
                points="195,155 215,145 225,150 205,160"
                className="stroke-neutral-400 dark:stroke-neutral-600 fill-white dark:fill-neutral-900"
                strokeWidth="1"
              />
            </g>

            {/* ========================================================= */}
            {/* LEADER LINES & MONOSPACE CALLOUT ANNOTATIONS              */}
            {/* ========================================================= */}
            {/* Left Annotations */}
            <g
              className="text-[10px] font-mono tracking-widest uppercase fill-neutral-700 dark:fill-neutral-300"
              strokeWidth="1"
            >
              {/* Interface callout */}
              <line
                x1="80"
                y1="165"
                x2="150"
                y2="165"
                className="stroke-neutral-400 dark:stroke-neutral-600"
                strokeDasharray="2 2"
              />
              <circle cx="150" cy="165" r="2.5" className="fill-neutral-900 dark:fill-white" />
              <text x="10" y="169">
                INTERFACE
              </text>

              {/* Agent Logic callout */}
              <line
                x1="80"
                y1="285"
                x2="150"
                y2="285"
                className="stroke-neutral-400 dark:stroke-neutral-600"
                strokeDasharray="2 2"
              />
              <circle cx="150" cy="285" r="2.5" className="fill-neutral-900 dark:fill-white" />
              <text x="5" y="289">
                AGENT LOGIC
              </text>

              {/* Pipeline callout */}
              <line
                x1="80"
                y1="405"
                x2="150"
                y2="405"
                className="stroke-neutral-400 dark:stroke-neutral-600"
                strokeDasharray="2 2"
              />
              <circle cx="150" cy="405" r="2.5" className="fill-neutral-900 dark:fill-white" />
              <text x="18" y="409">
                PIPELINE
              </text>

              {/* Cloud callout */}
              <line
                x1="80"
                y1="525"
                x2="150"
                y2="525"
                className="stroke-neutral-400 dark:stroke-neutral-600"
                strokeDasharray="2 2"
              />
              <circle cx="150" cy="525" r="2.5" className="fill-neutral-900 dark:fill-white" />
              <text x="32" y="529">
                CLOUD
              </text>
            </g>

            {/* Right Annotations */}
            <g
              className="text-[10px] font-mono tracking-widest uppercase fill-neutral-700 dark:fill-neutral-300"
              strokeWidth="1"
            >
              {/* Selected Item callout */}
              <line
                x1="380"
                y1="220"
                x2="490"
                y2="220"
                className="stroke-emerald-500"
                strokeDasharray="2 2"
              />
              <circle cx="380" cy="220" r="2.5" className="fill-emerald-500" />
              <text x="495" y="224" className="fill-emerald-600 dark:fill-emerald-400 font-bold">
                SELECTED ITEM
              </text>

              {/* Agent Node callout */}
              <line
                x1="300"
                y1="240"
                x2="490"
                y2="240"
                className="stroke-emerald-500"
                strokeDasharray="2 2"
              />
              <circle cx="300" cy="240" r="3" className="fill-white dark:fill-white stroke-emerald-500" />
              <text x="495" y="244" className="fill-neutral-900 dark:fill-white font-semibold">
                AGENT NODE
              </text>
            </g>
          </svg>
        </div>

        {/* Right Detail HUD & Spec Inspection */}
        <div className="lg:col-span-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-6 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
                {active.code}
              </span>
              <span className="text-[11px] font-mono text-neutral-400">Telemetry Active</span>
            </div>

            <div>
              <h3 className="text-xl font-medium text-neutral-900 dark:text-white tracking-tight">
                {active.name}
              </h3>
              <p className="text-xs font-mono text-neutral-500 mt-0.5 uppercase tracking-wide">
                {active.tagline}
              </p>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
              {active.role}
            </p>

            {/* Specifications list */}
            <div className="space-y-2 pt-2">
              {active.specs.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/60 text-xs"
                >
                  <span className="font-mono text-neutral-500 dark:text-neutral-400 text-[11px]">
                    {s.label}
                  </span>
                  <span className="font-medium text-neutral-900 dark:text-white text-[11px] text-right truncate max-w-[200px]">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Tech stack badges */}
            <div className="pt-2">
              <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                Underlying Technologies
              </div>
              <div className="flex flex-wrap gap-1.5">
                {active.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>Click any layer in 3D to inspect</span>
            <span className="text-neutral-900 dark:text-white font-semibold">Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
