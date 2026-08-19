'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type Phase = 'entering' | 'showing' | 'leaving' | 'gone';

export default function SplashScreen() {
  const [phase, setPhase] = useState<Phase>('entering');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase('showing'), 60);

    let value = 0;
    const progressTimer = setInterval(() => {
      value += 10 + Math.random() * 14;
      if (value >= 100) {
        value = 100;
        clearInterval(progressTimer);
        setProgress(100);
        setTimeout(() => setPhase('leaving'), 400);
        setTimeout(() => setPhase('gone'), 1150);
      } else {
        setProgress(Math.min(100, Math.floor(value)));
      }
    }, 180);

    return () => {
      clearTimeout(enterTimer);
      clearInterval(progressTimer);
    };
  }, []);

  if (phase === 'gone') return null;

  return (
    <div
      aria-hidden={phase === 'leaving'}
      className={cn(
        'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-700 ease-in-out',
        phase === 'leaving' ? 'pointer-events-none opacity-0' : 'opacity-100'
      )}
    >
      <div className="relative flex h-28 w-28 items-center justify-center">
        <div
          className="absolute inset-0 border border-primary/10"
          style={{ animation: 'ping-slow 1.8s ease-out infinite' }}
        />
        <div className="absolute inset-0 animate-spin-slow rounded-3xl border-2 border-transparent border-t-primary border-r-primary/40" />
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 shadow-[0_0_50px_rgba(0,245,212,0.2)]">
          <span className="animate-splash-bounce text-4xl font-bold text-primary">S</span>
        </div>
      </div>

      <h1 className="mt-9 text-2xl font-bold tracking-[0.5em] text-text-primary">
        SKILLLENS
      </h1>
      <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.35em] text-text-secondary">
        Career Intelligence Platform
      </p>

      <div className="mt-10 h-1 w-60 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-dark to-primary transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-[11px] tabular-nums tracking-[0.3em] text-text-secondary/70">
        LOADING {progress}%
      </p>
    </div>
  );
}