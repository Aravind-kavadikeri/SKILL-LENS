'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp, TrendingDown, Activity, BarChart3, ChevronDown, ChevronUp,
} from 'lucide-react';
import { getWeeklyTrends, getQuarterlyReport } from '@/lib/api';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { MetricDelta } from '@/components/feedback/MetricDelta';
import { cn, formatPercent, formatNumber } from '@/lib/utils';

type SortKey = 'name' | 'rank' | 'change';
type SortDir = 'asc' | 'desc';

export default function RealtimeTrendsPage() {
  const [sortKey, setSortKey] = useState<SortKey>('change');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [expandedQuarter, setExpandedQuarter] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState([50]);
  const [marketVolatility, setMarketVolatility] = useState([30]);

  const { data: trends, isLoading: tLoading, error: tError, refetch: tRefetch } = useQuery({
    queryKey: ['weeklyTrends'],
    queryFn: getWeeklyTrends,
  });

  const { data: quarterly, isLoading: qLoading } = useQuery({
    queryKey: ['quarterlyReport'],
    queryFn: getQuarterlyReport,
  });

  const isLoading = tLoading || qLoading;
  const error = tError;

  const currentWeek = trends?.weeks?.[0];
  const latestSkills = currentWeek?.top_skills || [];

  const currentPulse = currentWeek?.market_pulse ?? 65;
  const pulseStatus = currentPulse >= 70 ? 'success' : currentPulse >= 40 ? 'warning' : 'error';

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  const sortedTrends = useMemo(() => {
    if (!latestSkills.length) return [];
    return [...latestSkills].sort((a, b) => {
      const m = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'name') return a.name.localeCompare(b.name) * m;
      if (sortKey === 'rank') return (a.rank - b.rank) * m;
      if (sortKey === 'change') return (a.change - b.change) * m;
      return 0;
    });
  }, [latestSkills, sortKey, sortDir]);

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <button onClick={() => handleSort(field)} className="flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors">
      {label}
      {sortKey === field && <span className="text-primary text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>}
    </button>
  );

  if (error) {
    return (
      <div>
        <PageHeader title="Real-Time Trends" description="Live Market Intelligence" />
        <AlertBanner message={(error as Error)?.message || 'Failed to load real-time trends'} onRetry={tRefetch} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Real-Time Trends" description="Live Market Intelligence" />

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl lg:col-span-2" />
          </div>
          <Skeleton className="h-48 rounded-xl" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Market Pulse Gauge</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#1a1a2e" strokeWidth="8" />
                    <circle
                      cx="60" cy="60" r="50" fill="none"
                      stroke={pulseStatus === 'success' ? '#00F5D4' : pulseStatus === 'warning' ? '#F59E0B' : '#E94560'}
                      strokeWidth="8" strokeDasharray={`${2 * Math.PI * 50 * currentPulse / 100} ${2 * Math.PI * 50 * (1 - currentPulse / 100)}`}
                      strokeLinecap="round" transform="rotate(-90 60 60)"
                    />
                    <text x="60" y="55" textAnchor="middle" dominantBaseline="central" className="text-3xl font-bold" fill="#F8FAFC">
                      {currentPulse}
                    </text>
                    <text x="60" y="75" textAnchor="middle" dominantBaseline="central" className="text-xs" fill="#a0a0a0">
                      /100
                    </text>
                  </svg>
                </div>
                <StatusBadge status={pulseStatus} label={pulseStatus === 'success' ? 'Strong Market' : pulseStatus === 'warning' ? 'Moderate' : 'Weak'} className="mt-3" />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Weekly Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                {sortedTrends.length > 0 ? (
                  <div className="overflow-x-auto max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-800/60">
                          <th className="text-left py-2 pr-3"><SortHeader label="Skill" field="name" /></th>
                          <th className="text-right py-2 pr-3"><SortHeader label="Rank" field="rank" /></th>
                          <th className="text-right py-2"><SortHeader label="Change" field="change" /></th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedTrends.slice(0, 10).map((t, i) => (
                          <tr key={i} className="border-b border-gray-800/30 hover:bg-white/5 transition-colors">
                            <td className="py-2 pr-3 text-text-primary">{t.name}</td>
                            <td className="py-2 pr-3 text-right text-text-secondary">#{t.rank}</td>
                            <td className="py-2 text-right">
                              <span className={cn('inline-flex items-center gap-0.5 text-xs font-medium', t.change >= 0 ? 'text-emerald-400' : 'text-accent')}>
                                {t.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {formatPercent(t.change / 100)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm py-6 text-center">No weekly trend data</p>
                )}
              </CardContent>
            </Card>
          </div>

          {quarterly && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Quarterly Report</CardTitle>
                    <CardDescription>{quarterly.quarters.length} quarter(s) available</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setExpandedQuarter(expandedQuarter ? 0 : 1)}>
                    {expandedQuarter ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-surface/30 border border-gray-800/60">
                    <p className="text-xs text-text-secondary">Top Skill</p>
                    <p className="text-sm font-semibold text-text-primary mt-0.5">{quarterly.summary.top_skill || 'N/A'}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface/30 border border-gray-800/60">
                    <p className="text-xs text-text-secondary">Top Industry</p>
                    <p className="text-sm font-semibold text-text-primary mt-0.5">{quarterly.summary.top_industry || 'N/A'}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface/30 border border-gray-800/60">
                    <p className="text-xs text-text-secondary">Avg Growth</p>
                    <p className="text-sm font-semibold text-text-primary mt-0.5">
                      {formatPercent(quarterly.summary.avg_growth)}
                    </p>
                  </div>
                </div>

                {expandedQuarter > 0 && quarterly.quarters.map((q, qi) => (
                  <div key={qi} className="space-y-3 pt-3 border-t border-gray-800/60">
                    <p className="text-xs font-medium text-text-secondary">{q.quarter}</p>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-xs text-text-secondary mb-1 font-medium">Skills</p>
                        {q.skills.map((ts, i) => (
                          <div key={i} className="flex justify-between text-sm py-0.5">
                            <span className="text-text-primary">{ts.name}</span>
                            <MetricDelta value={ts.growth_rate} />
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary mb-1 font-medium">Industry Trends</p>
                        {q.industry_trends.map((it, i) => (
                          <div key={i} className="flex justify-between text-sm py-0.5">
                            <span className="text-text-primary">{it.industry}</span>
                            <MetricDelta value={it.growth} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Simulation Controls</CardTitle>
              <CardDescription>Adjust market conditions to simulate scenarios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary">Market Speed</span>
                  <span className="text-xs text-text-primary">{simulationSpeed[0]}%</span>
                </div>
                <Slider value={simulationSpeed} onValueChange={setSimulationSpeed} min={0} max={100} step={5} />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary">Volatility</span>
                  <span className="text-xs text-text-primary">{marketVolatility[0]}%</span>
                </div>
                <Slider value={marketVolatility} onValueChange={setMarketVolatility} min={0} max={100} step={5} />
              </div>
              <div className="flex items-center gap-2 py-2 text-xs text-text-secondary">
                <Activity className="h-3 w-3" />
                Simulated metrics adjust with volatility and speed parameters
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
