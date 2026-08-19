'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import Sidebar from './Sidebar';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main
        className={cn(
          'flex-1 transition-all duration-300',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
