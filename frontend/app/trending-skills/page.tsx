'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { getTrendingSkills, getSkillScarcity } from '@/lib/api';
import { useAppStore } from '@/lib/store';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { Badge } from '@/components/ui/badge';
import { KPICard } from '@/components/cards/KPICard';
import { formatPercent, formatNumber, cn } from '@/lib/utils';
import type { TrendingSkill } from '@/lib/types';

type SortKey = 'name' | 'growth_rate' | 'category';
type SortDir = 'asc' | 'desc';

const TIME_OPTIONS = [
  { value: '6', label: '6 Months' },
  { value: '12', label: '12 Months' },
  { value: '24', label: '24 Months' },
];

function generateTimeSeriesData(skills: TrendingSkill[], months: number) {
  const top5 = skills.slice(0, 5);
  return Array.from({ length: months }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (months - 1 - i));
    const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    const point: Record<string, string | number> = { date: monthLabel };
    top5.forEach((s) => {
      const base = s.trend?.length ? s.trend[s.trend.length - 1].value : s.growth_rate * 100;
      point[s.name] = Math.round(base * (0.3 + Math.random() * 0.7) * (1 + Math.sin(i / months * Math.PI) * 0.2));
    });
    return point;
  });
}

const LINE_COLORS = ['#00F5D4', '#5B5FEE', '#E94560', '#F59E0B', '#10B981'];

export default function TrendingSkillsPage() {
  const { selectedTimeRange, setTimeRange } = useAppStore();
  const [sortKey, setSortKey] = useState<SortKey>('growth_rate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const months = parseInt(selectedTimeRange.replace('m', ''));

  const { data: skillsResp, isLoading: skLoading, error: skError, refetch: skRefetch } = useQuery({
    queryKey: ['trendingSkills', months],
    queryFn: () => getTrendingSkills(months),
  });

  const { data: scarcityResp, isLoading: scLoading } = useQuery({
    queryKey: ['skillScarcity', 10],
    queryFn: () => getSkillScarcity(10),
  });

  const skills = skillsResp?.skills || [];
  const scarcity = scarcityResp?.skills || [];

  const isLoading = skLoading || scLoading;
  const error = skError;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sortedSkills = useMemo(() => {
    if (!skills.length) return [];
    return [...skills].sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'growth_rate') return (a.growth_rate - b.growth_rate) * mul;
      if (sortKey === 'name') return a.name.localeCompare(b.name) * mul;
      if (sortKey === 'category') return a.category.localeCompare(b.category) * mul;
      return 0;
    });
  }, [skills, sortKey, sortDir]);

  const timeSeriesData = useMemo(() => {
    if (!skills.length) return [];
    return generateTimeSeriesData(skills, months);
  }, [skills, months]);

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
    >
      {label}
      {sortKey === field && (
        <span className="text-primary text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>
      )}
    </button>
  );

  if (error) {
    return (
      <div>
        <PageHeader title="Trending Skills" description="Skill Demand Analysis" />
        <AlertBanner message={(error as Error)?.message || 'Failed to load trending skills'} onRetry={skRefetch} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trending Skills"
        description="Skill Demand Analysis"
        actions={
          <Tabs value={selectedTimeRange} onValueChange={(v) => setTimeRange(v as '6m' | '12m' | '24m')}>
            <TabsList>
              {TIME_OPTIONS.map((opt) => (
                <TabsTrigger key={opt.value} value={`${opt.value}m`}>{opt.label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        }
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Skill Demand Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  {timeSeriesData.length > 0 ? (
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timeSeriesData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
                          <XAxis dataKey="date" stroke="#a0a0a0" fontSize={12} />
                          <YAxis stroke="#a0a0a0" fontSize={12} />
                          <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '8px' }} />
                          <Legend />
                          {skills.slice(0, 5).map((s, i) => (
                            <Line key={s.name} type="monotone" dataKey={s.name} stroke={LINE_COLORS[i]} strokeWidth={2} dot={false} />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p className="text-text-secondary text-sm py-8 text-center">No trend data available</p>
                  )}
                </CardContent>
              </Card>
            </div>
            <div>
                <KPICard
                label="Market Pulse"
                value={scarcity[0]?.scarcity_score ?? 0}
                format="percent"
                icon={<TrendingUp className="h-4 w-4" />}
              />
              {scarcity.slice(0, 3).map((s, i) => (
                <div key={i} className="mt-3 p-3 rounded-lg bg-surface/30 border border-gray-800/60">
                  <p className="text-sm font-medium text-text-primary">{s.name}</p>
                  <p className="text-xs text-text-secondary mt-1">Scarcity: {formatPercent(s.scarcity_score)}</p>
                  <p className="text-xs text-text-secondary">Demand/Supply: {s.demand_supply_ratio.toFixed(1)}x</p>
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Skill Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedSkills.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800/60">
                        <th className="text-left py-3 pr-4"><SortHeader label="Rank" field="growth_rate" /></th>
                        <th className="text-left py-3 pr-4"><SortHeader label="Skill" field="name" /></th>
                        <th className="text-right py-3 pr-4"><SortHeader label="Growth Rate" field="growth_rate" /></th>
                        <th className="text-right py-3 pr-4"><SortHeader label="Trend Points" field="growth_rate" /></th>
                        <th className="text-left py-3"><SortHeader label="Category" field="category" /></th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSkills.map((skill, i) => (
                        <tr key={skill.name} className="border-b border-gray-800/30 hover:bg-white/5 transition-colors">
                          <td className="py-3 pr-4 text-text-secondary">{i + 1}</td>
                          <td className="py-3 pr-4 font-medium text-text-primary">{skill.name}</td>
                          <td className="py-3 pr-4 text-right">
                            <span className={cn('font-medium', skill.growth_rate >= 0 ? 'text-emerald-400' : 'text-accent')}>
                              {formatPercent(skill.growth_rate)}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-right text-text-secondary">{skill.trend?.length || 0}</td>
                          <td className="py-3"><Badge variant="outline">{skill.category}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-text-secondary text-sm py-8 text-center">No skill data available</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
