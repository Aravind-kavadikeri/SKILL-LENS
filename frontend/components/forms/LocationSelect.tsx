'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LocationSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const LOCATIONS = [
  'Bengaluru (Bangalore)',
  'Hyderabad',
  'Pune',
  'Gurgaon / Delhi NCR',
  'Noida',
  'Mumbai',
  'Chennai',
  'Ahmedabad',
  'Kochi',
  'India (All Regions)',
  'United States',
  'United Kingdom',
  'Singapore',
  'Remote (Global)',
];

export function LocationSelect({ value, onValueChange, placeholder = 'Select location...', className }: LocationSelectProps) {
  return (
    <Select value={value || ''} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {LOCATIONS.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {loc}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
