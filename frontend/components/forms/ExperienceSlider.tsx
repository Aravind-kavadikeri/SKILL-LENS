'use client';

import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface ExperienceSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  className?: string;
}

export function ExperienceSlider({ value, onValueChange, className }: ExperienceSliderProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">Years of Experience</span>
        <span className="text-sm font-medium text-text-primary">{value} yrs</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onValueChange(v)}
        min={0}
        max={30}
        step={1}
      />
    </div>
  );
}
