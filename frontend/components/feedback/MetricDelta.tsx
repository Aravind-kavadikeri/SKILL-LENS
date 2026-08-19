'use client';

import { cn } from '@/lib/utils';

interface MetricDeltaProps {
  value: number;
  label?: string;
  inverse?: boolean;
}

export function MetricDelta({ value, label, inverse = false }: MetricDeltaProps) {
  const isPositive = inverse ? value < 0 : value > 0;
  const isNegative = inverse ? value > 0 : value < 0;
  const isNeutral = value === 0;

  const color = isPositive
    ? 'text-primary'
    : isNegative
      ? 'text-accent'
      : 'text-text-secondary';

  const arrow = isPositive ? '↑' : isNegative ? '↓' : '→';
  const sign = value > 0 ? '+' : '';

  return (
    <span className={cn('inline-flex items-center gap-1 text-sm font-medium', color)}>
      <span>{arrow}</span>
      <span>
        {sign}
        {value.toFixed(1)}
      </span>
      {label && <span className="text-text-secondary text-xs">{label}</span>}
    </span>
  );
}
