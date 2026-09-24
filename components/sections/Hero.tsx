'use client';
import { ArrowRight, Brain, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Background radial gradient — matches Pro reference */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-neutral-800/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[300px] bg-neutral-700/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left: Typography & CTAs */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left animate-fade-up">

            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/70 backdrop-blur-sm text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-subtle" />
              <span className="text-neutral-400">Built at Google Build with Gemini 2026</span>
              <span className="text-neutral-700">|</span>
              <span className="text-white font-medium">Live Demo</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-6xl font-light tracking-tight text-white leading-[1.1]">
                Your AI{' '}
                <br />
                <span className="font-semibold text-neutral-100">
                  Fitness Coach.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                An intelligent wellness agent built on{' '}
                <span className="text-neutral-200 font-medium">Google&apos;s Gemini API</span> and{' '}
                <span className="text-neutral-200 font-medium">ADK patterns</span>.
                Tracks workouts, calculates personalized macros, and generates real-time recommendations.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#demo"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-neutral-950 font-medium text-sm tracking-wide hover:opacity-90 active:scale-98 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-white/10"
              >
                <span>Talk to FitCoach</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#architecture"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800/50 text-neutral-300 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Brain className="w-4 h-4" />
                <span>View Architecture</span>
              </a>
            </div>

            {/* Trust bar */}
            <div className="pt-2 border-t border-neutral-800 grid grid-cols-3 gap-4 text-left">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                  <span className="text-[10px]">🤖</span>
                </div>
                <div className="text-[11px] leading-tight text-neutral-500">
                  <span className="font-semibold block text-neutral-300">Google Gemini</span>
                  2.0 Flash Model
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                  <span className="text-[10px]">⚙️</span>
                </div>
                <div className="text-[11px] leading-tight text-neutral-500">
                  <span className="font-semibold block text-neutral-300">ADK Patterns</span>
                  Agent Toolkit
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                  <span className="text-[10px]">🎯</span>
                </div>
                <div className="text-[11px] leading-tight text-neutral-500">
                  <span className="font-semibold block text-neutral-300">6 Tools</span>
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
  const tools = [
    { label: 'Macro Calc', icon: '📊', angle: 0 },
    { label: 'Workouts', icon: '🏋️', angle: 60 },
    { label: 'Nutrition', icon: '🍎', angle: 120 },
    { label: 'Habits', icon: '🧘', angle: 180 },
    { label: 'Image Gen', icon: '🖼️', angle: 240 },
    { label: 'Memory', icon: '🧠', angle: 300 },
  ];

  return (
    <div className="relative w-80 h-80 md:w-96 md:h-96">
      {/* Outer orbit ring */}
      <div className="absolute inset-0 rounded-full border border-neutral-800/50 animate-spin-slow" />
      <div className="absolute inset-4 rounded-full border border-neutral-800/30" style={{ animationDirection: 'reverse' }} />

      {/* Center — Agent core */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-neutral-900 border border-neutral-700 shadow-2xl flex flex-col items-center justify-center gap-1">
          <Sparkles className="w-6 h-6 text-neutral-300" />
          <span className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase">Agent</span>
        </div>
      </div>

      {/* Tool nodes orbiting */}
      {tools.map((tool, i) => {
        const rad = ((tool.angle - 90) * Math.PI) / 180;
        const r = 140;
        const divisor = 3.84;
        const x = 50 + (r / divisor) * Math.cos(rad);
        const y = 50 + (r / divisor) * Math.sin(rad);
        return (
          <div
            key={tool.label}
            className="absolute flex flex-col items-center gap-1"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 hover:border-neutral-600">
              <span className="text-lg">{tool.icon}</span>
            </div>
            <span className="text-[9px] font-mono text-neutral-600 whitespace-nowrap">{tool.label}</span>
          </div>
        );
      })}

      {/* Connection lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
        {tools.map((tool, i) => {
          const rad = ((tool.angle - 90) * Math.PI) / 180;
          const r = 0.365;
          const cx = 0.5 + r * Math.cos(rad);
          const cy = 0.5 + r * Math.sin(rad);
          return (
            <line
              key={i}
              x1="50%"
              y1="50%"
              x2={`${cx * 100}%`}
              y2={`${cy * 100}%`}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
          );
        })}
      </svg>
    </div>
  );
}
