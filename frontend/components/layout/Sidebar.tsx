'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import {
  LayoutDashboard,
  Briefcase,
  TrendingUp,
  DollarSign,
  LineChart,
  FileText,
  GitCompare,
  Share2,
  Globe,
  Activity,
  BarChart3,
  Bot,
  ChevronLeft,
  ChevronRight,
  Settings,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  section: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, section: 'Overview' },
  { label: 'Job Market', href: '/job-market', icon: Briefcase, section: 'Insights' },
  { label: 'Trending Skills', href: '/trending-skills', icon: TrendingUp, section: 'Insights' },
  { label: 'Salary Insights', href: '/salary-insights', icon: DollarSign, section: 'Insights' },
  { label: 'Forecasting', href: '/forecasting', icon: LineChart, section: 'Analytics' },
  { label: 'Resume Analyzer', href: '/resume-analyzer', icon: FileText, section: 'Career' },
  { label: 'Skill Gap', href: '/skill-gap', icon: GitCompare, section: 'Career' },
  { label: 'Skill Graph', href: '/skill-graph', icon: Share2, section: 'Career' },
  { label: 'Geographic', href: '/geographic', icon: Globe, section: 'Analytics' },
  { label: 'Real-Time Trends', href: '/realtime-trends', icon: Activity, section: 'Analytics' },
  { label: 'Executive View', href: '/executive', icon: BarChart3, section: 'Analytics' },
  { label: 'AI Assistant', href: '/ai-assistant', icon: Bot, section: 'Tools' },
];

const sections = ['Overview', 'Insights', 'Analytics', 'Career', 'Tools'] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-full flex-col border-r border-gray-800/60 bg-[#0a0a1a] transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-14 items-center border-b border-gray-800/60 px-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <span className="text-sm font-bold text-primary">S</span>
          </div>
          {!sidebarCollapsed && (
            <span className="text-sm font-bold tracking-widest text-text-primary">
              SKILLLENS
            </span>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="ml-auto hidden rounded-lg p-1.5 text-text-secondary hover:bg-white/5 hover:text-text-primary md:block"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 scrollbar-thin">
        {sections.map((section) => {
          const items = navItems.filter((item) => item.section === section);
          if (items.length === 0) return null;
          return (
            <div key={section} className="mb-4">
              {!sidebarCollapsed && (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-text-secondary/50">
                  {section}
                </p>
              )}
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'h-4 w-4 shrink-0 transition-colors',
                            isActive ? 'text-primary' : 'text-text-secondary group-hover:text-text-primary'
                          )}
                        />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-gray-800/60 px-2 py-3">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
            pathname === '/settings'
              ? 'bg-primary/10 text-primary'
              : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!sidebarCollapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
