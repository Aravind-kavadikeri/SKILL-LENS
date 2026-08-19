import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const USD_TO_INR = 83;

export function formatCurrency(value: number): string {
  const isNegative = value < 0;
  const absVal = Math.abs(value);

  let formatted = '';
  if (absVal >= 10_000_000) {
    formatted = `₹${(absVal / 10_000_000).toFixed(2)} Cr`;
  } else if (absVal >= 100_000) {
    formatted = `₹${(absVal / 100_000).toFixed(1)} LPA`;
  } else {
    formatted = `₹${absVal.toLocaleString('en-IN')}`;
  }

  return isNegative ? `-${formatted}` : formatted;
}

export function formatPercent(value: number, digits: number = 1): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(digits)}%`;
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  });
}

export function getTrendIcon(value: number): string {
  if (value > 0) return '↑';
  if (value < 0) return '↓';
  return '→';
}

export function getStatusColor(value: number, thresholds?: { low: number; mid: number }): string {
  const { low = 40, mid = 70 } = thresholds || {};
  if (value >= mid) return 'text-primary';
  if (value >= low) return 'text-yellow-400';
  return 'text-accent';
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
