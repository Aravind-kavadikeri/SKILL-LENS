'use client';

import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { MetricDelta } from '@/components/feedback/MetricDelta';

interface InsightCardProps {
  title: string;
  description?: string;
  value?: string | number;
  change?: number;
  badge?: string;
  icon?: ReactNode;
  className?: string;
}

export function InsightCard({ title, description, value, change, badge, icon, className }: InsightCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {icon && <span className="text-primary/70">{icon}</span>}
              <h4 className="text-sm font-medium text-text-primary">{title}</h4>
            </div>
            {description && <p className="text-xs text-text-secondary">{description}</p>}
          </div>
          {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
        </div>
        {(value !== undefined || change !== undefined) && (
          <div className="flex items-baseline gap-2 mt-2">
            {value !== undefined && (
              <span className="text-xl font-semibold text-text-primary">{value}</span>
            )}
            {change !== undefined && <MetricDelta value={change} />}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
