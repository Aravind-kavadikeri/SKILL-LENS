'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { 
  Sparkles, 
  Cpu, 
  TrendingUp, 
  FileCheck2, 
  GitFork, 
  ArrowRight,
  Zap,
  CheckCircle2
} from 'lucide-react';

type Phase = 'initializing' | 'ready' | 'launching' | 'gone';

const TELEMETRY_STEPS = [
  { at: 15, text: 'Initializing Neural Intelligence Engine...' },
  { at: 40, text: 'Indexing 500,000+ Real-Time Job Telemetry Data...' },
  { at: 65, text: 'Mapping 3D Skill Graph & Career Pathways...' },
  { at: 88, text: 'Calibrating ATS Optimizer & Predictive Models...' },
  { at: 100, text: 'SkillLENS Intelligence Engine Ready.' },
];

export default function SplashScreen() {
  const [phase, setPhase] = useState<Phase>('initializing');
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background Canvas Particle Grid Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
    }> = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 245, 212, ${0.12 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Update & draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 245, 212, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Progress Bar Simulation
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 12) + 8;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        setLogIndex(TELEMETRY_STEPS.length - 1);
        setPhase('ready');
        clearInterval(interval);
      } else {
        setProgress(current);
        const idx = TELEMETRY_STEPS.findIndex((s) => current <= s.at);
        if (idx !== -1) setLogIndex(idx);
      }
    }, 140);

    return () => clearInterval(interval);
  }, []);

  const handleEnterApp = () => {
    setPhase('launching');
    setTimeout(() => {
      setPhase('gone');
    }, 700);
  };

  if (phase === 'gone') return null;

  return (
    <div
      aria-hidden={phase === 'launching'}
      className={cn(
        'fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#030508] transition-all duration-700 ease-in-out',
        phase === 'launching'
          ? 'pointer-events-none scale-110 opacity-0 blur-md'
          : 'opacity-100 scale-100'
      )}
    >
      {/* Background Interactive Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-70" />

      {/* Radial Neon Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      {/* Center Container Card */}
      <div className="relative z-10 flex flex-col items-center max-w-xl w-full px-6 text-center">
        
        {/* Glowing Futuristic Logo Lens */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Outer Dashed Rotating Ring */}
          <div className="absolute w-36 h-36 rounded-full border border-dashed border-primary/30 animate-spin-slow" />
          
          {/* Inner Glowing Pulsing Ring */}
          <div className="absolute w-28 h-28 rounded-full border-2 border-primary/40 shadow-[0_0_50px_rgba(0,245,212,0.35)] animate-ping-slow" />
          
          {/* Center Lens Shield */}
          <div className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-[#0A0D14] to-[#05070E] border border-primary/40 shadow-[0_0_40px_rgba(0,245,212,0.25)] backdrop-blur-xl group">
            <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-sm" />
            <Cpu className="w-12 h-12 text-primary animate-pulse relative z-10" />
            
            {/* Corner Decorative Dots */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-primary/80" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-primary/80" />
          </div>
        </div>

        {/* Brand Name & Sub-Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold tracking-wider uppercase mb-3 backdrop-blur-md shadow-[0_0_15px_rgba(0,245,212,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" />
          Next-Gen Intelligence Engine
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent mb-2">
          SKILL<span className="text-primary drop-shadow-[0_0_20px_rgba(0,245,212,0.6)]">LENS</span>
        </h1>
        
        <p className="text-sm md:text-base text-slate-400 font-medium max-w-md leading-relaxed mb-8">
          AI-Powered Job Market Intelligence, ATS Resume Optimization & 3D Skill Graph Analytics
        </p>

        {/* Platform Feature Pills */}
        <div className="grid grid-cols-2 gap-2.5 w-full mb-8">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0A0D14]/90 border border-white/[0.08] backdrop-blur-md text-left text-xs text-slate-300 hover:border-primary/30 transition-colors">
            <TrendingUp className="w-4 h-4 text-primary shrink-0" />
            <span className="font-medium">Real-Time Market Telemetry</span>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0A0D14]/90 border border-white/[0.08] backdrop-blur-md text-left text-xs text-slate-300 hover:border-indigo-400/30 transition-colors">
            <GitFork className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="font-medium">3D Skill Graph & Career Twin</span>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0A0D14]/90 border border-white/[0.08] backdrop-blur-md text-left text-xs text-slate-300 hover:border-emerald-400/30 transition-colors">
            <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">ATS Resume Optimization</span>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0A0D14]/90 border border-white/[0.08] backdrop-blur-md text-left text-xs text-slate-300 hover:border-amber-400/30 transition-colors">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium">Salary & Demand AI Forecast</span>
          </div>
        </div>

        {/* Interactive Progress & Enter Button Section */}
        <div className="w-full bg-[#0A0D14]/95 border border-white/[0.08] rounded-2xl p-5 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.65)] relative overflow-hidden">
          
          {/* Top Progress Header */}
          <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-slate-300 mb-2">
            <span className="flex items-center gap-1.5 text-primary">
              {progress === 100 ? (
                <CheckCircle2 className="w-4 h-4 text-primary animate-bounce" />
              ) : (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              )}
              {progress === 100 ? 'SYSTEM INITIALIZED' : 'LOADING SYSTEM...'}
            </span>
            <span className="font-mono text-primary text-sm font-bold">{progress}%</span>
          </div>

          {/* Progress Bar Container */}
          <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden mb-3 p-0.5 border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-primary transition-all duration-200 ease-out shadow-[0_0_12px_rgba(0,245,212,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Live Telemetry Log Text */}
          <div className="h-5 flex items-center justify-center text-[11px] font-mono text-slate-400 truncate mb-4">
            {TELEMETRY_STEPS[logIndex]?.text}
          </div>

          {/* High-Octane "ENTER SKILLLENS" Button */}
          <button
            onClick={handleEnterApp}
            className={cn(
              'group relative w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-lg',
              phase === 'ready'
                ? 'bg-gradient-to-r from-primary via-cyan-400 to-indigo-500 text-slate-950 shadow-[0_0_30px_rgba(0,245,212,0.5)] hover:shadow-[0_0_45px_rgba(0,245,212,0.8)] hover:scale-[1.02] cursor-pointer'
                : 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 cursor-pointer'
            )}
          >
            {/* Shimmer Effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            
            <span className="relative z-10">
              {phase === 'ready' ? 'ENTER SKILLLENS PLATFORM' : 'EXPLORE PLATFORM NOW'}
            </span>
            <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
}