'use client';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Brain, Sparkles, Cpu, Layers, Target, Flame, Dumbbell, Apple, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden transition-colors duration-200">
      {/* Background radial gradient */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-neutral-200/50 dark:bg-neutral-800/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[300px] bg-neutral-300/30 dark:bg-neutral-700/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left: Typography & CTAs */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left animate-fade-up">

            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70 backdrop-blur-sm text-xs font-mono shadow-xs">
              <span className="w-2 h-2 rounded-full bg-neutral-800 dark:bg-white animate-pulse-subtle" />
              <span className="text-neutral-600 dark:text-neutral-400">Google Build with Gemini 2026</span>
              <span className="text-neutral-300 dark:text-neutral-700">|</span>
              <span className="text-neutral-800 dark:text-white font-medium">Live Demo</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-6xl font-light tracking-tight text-neutral-800 dark:text-white leading-[1.1]">
                Your AI{' '}
                <br />
                <span className="font-semibold text-neutral-800 dark:text-neutral-100">
                  Fitness Coach.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                An intelligent wellness agent built on{' '}
                <span className="text-neutral-800 dark:text-neutral-200 font-medium">Google&apos;s Gemini API</span> and{' '}
                <span className="text-neutral-800 dark:text-neutral-200 font-medium">ADK patterns</span>.
                Calculates personalized macros, explores workout protocols, and dispenses evidence-based habits.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#demo"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-neutral-800 text-neutral-100 hover:bg-neutral-700 dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-neutral-100 font-medium text-sm tracking-wide active:scale-98 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm"
              >
                <span>Talk to FitCoach</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#architecture"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-xs"
              >
                <Brain className="w-4 h-4" />
                <span>View Architecture</span>
              </a>
            </div>

            {/* Trust bar */}
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-3 gap-4 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shrink-0">
                  <Cpu className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                </div>
                <div className="text-[11px] leading-tight text-neutral-500">
                  <span className="font-semibold block text-neutral-800 dark:text-neutral-200">Google Gemini</span>
                  3.5 Flash Model
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                </div>
                <div className="text-[11px] leading-tight text-neutral-500">
                  <span className="font-semibold block text-neutral-800 dark:text-neutral-200">ADK Patterns</span>
                  Agent Toolkit
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                </div>
                <div className="text-[11px] leading-tight text-neutral-500">
                  <span className="font-semibold block text-neutral-800 dark:text-neutral-200">6 Tools</span>
                  Orchestrated
                </div>
              </div>
            </div>
          </div>

          {/* Right: Animated Agent Visual */}
          <div className="lg:col-span-6 flex justify-center animate-float">
            <AgentVisual />
          </div>

        </div>
      </div>
    </section>
  );
}

function AgentVisual() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isHoveringContainer, setIsHoveringContainer] = useState<boolean>(false);
  const [cycleIndex, setCycleIndex] = useState<number>(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const tools = [
    { label: 'Macro Calc', id: 'calculate_macros', icon: Flame, angle: 0, tooltip: 'BMR · TDEE · Macro Split' },
    { label: 'Workouts', id: 'list_workouts', icon: Dumbbell, angle: 60, tooltip: '10+ Multi-Day Splits' },
    { label: 'Nutrition', id: 'fruit_nutrition', icon: Apple, angle: 120, tooltip: 'Live Fruityvice API' },
    { label: 'Habits', id: 'recommend_habit', icon: Moon, angle: 180, tooltip: '24 Science Protocols' },
    { label: 'Intelligence', id: 'gemini_flash', icon: Sparkles, angle: 240, tooltip: 'Gemini 3.5 Flash Model' },
    { label: 'Memory', id: 'session_store', icon: Brain, angle: 300, tooltip: 'In-Session Client Memory' },
  ];

  // Auto-cycle active pulse only when user is NOT hovering anywhere over the container
  useEffect(() => {
    if (isHoveringContainer) return;
    const interval = setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % tools.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isHoveringContainer, tools.length]);

  // When hovering container: only select tool if directly hovering that tool node (no forced animation selection)
  const activeIndex = isHoveringContainer ? hoveredIndex : cycleIndex;
  const activeTool = activeIndex !== null ? tools[activeIndex] : null;

  // Interactive 3D mouse tilt tracking with gentle dampening
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setTilt({ x: parseFloat(y.toFixed(2)), y: parseFloat(x.toFixed(2)) });
  };

  const handleMouseEnter = () => {
    setIsHoveringContainer(true);
  };

  const handleMouseLeave = () => {
    setIsHoveringContainer(false);
    setHoveredIndex(null);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] md:w-[440px] md:h-[440px] transition-transform duration-500 ease-out cursor-default select-none"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {/* Blueprint Dotted Background Disc */}
      <div
        className="absolute inset-8 rounded-full opacity-[0.20] dark:opacity-[0.16] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Orbit Rings with Counter-Rotations */}
      <div className="absolute inset-2 rounded-full border border-neutral-300/70 dark:border-neutral-800/70 animate-spin-slow pointer-events-none" />
      <div
        className="absolute inset-10 rounded-full border border-dashed border-neutral-300/80 dark:border-neutral-800/60 pointer-events-none"
        style={{ animation: 'spin 45s linear infinite reverse' }}
      />
      <div className="absolute inset-20 rounded-full border border-neutral-200 dark:border-neutral-800/40 pointer-events-none" />

      {/* Connection Ray Lines (SVG) with Slow Smooth Transitions */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
        {tools.map((tool, i) => {
          const rad = ((tool.angle - 90) * Math.PI) / 180;
          const r = 0.38;
          const cx = 0.5 + r * Math.cos(rad);
          const cy = 0.5 + r * Math.sin(rad);
          const isCurrent = i === activeIndex;

          return (
            <g key={tool.id}>
              <line
                x1="50%"
                y1="50%"
                x2={`${cx * 100}%`}
                y2={`${cy * 100}%`}
                className={`transition-all duration-500 ease-in-out ${
                  isCurrent
                    ? 'stroke-neutral-500 dark:stroke-neutral-400 stroke-[1.25] opacity-90'
                    : 'stroke-neutral-300 dark:stroke-neutral-800/80 stroke-[1] opacity-40'
                }`}
                strokeDasharray={isCurrent ? 'none' : '3 4'}
              />
              {/* Traveling Packet on Active Ray with Fade In/Out */}
              <circle
                cx={`${(0.5 + (r * 0.65) * Math.cos(rad)) * 100}%`}
                cy={`${(0.5 + (r * 0.65) * Math.sin(rad)) * 100}%`}
                r="2.5"
                className={`fill-neutral-500 dark:fill-neutral-400 transition-opacity duration-500 ease-in-out ${
                  isCurrent ? 'opacity-100 animate-pulse' : 'opacity-0'
                }`}
              />
            </g>
          );
        })}
      </svg>

      {/* Center Holographic Agent Core with Smooth Cross-Fade */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-white dark:bg-neutral-900 border border-neutral-300/90 dark:border-neutral-700/80 shadow-xl backdrop-blur-md flex flex-col items-center justify-center p-2 transition-all duration-500 ease-out overflow-hidden">
          {/* Rotating Outer Accent Ring */}
          <div className="absolute -inset-2 rounded-full border border-neutral-300/80 dark:border-neutral-700/70 animate-spin-slow pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool ? activeTool.id : 'idle'}
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center text-center w-full"
            >
              {/* Center Icon Container (Non-Bold, strokeWidth 1.5, Soft Charcoal) */}
              <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 mb-1">
                {activeTool ? (
                  <activeTool.icon strokeWidth={1.5} className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-800 dark:text-neutral-100" />
                ) : (
                  <Sparkles strokeWidth={1.5} className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-800 dark:text-neutral-100" />
                )}
              </div>

              <div className="text-[10px] sm:text-[11px] font-mono font-medium tracking-widest text-neutral-800 dark:text-neutral-100 uppercase text-center line-clamp-1">
                {activeTool ? activeTool.label : 'FITCOACH AI'}
              </div>
              <div className="text-[8px] sm:text-[9px] font-mono tracking-wider text-neutral-500 uppercase mt-0.5">
                {activeTool ? 'ORCHESTRATING' : '6 TOOLS READY'}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Orbiting Tool Nodes with Soft Transitions, Corner Tooltips & Less Rounded Icons */}
      {tools.map((tool, i) => {
        const rad = ((tool.angle - 90) * Math.PI) / 180;
        const r = 160;
        const divisor = 4.2;
        const x = 50 + (r / divisor) * Math.cos(rad);
        const y = 50 + (r / divisor) * Math.sin(rad);
        const Icon = tool.icon;
        const isCurrent = i === activeIndex;
        const isHovered = i === hoveredIndex;

        // Per-angle tooltip placement with correct vertical anchor & 22px gap:
        // angle 0   (Macro Calc, top):         centered above
        // angle 60  (Workouts, top-right):      right side, top-anchored
        // angle 120 (Nutrition, bottom-right):  right side, bottom-anchored
        // angle 180 (Habits, bottom):           centered below
        // angle 240 (Intelligence, bottom-left):left side, bottom-anchored
        // angle 300 (Memory, top-left):         left side, top-anchored
        let tooltipPlacementClass = '';
        if (tool.angle === 0) {
          tooltipPlacementClass = 'bottom-[calc(100%+22px)] left-1/2 -translate-x-1/2';
        } else if (tool.angle === 60) {
          // Workouts: top-right → tooltip right side, top of icon
          tooltipPlacementClass = 'left-[calc(100%+22px)] top-0';
        } else if (tool.angle === 120) {
          // Nutrition: bottom-right → tooltip right side, bottom of icon
          tooltipPlacementClass = 'left-[calc(100%+22px)] bottom-0';
        } else if (tool.angle === 180) {
          tooltipPlacementClass = 'top-[calc(100%+22px)] left-1/2 -translate-x-1/2';
        } else if (tool.angle === 240) {
          // Intelligence: bottom-left → tooltip left side, bottom of icon
          tooltipPlacementClass = 'right-[calc(100%+22px)] bottom-0';
        } else {
          // Memory: top-left → tooltip left side, top of icon
          tooltipPlacementClass = 'right-[calc(100%+22px)] top-0';
        }

        return (
          <div
            key={tool.label}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="absolute flex flex-col items-center gap-1.5 cursor-pointer z-10"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Tool Icon Box with Relative Container for Corner-Anchored Tooltip */}
            <div className="relative">
              {/* Corner-Aligned Monochromatic Tooltip with refined padding and less rounded border */}
              <div
                className={`absolute z-30 pointer-events-none px-3.5 py-1.5 rounded-[4px] text-[9.5px] font-mono tracking-wider bg-neutral-800 text-neutral-100 dark:bg-neutral-200 dark:text-neutral-900 border border-neutral-700/90 dark:border-neutral-300/90 shadow-md whitespace-nowrap transition-all duration-300 ease-out ${
                  tooltipPlacementClass
                } ${
                  isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                {tool.tooltip}
              </div>

              {/* Interactive Tool Box — less rounded (rounded-xl), soft border change & more larger grow effect on hover */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center transition-all duration-300 ease-out bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border ${
                  isHovered
                    ? 'scale-[1.28] -translate-y-1 border-neutral-400 dark:border-neutral-400 shadow-xl text-neutral-900 dark:text-neutral-100 z-20'
                    : isCurrent
                    ? 'scale-110 -translate-y-0.5 border-neutral-400 dark:border-neutral-500 shadow-md text-neutral-900 dark:text-neutral-100'
                    : 'scale-100 translate-y-0 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 shadow-xs'
                }`}
              >
                <Icon strokeWidth={1.5} className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 transition-transform duration-300 ease-out" />
              </div>
            </div>

            {/* Monospace Badge Label with Soft Border Focus (No Variant Flipping) */}
            <span
              className={`text-[9px] sm:text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-md border transition-all duration-300 ease-out whitespace-nowrap bg-white dark:bg-neutral-900 ${
                isHovered || isCurrent
                  ? 'border-neutral-400 dark:border-neutral-400 text-neutral-900 dark:text-neutral-100 font-medium'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {tool.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
