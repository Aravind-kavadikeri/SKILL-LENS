'use client';

import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn, formatCurrency, formatPercent, formatNumber } from '@/lib/utils';
import { MetricDelta } from '@/components/feedback/MetricDelta';

interface KPICardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: ReactNode;
  format?: 'currency' | 'percent' | 'number';
  className?: string;
}

export function KPICard({ label, value, change, icon, format, className }: KPICardProps) {
  const formattedValue =
    typeof value === 'number'
      ? format === 'currency'
        ? formatCurrency(value)
        : format === 'percent'
          ? formatPercent(value)
          : format === 'number'
            ? formatNumber(value)
            : value.toString()
      : value;

  return (
    <Card className={cn('relative overflow-hidden min-w-[180px] group border-white/[0.08] hover:border-primary/40 transition-all duration-300', className)}>
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
          {icon && <span className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-[0_0_12px_rgba(0,245,212,0.15)]">{icon}</span>}
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">{formattedValue}</span>
          {change !== undefined && <MetricDelta value={change} />}
        </div>
      </CardContent>
    </Card>
  );
}

