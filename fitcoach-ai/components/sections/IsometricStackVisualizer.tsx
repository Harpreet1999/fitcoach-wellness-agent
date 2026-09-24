'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

interface StageDetail {
  id: string;
  number: string;
  name: string;
  code: string;
  tagline: string;
  role: string;
  tech: string[];
  specs: { label: string; value: string }[];
}

const STAGE_DETAILS: Record<string, StageDetail> = {
  interface: {
    id: 'interface',
    number: '01',
    name: 'Client Interface & A2UI Cards',
    code: 'STAGE 01 // CLIENT_SURFACE',
    tagline: 'Reactive Web Client & Local Session Memory',
    role: 'Next.js 16 App Router interface rendering stream chunks and dynamic reactive cards (MacroCard, WorkoutCard, HabitCard, NutritionCard). Persists multi-turn session history in browser storage with instant hydration.',
    tech: ['Next.js 16 App Router', 'React 19 Hooks', 'A2UI Reactive Cards', 'localStorage Memory'],
    specs: [
      { label: 'Render Protocol', value: 'Streaming Token Parser' },
      { label: 'State Sync', value: 'localStorage (fitcoach_messages)' },
      { label: 'Design System', value: 'Monochromatic Kanso (Light/Dark)' },
    ],
  },
  context: {
    id: 'context',
    number: '02',
    name: 'Context Assembly & Profile Buffer',
    code: 'STAGE 02 // CONTEXT_ASSEMBLY',
    tagline: 'Dynamic Profile Injection & Sliding History Window',
    role: 'Synthesizes raw user prompts with the stored physical fitness profile (age, weight, height, gender, activity level). Enforces sliding context window boundaries before sending payload to the reasoning core.',
    tech: ['Profile Memory Store', 'Sliding Context Window', 'Payload Normalizer', 'Type-Safe Guards'],
    specs: [
      { label: 'Profile Payload', value: '5 Key Biomarkers + Goal Vector' },
      { label: 'Context Buffer', value: 'Rolling Multi-Turn Messages' },
      { label: 'Payload Overhead', value: '< 2.4 KB per request' },
    ],
  },
  reasoning: {
    id: 'reasoning',
    number: '03',
    name: 'Gemini 3.5 Flash Reasoning Core',
    code: 'STAGE 03 // GEMINI_REASONING_CORE',
    tagline: 'Autonomous Tool Selection & Strict Editorial Tone',
    role: 'Evaluates user queries under strict zero-emoji tone constraints. Employs multi-candidate reasoning to autonomously decide whether to dispatch tool calls or synthesize evidence-backed athletic advice.',
    tech: ['Google Gemini 3.5 Flash', 'Google Generative AI SDK', 'Role-tuned System Instructions', 'Zero-Emoji Tone Guardrails'],
    specs: [
      { label: 'Inference Latency', value: '~550ms - 850ms' },
      { label: 'Context Window', value: '1M Tokens' },
      { label: 'Tone Constraints', value: 'Strict Monochromatic Editorial' },
    ],
  },
  pipeline: {
    id: 'pipeline',
    number: '04',
    name: 'Tool Dispatch Router & ADK Bus',
    code: 'STAGE 04 // FUNCTION_ROUTER',
    tagline: 'Type-Safe Function Declarations & API Dispatch',
    role: 'Coordinates 6 native function declarations. Validates typed parameters, executes deterministic math formulas (Mifflin-St Jeor), filters workout routines, and bridges live external APIs (Fruityvice).',
    tech: ['Google ADK Patterns', '6 Native FunctionDeclarations', 'Mifflin-St Jeor Engine', 'Fruityvice REST Bridge'],
    specs: [
      { label: 'Registered Tools', value: '6 Function Declarations' },
      { label: 'Execution Mode', value: 'Deterministic Function Dispatch' },
      { label: 'Failover Policy', value: 'Automatic Multi-Model Fallback' },
    ],
  },
  cloud: {
    id: 'cloud',
    number: '05',
    name: 'Cloud Infrastructure & Data Vault',
    code: 'STAGE 05 // CLOUD_FOUNDATION',
    tagline: 'Google AI Studio & Vertex AI Heritage',
    role: 'Powers serverless Gemini inference on Google AI Studio. Maintains heritage architecture from the Google Build with Gemini workshop with Cloud Firestore catalogs and Cloud Run proxy deployment.',
    tech: ['Google AI Studio (Free Tier)', 'Vertex AI Reasoning Engine', 'Cloud Firestore (Catalog JSON)', 'Cloud Run Proxy Service'],
    specs: [
      { label: 'API Provider', value: 'Google AI Studio (1,500 req/day)' },
      { label: 'Workout Catalog', value: '10+ Structured Multi-Exercise Splits' },
      { label: 'Habit Database', value: '24 ACSM/NASM Evidenced Protocols' },
    ],
  },
};

const STAGE_KEYS = ['interface', 'context', 'reasoning', 'pipeline', 'cloud'];

// Data particle animation along the highway (SVG coords)
const PARTICLES = [0, 1, 2, 3];

const EASE_OUT_CUBIC: [number, number, number, number] = [0.16, 1, 0.3, 1];

// HUD panel animation variants
const hudVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.35, ease: EASE_OUT_CUBIC },
  },
  exit: {
    opacity: 0, y: -10, filter: 'blur(4px)',
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const specCardContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const specCardItem: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: EASE_OUT_CUBIC } },
};

const badgeContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.22 } },
};

const badgeItem: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

const RING_POINTS: Record<string, string> = {
  interface: '110,214 180,250 110,286 40,250',
  context: '285,214 355,250 285,286 215,250',
  reasoning: '460,214 535,250 460,286 385,250',
  pipeline: '635,214 705,250 635,286 565,250',
  cloud: '810,214 880,250 810,286 740,250',
};

export default function IsometricStackVisualizer() {
  const [selectedStage, setSelectedStage] = useState<string>('reasoning');
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const active = STAGE_DETAILS[selectedStage];

  // Particle tick
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Header Eyebrow */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-neutral-800 dark:bg-white"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
            FIG_01 · LEFT-TO-RIGHT HORIZONTAL ARCHITECTURAL PIPELINE
          </span>
        </div>
        <div className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
          5-Stage Isometric Flow · Pure Monochromatic
        </div>
      </div>

      {/* Main Left-to-Right 3D Isometric SVG Canvas */}
      <div className="relative rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-[#f3f2ee]/60 dark:bg-neutral-950 p-4 sm:p-8 overflow-hidden shadow-xs">
        {/* Blueprint Dotted Matrix Background */}
        <div
          className="absolute inset-0 opacity-[0.3] dark:opacity-[0.22] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Ambient Center Glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neutral-400/10 dark:bg-white/5 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Figure & Axis Label */}
        <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase select-none mb-2">
          <span>FIG_01 // THE HORIZONTAL ARCHITECTURE PIPELINE</span>
          <span className="hidden sm:inline">DIRECTION OF DATA FLOW: STAGE 01 → STAGE 05</span>
        </div>

        {/* SVG Diagram */}
        <div className="w-full overflow-x-auto pb-2">
          <svg
            viewBox="0 0 940 440"
            className="w-full min-w-[760px] h-auto drop-shadow-sm select-none"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <filter id="glow-mono" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-active" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* ====== HIGHWAY RAILS ====== */}
            <g className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1">
              <line x1="60" y1="218" x2="880" y2="218" strokeDasharray="3 3" />
              <line x1="60" y1="250" x2="880" y2="250" strokeWidth="1.5" />
              <line x1="60" y1="282" x2="880" y2="282" strokeDasharray="3 3" />
            </g>

            {/* ====== ANIMATED DATA PARTICLES ON HIGHWAY ====== */}
            {PARTICLES.map((p) => {
              const offset = ((tick * 2 + p * 210) % 820) + 60;
              return (
                <g key={p}>
                  <circle
                    cx={offset}
                    cy="250"
                    r="3"
                    className="fill-neutral-600 dark:fill-neutral-400"
                    opacity={0.7}
                  />
                  {/* Trail */}
                  <circle
                    cx={offset - 8}
                    cy="250"
                    r="1.5"
                    className="fill-neutral-400 dark:fill-neutral-600"
                    opacity={0.35}
                  />
                </g>
              );
            })}

            {/* Directional Chevrons */}
            <g className="fill-neutral-400 dark:fill-neutral-600">
              <path d="M 200,247 L 206,250 L 200,253 Z" />
              <path d="M 375,247 L 381,250 L 375,253 Z" />
              <path d="M 550,247 L 556,250 L 550,253 Z" />
              <path d="M 725,247 L 731,250 L 725,253 Z" />
            </g>

            {/* ====== STAGE 01: CLIENT INTERFACE ====== */}
            <g
              onClick={() => setSelectedStage('interface')}
              onMouseEnter={() => setHoveredStage('interface')}
              onMouseLeave={() => setHoveredStage(null)}
              className="cursor-pointer"
              style={{ filter: hoveredStage === 'interface' ? 'url(#glow-mono)' : 'none', transition: 'filter 0.2s' }}
            >
              <polygon
                points="110,218 175,250 110,282 45,250"
                className={`transition-all duration-200 ${
                  selectedStage === 'interface'
                    ? 'fill-white dark:fill-neutral-900 stroke-neutral-700 dark:stroke-white stroke-[1.75]'
                    : hoveredStage === 'interface'
                    ? 'fill-neutral-50 dark:fill-neutral-800 stroke-neutral-500 dark:stroke-neutral-400 stroke-[1.5]'
                    : 'fill-white/80 dark:fill-neutral-900/50 stroke-neutral-300 dark:stroke-neutral-700 stroke-[1]'
                }`}
              />
              <polygon points="45,250 110,282 110,296 45,264" className="fill-neutral-200 dark:fill-neutral-950 stroke-neutral-300 dark:stroke-neutral-800 stroke-[1]" />
              <polygon points="110,282 175,250 175,264 110,296" className="fill-neutral-300 dark:fill-neutral-900 stroke-neutral-300 dark:stroke-neutral-800 stroke-[1]" />
              <g transform="translate(0, -25)">
                <polygon points="110,180 160,205 110,230 60,205" className={`transition-colors duration-200 ${selectedStage === 'interface' ? 'fill-white dark:fill-neutral-800 stroke-neutral-700 dark:stroke-white stroke-[1.5]' : 'fill-white/90 dark:fill-neutral-900/80 stroke-neutral-400 dark:stroke-neutral-600 stroke-[1]'}`} />
                <polygon points="110,186 148,205 110,216 72,197" className={selectedStage === 'interface' ? 'fill-neutral-800 dark:fill-white' : 'fill-neutral-300 dark:fill-neutral-700'} />
                <line x1="82" y1="212" x2="118" y2="223" className="stroke-neutral-400 dark:stroke-neutral-500" strokeWidth="2" />
                <line x1="90" y1="220" x2="128" y2="228" className="stroke-neutral-300 dark:stroke-neutral-600" strokeWidth="2" />
              </g>
              <line x1="110" y1="145" x2="110" y2="105" className="stroke-neutral-400 dark:stroke-neutral-600" strokeDasharray="2 2" />
              <circle cx="110" cy="145" r="2.5" className={selectedStage === 'interface' ? 'fill-neutral-800 dark:fill-white' : 'fill-neutral-400 dark:fill-neutral-600'} />
              <text x="110" y="88" textAnchor="middle" className={`font-mono text-[10px] tracking-widest font-semibold uppercase ${selectedStage === 'interface' ? 'fill-neutral-800 dark:fill-white' : 'fill-neutral-500'}`}>STAGE 01</text>
              <text x="110" y="100" textAnchor="middle" className="font-mono text-[9px] tracking-wider fill-neutral-400 dark:fill-neutral-500 uppercase">INTERFACE</text>
              <text x="110" y="320" textAnchor="middle" className="font-mono text-[9px] tracking-wider fill-neutral-500 dark:fill-neutral-400">REACTIVE A2UI</text>
            </g>

            {/* ====== STAGE 02: CONTEXT ASSEMBLY ====== */}
            <g
              onClick={() => setSelectedStage('context')}
              onMouseEnter={() => setHoveredStage('context')}
              onMouseLeave={() => setHoveredStage(null)}
              className="cursor-pointer"
              style={{ filter: hoveredStage === 'context' ? 'url(#glow-mono)' : 'none', transition: 'filter 0.2s' }}
            >
              <polygon
                points="285,218 350,250 285,282 220,250"
                className={`transition-all duration-200 ${
                  selectedStage === 'context'
                    ? 'fill-white dark:fill-neutral-900 stroke-neutral-700 dark:stroke-white stroke-[1.75]'
                    : hoveredStage === 'context'
                    ? 'fill-neutral-50 dark:fill-neutral-800 stroke-neutral-500 dark:stroke-neutral-400 stroke-[1.5]'
                    : 'fill-white/80 dark:fill-neutral-900/50 stroke-neutral-300 dark:stroke-neutral-700 stroke-[1]'
                }`}
              />
              <polygon points="220,250 285,282 285,296 220,264" className="fill-neutral-200 dark:fill-neutral-950 stroke-neutral-300 dark:stroke-neutral-800 stroke-[1]" />
              <polygon points="285,282 350,250 350,264 285,296" className="fill-neutral-300 dark:fill-neutral-900 stroke-neutral-300 dark:stroke-neutral-800 stroke-[1]" />
              <g transform="translate(0, -15)">
                <polygon points="285,225 325,245 285,265 245,245" className="fill-neutral-200 dark:fill-neutral-800 stroke-neutral-400 dark:stroke-neutral-600 stroke-[1]" />
                <polygon points="285,200 325,220 285,240 245,220" className={`transition-colors duration-200 ${selectedStage === 'context' ? 'fill-white dark:fill-neutral-700 stroke-neutral-700 dark:stroke-white stroke-[1.5]' : 'fill-white/90 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-600 stroke-[1]'}`} />
                <polygon points="285,206 310,218 285,230 260,218" className={selectedStage === 'context' ? 'fill-neutral-800 dark:fill-white' : 'fill-neutral-400 dark:fill-neutral-600'} />
              </g>
              <line x1="285" y1="170" x2="285" y2="105" className="stroke-neutral-400 dark:stroke-neutral-600" strokeDasharray="2 2" />
              <circle cx="285" cy="170" r="2.5" className={selectedStage === 'context' ? 'fill-neutral-800 dark:fill-white' : 'fill-neutral-400 dark:fill-neutral-600'} />
              <text x="285" y="88" textAnchor="middle" className={`font-mono text-[10px] tracking-widest font-semibold uppercase ${selectedStage === 'context' ? 'fill-neutral-800 dark:fill-white' : 'fill-neutral-500'}`}>STAGE 02</text>
              <text x="285" y="100" textAnchor="middle" className="font-mono text-[9px] tracking-wider fill-neutral-400 dark:fill-neutral-500 uppercase">CONTEXT</text>
              <text x="285" y="320" textAnchor="middle" className="font-mono text-[9px] tracking-wider fill-neutral-500 dark:fill-neutral-400">PROFILE INJECT</text>
            </g>

            {/* ====== STAGE 03: REASONING CORE (Hero) ====== */}
            <g
              onClick={() => setSelectedStage('reasoning')}
              onMouseEnter={() => setHoveredStage('reasoning')}
              onMouseLeave={() => setHoveredStage(null)}
              className="cursor-pointer"
              style={{ filter: selectedStage === 'reasoning' || hoveredStage === 'reasoning' ? 'url(#glow-active)' : 'none', transition: 'filter 0.25s' }}
            >
              <polygon
                points="460,218 530,250 460,282 390,250"
                className={`transition-all duration-200 ${
                  selectedStage === 'reasoning'
                    ? 'fill-white dark:fill-neutral-900 stroke-neutral-700 dark:stroke-white stroke-[2]'
                    : hoveredStage === 'reasoning'
                    ? 'fill-neutral-50 dark:fill-neutral-800 stroke-neutral-500 dark:stroke-neutral-400 stroke-[1.5]'
                    : 'fill-white/80 dark:fill-neutral-900/50 stroke-neutral-400 dark:stroke-neutral-700 stroke-[1.2]'
                }`}
              />
              <polygon points="390,250 460,282 460,300 390,268" className="fill-neutral-200 dark:fill-neutral-950 stroke-neutral-300 dark:stroke-neutral-800 stroke-[1]" />
              <polygon points="460,282 530,250 530,268 460,300" className="fill-neutral-300 dark:fill-neutral-900 stroke-neutral-300 dark:stroke-neutral-800 stroke-[1]" />
              <line x1="460" y1="130" x2="460" y2="250" className="stroke-neutral-400 dark:stroke-neutral-500" strokeDasharray="3 3" strokeWidth="1" />
              <g transform="translate(460, 160)" filter={selectedStage === 'reasoning' ? 'url(#glow-mono)' : undefined}>
                <polygon points="0,-24 35,-6 0,12 -35,-6" className={`transition-colors duration-200 ${selectedStage === 'reasoning' ? 'fill-white dark:fill-neutral-100 stroke-neutral-700 dark:stroke-white stroke-[1.5]' : 'fill-neutral-200 dark:fill-neutral-800 stroke-neutral-400 dark:stroke-neutral-600 stroke-[1]'}`} />
                <polygon points="-35,-6 0,12 0,44 -35,26" className={`transition-colors duration-200 ${selectedStage === 'reasoning' ? 'fill-neutral-300 dark:fill-neutral-300 stroke-neutral-700 dark:stroke-white stroke-[1.5]' : 'fill-neutral-300 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-600 stroke-[1]'}`} />
                <polygon points="0,12 35,-6 35,26 0,44" className={`transition-colors duration-200 ${selectedStage === 'reasoning' ? 'fill-neutral-800 dark:fill-neutral-700 stroke-neutral-700 dark:stroke-white stroke-[1.5]' : 'fill-neutral-400 dark:fill-neutral-950 stroke-neutral-400 dark:stroke-neutral-600 stroke-[1]'}`} />
                <polygon points="0,-14 20,-4 0,6 -20,-4" className={selectedStage === 'reasoning' ? 'fill-neutral-800 dark:fill-black' : 'fill-neutral-400 dark:fill-neutral-700'} />
              </g>
              <line x1="495" y1="165" x2="550" y2="165" className="stroke-neutral-400 dark:stroke-neutral-600" strokeWidth="1" />
              <circle cx="495" cy="165" r="2.5" className={selectedStage === 'reasoning' ? 'fill-neutral-800 dark:fill-white' : 'fill-neutral-500'} />
              <text x="555" y="168" className={`font-mono text-[9px] tracking-wider uppercase font-semibold ${selectedStage === 'reasoning' ? 'fill-neutral-800 dark:fill-white' : 'fill-neutral-500'}`}>GEMINI NODE</text>
              <line x1="460" y1="130" x2="460" y2="60" className="stroke-neutral-400 dark:stroke-neutral-600" strokeDasharray="2 2" />
              <circle cx="460" cy="130" r="3" className={selectedStage === 'reasoning' ? 'fill-neutral-800 dark:fill-white' : 'fill-neutral-400 dark:fill-neutral-600'} />
              <text x="460" y="42" textAnchor="middle" className={`font-mono text-[10px] tracking-widest font-bold uppercase ${selectedStage === 'reasoning' ? 'fill-neutral-800 dark:fill-white' : 'fill-neutral-500'}`}>STAGE 03</text>
              <text x="460" y="54" textAnchor="middle" className="font-mono text-[9px] tracking-wider fill-neutral-400 dark:fill-neutral-500 uppercase">REASONING CORE</text>
              <text x="460" y="324" textAnchor="middle" className="font-mono text-[9px] tracking-wider font-semibold fill-neutral-800 dark:fill-white">GEMINI 3.5 FLASH</text>
            </g>

            {/* ====== STAGE 04: TOOL DISPATCH ====== */}
            <g
              onClick={() => setSelectedStage('pipeline')}
              onMouseEnter={() => setHoveredStage('pipeline')}
              onMouseLeave={() => setHoveredStage(null)}
              className="cursor-pointer"
              style={{ filter: hoveredStage === 'pipeline' ? 'url(#glow-mono)' : 'none', transition: 'filter 0.2s' }}
            >
              <polygon
                points="635,218 700,250 635,282 570,250"
                className={`transition-all duration-200 ${
                  selectedStage === 'pipeline'
                    ? 'fill-white dark:fill-neutral-900 stroke-neutral-700 dark:stroke-white stroke-[1.75]'
                    : hoveredStage === 'pipeline'
                    ? 'fill-neutral-50 dark:fill-neutral-800 stroke-neutral-500 dark:stroke-neutral-400 stroke-[1.5]'
                    : 'fill-white/80 dark:fill-neutral-900/50 stroke-neutral-300 dark:stroke-neutral-700 stroke-[1]'
                }`}
              />
              <polygon points="570,250 635,282 635,296 570,264" className="fill-neutral-200 dark:fill-neutral-950 stroke-neutral-300 dark:stroke-neutral-800 stroke-[1]" />
              <polygon points="635,282 700,250 700,264 635,296" className="fill-neutral-300 dark:fill-neutral-900 stroke-neutral-300 dark:stroke-neutral-800 stroke-[1]" />
              <g transform="translate(0, -18)">
                <polygon points="635,225 665,240 635,255 605,240" className={selectedStage === 'pipeline' ? 'fill-neutral-800 dark:fill-white stroke-neutral-700 dark:stroke-white' : 'fill-neutral-300 dark:fill-neutral-800 stroke-neutral-400 dark:stroke-neutral-600'} strokeWidth="1" />
                <line x1="605" y1="240" x2="585" y2="230" className="stroke-neutral-400 dark:stroke-neutral-500" strokeWidth="1.5" />
                <line x1="665" y1="240" x2="685" y2="230" className="stroke-neutral-400 dark:stroke-neutral-500" strokeWidth="1.5" />
                <line x1="635" y1="225" x2="635" y2="208" className="stroke-neutral-400 dark:stroke-neutral-500" strokeWidth="1.5" />
                <line x1="635" y1="255" x2="635" y2="270" className="stroke-neutral-400 dark:stroke-neutral-500" strokeWidth="1.5" />
                <circle cx="585" cy="230" r="2.5" className={selectedStage === 'pipeline' ? 'fill-neutral-800 dark:fill-white' : 'fill-neutral-400'} />
                <circle cx="685" cy="230" r="2.5" className={selectedStage === 'pipeline' ? 'fill-neutral-800 dark:fill-white' : 'fill-neutral-400'} />
                <circle cx="635" cy="208" r="2.5" className={selectedStage === 'pipeline' ? 'fill-neutral-800 dark:fill-white' : 'fill-neutral-400'} />
                <circle cx="635" cy="270" r="2.5" className={selectedStage === 'pipeline' ? 'fill-neutral-800 dark:fill-white' : 'fill-neutral-400'} />
              </g>
              <line x1="635" y1="185" x2="635" y2="105" className="stroke-neutral-400 dark:stroke-neutral-600" strokeDasharray="2 2" />
              <circle cx="635" cy="185" r="2.5" className={selectedStage === 'pipeline' ? 'fill-neutral-800 dark:fill-white' : 'fill-neutral-400 dark:fill-neutral-600'} />
              <text x="635" y="88" textAnchor="middle" className={`font-mono text-[10px] tracking-widest font-semibold uppercase ${selectedStage === 'pipeline' ? 'fill-neutral-800 dark:fill-white' : 'fill-neutral-500'}`}>STAGE 04</text>
              <text x="635" y="100" textAnchor="middle" className="font-mono text-[9px] tracking-wider fill-neutral-400 dark:fill-neutral-500 uppercase">TOOL BUS</text>
              <text x="635" y="320" textAnchor="middle" className="font-mono text-[9px] tracking-wider fill-neutral-500 dark:fill-neutral-400">6 ADK FUNCTIONS</text>
            </g>

            {/* ====== STAGE 05: CLOUD & DATA VAULT ====== */}
            <g
              onClick={() => setSelectedStage('cloud')}
              onMouseEnter={() => setHoveredStage('cloud')}
              onMouseLeave={() => setHoveredStage(null)}
              className="cursor-pointer"
              style={{ filter: hoveredStage === 'cloud' ? 'url(#glow-mono)' : 'none', transition: 'filter 0.2s' }}
            >
              <polygon
                points="810,218 875,250 810,282 745,250"
                className={`transition-all duration-200 ${
                  selectedStage === 'cloud'
                    ? 'fill-white dark:fill-neutral-900 stroke-neutral-700 dark:stroke-white stroke-[1.75]'
                    : hoveredStage === 'cloud'
                    ? 'fill-neutral-50 dark:fill-neutral-800 stroke-neutral-500 dark:stroke-neutral-400 stroke-[1.5]'
                    : 'fill-white/80 dark:fill-neutral-900/50 stroke-neutral-300 dark:stroke-neutral-700 stroke-[1]'
                }`}
              />
              <polygon points="745,250 810,282 810,296 745,264" className="fill-neutral-200 dark:fill-neutral-950 stroke-neutral-300 dark:stroke-neutral-800 stroke-[1]" />
              <polygon points="810,282 875,250 875,264 810,296" className="fill-neutral-300 dark:fill-neutral-900 stroke-neutral-300 dark:stroke-neutral-800 stroke-[1]" />
              <g transform="translate(0, -20)">
                <ellipse cx="780" cy="235" rx="12" ry="6" className="fill-neutral-200 dark:fill-neutral-800 stroke-neutral-400 dark:stroke-neutral-600 stroke-[1]" />
                <path d="M 768,235 v 14 a 12,6 0 0 0 24,0 v -14" className="fill-neutral-300 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-600 stroke-[1]" />
                <ellipse cx="840" cy="235" rx="12" ry="6" className="fill-neutral-200 dark:fill-neutral-800 stroke-neutral-400 dark:stroke-neutral-600 stroke-[1]" />
                <path d="M 828,235 v 14 a 12,6 0 0 0 24,0 v -14" className="fill-neutral-300 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-600 stroke-[1]" />
                <ellipse cx="810" cy="215" rx="15" ry="7.5" className={selectedStage === 'cloud' ? 'fill-neutral-800 dark:fill-white stroke-neutral-700 dark:stroke-white stroke-[1.5]' : 'fill-neutral-300 dark:fill-neutral-700 stroke-neutral-400 dark:stroke-neutral-500'} />
                <path d="M 795,215 v 20 a 15,7.5 0 0 0 30,0 v -20" className={selectedStage === 'cloud' ? 'fill-neutral-800 dark:fill-neutral-100 stroke-neutral-700 dark:stroke-white stroke-[1.5]' : 'fill-neutral-400 dark:fill-neutral-800 stroke-neutral-400 dark:stroke-neutral-500'} />
              </g>
              <line x1="810" y1="185" x2="810" y2="105" className="stroke-neutral-400 dark:stroke-neutral-600" strokeDasharray="2 2" />
              <circle cx="810" cy="185" r="2.5" className={selectedStage === 'cloud' ? 'fill-neutral-800 dark:fill-white' : 'fill-neutral-400 dark:fill-neutral-600'} />
              <text x="810" y="88" textAnchor="middle" className={`font-mono text-[10px] tracking-widest font-semibold uppercase ${selectedStage === 'cloud' ? 'fill-neutral-800 dark:fill-white' : 'fill-neutral-500'}`}>STAGE 05</text>
              <text x="810" y="100" textAnchor="middle" className="font-mono text-[9px] tracking-wider fill-neutral-400 dark:fill-neutral-500 uppercase">CLOUD & DATA</text>
              <text x="810" y="320" textAnchor="middle" className="font-mono text-[9px] tracking-wider fill-neutral-500 dark:fill-neutral-400">DATA VAULT</text>
            </g>

            {/* Animated Selection Ring — moves with layoutId via CSS transition on SVG */}
            {STAGE_KEYS.map((key) =>
              selectedStage === key ? (
                <polygon
                  key={key}
                  points={RING_POINTS[key]}
                  fill="none"
                  className="stroke-neutral-700 dark:stroke-white"
                  strokeWidth={key === 'reasoning' ? '1.5' : '1.25'}
                  strokeDasharray="4 4"
                  style={{
                    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                    opacity: 1,
                    animation: 'dashmarch 1.8s linear infinite',
                  }}
                />
              ) : null
            )}

            {/* Animated dash march keyframes via inline style hack */}
            <style>{`
              @keyframes dashmarch {
                to { stroke-dashoffset: -16; }
              }
            `}</style>
          </svg>
        </div>

        {/* Quick Stage Navigation Pills */}
        <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">INSPECT STAGE:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {STAGE_KEYS.map((key) => {
              const item = STAGE_DETAILS[key];
              const isSelected = selectedStage === key;
              return (
                <motion.button
                  key={key}
                  onClick={() => setSelectedStage(key)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-neutral-800 text-neutral-100 dark:bg-neutral-200 dark:text-neutral-900 font-semibold shadow-xs'
                      : 'bg-white/80 dark:bg-neutral-900/60 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white border border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <span className="opacity-60">{item.number}</span>
                  <span>{item.name.split(' ')[0]}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ====== HUD INSPECTOR — AnimatePresence for smooth switching ====== */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedStage}
          variants={hudVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="px-2.5 py-1 rounded-md text-[10px] font-mono tracking-widest uppercase bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 text-neutral-800 dark:text-white font-semibold"
              >
                {active.code}
              </motion.span>
              <span className="text-xs font-mono text-neutral-500">Telemetry Status: Active</span>
            </div>
            <div className="text-xs font-mono text-neutral-400 dark:text-neutral-500">Pipeline Stage {active.number} of 05</div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="space-y-1">
              <h3 className="text-xl font-medium text-neutral-800 dark:text-white font-sans">{active.name}</h3>
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">{active.tagline}</div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">{active.role}</p>
          </div>

          {/* Spec Cards — staggered */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"
            variants={specCardContainer}
            initial="hidden"
            animate="visible"
          >
            {active.specs.map((spec, i) => (
              <motion.div
                key={i}
                variants={specCardItem}
                className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-[#f8f7f5] dark:bg-neutral-950/60 space-y-1"
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">{spec.label}</div>
                <div className="text-xs font-semibold text-neutral-800 dark:text-white font-mono">{spec.value}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tech Badges — staggered */}
          <div>
            <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-2.5">
              Underlying Architecture & Standards
            </div>
            <motion.div
              className="flex flex-wrap gap-2"
              variants={badgeContainer}
              initial="hidden"
              animate="visible"
            >
              {active.tech.map((t, i) => (
                <motion.span
                  key={i}
                  variants={badgeItem}
                  className="px-3 py-1 rounded-md text-xs font-mono bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 text-neutral-800 dark:text-neutral-200"
                >
                  {t}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
