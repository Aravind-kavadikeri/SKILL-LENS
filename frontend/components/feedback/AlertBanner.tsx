'use client';

import { type LucideIcon, X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertBannerProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  icon?: LucideIcon;
}

const ALERT_STYLES: Record<string, { bg: string; border: string; iconColor: string }> = {
  info: { bg: 'bg-secondary/10', border: 'border-secondary/30', iconColor: 'text-secondary' },
  success: { bg: 'bg-primary/10', border: 'border-primary/30', iconColor: 'text-primary' },
  warning: { bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', iconColor: 'text-yellow-400' },
  error: { bg: 'bg-accent/10', border: 'border-accent/30', iconColor: 'text-accent' },
};

const DEFAULT_ICONS: Record<string, LucideIcon> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

export function AlertBanner({
  type = 'info',
  title,
  message,
  onDismiss,
  onRetry,
  icon: CustomIcon,
}: AlertBannerProps) {
  const styles = ALERT_STYLES[type];
  const Icon = CustomIcon ?? DEFAULT_ICONS[type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4',
        styles.bg,
        styles.border
      )}
    >
      <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', styles.iconColor)} />
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-medium text-text-primary">{title}</p>}
        <p className={cn('text-sm', title ? 'text-text-secondary mt-0.5' : 'text-text-primary')}>{message}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm text-primary hover:text-primary-dark transition-colors font-medium"
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
