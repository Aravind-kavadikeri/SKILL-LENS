'use client';

import type { ReactNode } from 'react';
import { KPICard } from './KPICard';
import { cn } from '@/lib/utils';

interface Metric {
  label: string;
  value: string | number;
  change?: number;
  icon?: ReactNode;
  format?: 'currency' | 'percent' | 'number';
}

interface MetricRowProps {
  metrics: Metric[];
  className?: string;
}

export function MetricRow({ metrics, className }: MetricRowProps) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {metrics.map((metric, i) => (
        <KPICard key={i} {...metric} />
      ))}
    </div>
  );
}
