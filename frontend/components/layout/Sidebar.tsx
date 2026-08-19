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
  Cpu,
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
        'fixed left-0 top-0 z-40 flex h-full flex-col border-r border-white/[0.08] bg-[#05070E] backdrop-blur-xl transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center border-b border-white/[0.08] px-4">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1A1A2E] to-[#0D1127] border border-primary/40 shadow-[0_0_20px_rgba(0,245,212,0.2)] transition-transform duration-300 group-hover:scale-105">
            <Cpu className="h-5 w-5 text-primary animate-pulse" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-widest bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                SKILL<span className="text-primary">LENS</span>
              </span>
              <span className="text-[9px] font-semibold tracking-widest text-slate-500 uppercase">
                AI ENGINE
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="ml-auto hidden rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.06] hover:text-white transition-colors md:block"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-4">
        {sections.map((section) => {
          const items = navItems.filter((item) => item.section === section);
          if (items.length === 0) return null;
          return (
            <div key={section}>
              {!sidebarCollapsed && (
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {section}
                </p>
              )}
              <ul className="space-y-1">
                {items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                          isActive
                            ? 'bg-primary/10 text-primary border border-primary/30 shadow-[0_0_20px_rgba(0,245,212,0.12)] font-semibold'
                            : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'
                        )}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary shadow-[0_0_8px_rgba(0,245,212,0.8)]" />
                        )}
                        <item.icon
                          className={cn(
                            'h-4 w-4 shrink-0 transition-colors',
                            isActive ? 'text-primary drop-shadow-[0_0_8px_rgba(0,245,212,0.6)]' : 'text-slate-400 group-hover:text-slate-100'
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

      <div className="border-t border-white/[0.08] px-2.5 py-3">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
            pathname === '/settings'
              ? 'bg-primary/10 text-primary border border-primary/30 shadow-[0_0_20px_rgba(0,245,212,0.12)] font-semibold'
              : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!sidebarCollapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}

