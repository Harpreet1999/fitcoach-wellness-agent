'use client';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Brain, Sparkles, Cpu, Layers, Target, Flame, Dumbbell, Apple, Moon } from 'lucide-react';

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
              <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white animate-pulse-subtle" />
              <span className="text-neutral-600 dark:text-neutral-400">Google Build with Gemini 2026</span>
              <span className="text-neutral-300 dark:text-neutral-700">|</span>
              <span className="text-neutral-900 dark:text-white font-medium">Live Demo</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-6xl font-light tracking-tight text-neutral-900 dark:text-white leading-[1.1]">
                Your AI{' '}
                <br />
                <span className="font-semibold text-neutral-950 dark:text-neutral-100">
                  Fitness Coach.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                An intelligent wellness agent built on{' '}
                <span className="text-neutral-900 dark:text-neutral-200 font-medium">Google&apos;s Gemini API</span> and{' '}
                <span className="text-neutral-900 dark:text-neutral-200 font-medium">ADK patterns</span>.
                Calculates personalized macros, explores workout protocols, and dispenses evidence-based habits.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#demo"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-medium text-sm tracking-wide hover:opacity-90 active:scale-98 transition-all duration-200 flex items-center justify-center gap-3 shadow-sm"
              >
                <span>Talk to FitCoach</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#architecture"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-xs"
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
  const [cycleIndex, setCycleIndex] = useState<number>(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const tools = [
    { label: 'Macro Calc', id: 'calculate_macros', icon: Flame, angle: 0 },
    { label: 'Workouts', id: 'list_workouts', icon: Dumbbell, angle: 60 },
    { label: 'Nutrition', id: 'fruit_nutrition', icon: Apple, angle: 120 },
    { label: 'Habits', id: 'recommend_habit', icon: Moon, angle: 180 },
    { label: 'Intelligence', id: 'gemini_flash', icon: Sparkles, angle: 240 },
    { label: 'Memory', id: 'session_store', icon: Brain, angle: 300 },
  ];

  // Auto-cycle active pulse when not manually hovered
  useEffect(() => {
    if (hoveredIndex !== null) return;
    const interval = setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % tools.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [hoveredIndex, tools.length]);

  const activeIndex = hoveredIndex !== null ? hoveredIndex : cycleIndex;
  const activeTool = tools[activeIndex];

  // Interactive 3D mouse tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTilt({ x: parseFloat(y.toFixed(2)), y: parseFloat(x.toFixed(2)) });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHoveredIndex(null);
  };

  const CenterIcon = activeTool.icon;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] md:w-[440px] md:h-[440px] transition-transform duration-300 ease-out cursor-pointer select-none"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {/* Blueprint Dotted Background Disc */}
      <div
        className="absolute inset-8 rounded-full opacity-[0.20] dark:opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Orbit Rings with Counter-Rotations */}
      <div className="absolute inset-2 rounded-full border border-neutral-300/80 dark:border-neutral-800/80 animate-spin-slow pointer-events-none" />
      <div
        className="absolute inset-10 rounded-full border border-dashed border-neutral-300 dark:border-neutral-800/60 pointer-events-none"
        style={{ animation: 'spin 40s linear infinite reverse' }}
      />
      <div className="absolute inset-20 rounded-full border border-neutral-200 dark:border-neutral-800/40 pointer-events-none" />

      {/* Connection Ray Lines (SVG) */}
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
                className={`transition-all duration-300 ${
                  isCurrent
                    ? 'stroke-neutral-950 dark:stroke-white stroke-[2]'
                    : 'stroke-neutral-300 dark:stroke-neutral-800/90 stroke-[1]'
                }`}
                strokeDasharray={isCurrent ? 'none' : '3 4'}
              />
              {/* Traveling Packet on Active Ray */}
              {isCurrent && (
                <circle
                  cx={`${(0.5 + (r * 0.65) * Math.cos(rad)) * 100}%`}
                  cy={`${(0.5 + (r * 0.65) * Math.sin(rad)) * 100}%`}
                  r="3.5"
                  className="fill-neutral-950 dark:fill-white animate-pulse"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Center Holographic Agent Core */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-white/95 dark:bg-neutral-950/95 border-2 border-neutral-950 dark:border-white shadow-2xl backdrop-blur-md flex flex-col items-center justify-center p-2 transition-all duration-300">
          {/* Subtle Rotating Accent Ring */}
          <div className="absolute -inset-2 rounded-full border border-neutral-300 dark:border-neutral-700 animate-spin-slow pointer-events-none" />

          {/* Dynamic Active Icon */}
          <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-1 transition-all duration-200">
            <CenterIcon className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-900 dark:text-white transition-all duration-200" />
          </div>

          <div className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-neutral-950 dark:text-white uppercase text-center line-clamp-1">
            {activeTool.label}
          </div>
          <div className="text-[8px] sm:text-[9px] font-mono tracking-wider text-neutral-500 uppercase mt-0.5">
            ORCHESTRATING
          </div>
        </div>
      </div>

      {/* Orbiting Tool Nodes with Enriched Larger Icons */}
      {tools.map((tool, i) => {
        const rad = ((tool.angle - 90) * Math.PI) / 180;
        const r = 160;
        const divisor = 4.2;
        const x = 50 + (r / divisor) * Math.cos(rad);
        const y = 50 + (r / divisor) * Math.sin(rad);
        const Icon = tool.icon;
        const isCurrent = i === activeIndex;

        return (
          <div
            key={tool.label}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="absolute flex flex-col items-center gap-1.5 transition-all duration-300"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Larger Interactive Tool Box */}
            <div
              className={`w-13 h-13 sm:w-15 sm:h-15 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                isCurrent
                  ? 'scale-115 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-2 border-neutral-950 dark:border-white shadow-xl'
                  : 'bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white'
              }`}
            >
              <Icon className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-200" />
            </div>

            {/* Monospace Badge Label */}
            <span
              className={`text-[9px] sm:text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-md border transition-all duration-200 whitespace-nowrap ${
                isCurrent
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white font-bold'
                  : 'bg-white/90 dark:bg-neutral-900/90 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800'
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
