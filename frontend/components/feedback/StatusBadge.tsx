'use client';

import { cn } from '@/lib/utils';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  value?: string | number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const STATUS_STYLES: Record<StatusType, { bg: string; dot: string }> = {
  success: { bg: 'bg-emerald-500/15', dot: 'bg-emerald-400' },
  warning: { bg: 'bg-yellow-500/15', dot: 'bg-yellow-400' },
  error: { bg: 'bg-accent/15', dot: 'bg-accent' },
  info: { bg: 'bg-primary/15', dot: 'bg-primary' },
  neutral: { bg: 'bg-gray-500/15', dot: 'bg-text-secondary' },
};

const SIZE_STYLES = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-sm gap-1.5',
  lg: 'px-3 py-1.5 text-sm gap-1.5',
};

const DOT_SIZES = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-2.5 w-2.5',
};

export function StatusBadge({ status, label, value, className, size = 'sm' }: StatusBadgeProps) {
  const styles = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        styles.bg,
        SIZE_STYLES[size],
        className
      )}
    >
      <span className={cn('rounded-full', styles.dot, DOT_SIZES[size])} />
      {label && <span className="text-text-primary">{label}</span>}
      {value !== undefined && <span className="font-semibold">{value}</span>}
    </span>
  );
}
