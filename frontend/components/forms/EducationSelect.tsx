'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EducationSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const EDUCATION_LEVELS = [
  'B.Tech / B.E. (Tier-1: IIT/NIT/BITS)',
  'B.Tech / B.E. (Engineering)',
  'M.Tech / M.E.',
  'MCA / BCA',
  "Bachelor's Degree",
  "Master's Degree",
  'PhD / Doctorate',
  'Bootcamp / Certification',
  'Self-Taught',
];

export function EducationSelect({ value, onValueChange, placeholder = 'Select education...', className }: EducationSelectProps) {
  return (
    <Select value={value || ''} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {EDUCATION_LEVELS.map((level) => (
          <SelectItem key={level} value={level}>
            {level}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
