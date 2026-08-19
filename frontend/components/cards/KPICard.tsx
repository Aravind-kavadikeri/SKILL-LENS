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
    <Card className={cn('min-w-[180px]', className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</span>
          {icon && <span className="text-primary/70">{icon}</span>}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-text-primary">{formattedValue}</span>
          {change !== undefined && <MetricDelta value={change} />}
        </div>
      </CardContent>
    </Card>
  );
}
