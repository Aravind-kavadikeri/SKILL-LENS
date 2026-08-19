'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RoleSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const ROLES = [
  'Student / Intern (Campus Placement)',
  'Graduate Trainee / SDE Intern',
  'Software Engineer',
  'Data Scientist',
  'Data Engineer',
  'Machine Learning Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Cloud Architect',
  'Product Manager',
  'AI Engineer',
  'Research Scientist',
  'Business Analyst',
  'Data Analyst',
  'Security Engineer',
];

export function RoleSelect({ value, onValueChange, placeholder = 'Select role...', className }: RoleSelectProps) {
  return (
    <Select value={value || ''} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((role) => (
          <SelectItem key={role} value={role}>
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
