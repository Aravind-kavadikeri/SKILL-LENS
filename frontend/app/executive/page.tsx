'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users, DollarSign, TrendingUp, Briefcase, Search, Eye, BarChart3,
} from 'lucide-react';
import { getExecutiveView } from '@/lib/api';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { KPICard } from '@/components/cards/KPICard';
import { InsightCard } from '@/components/cards/InsightCard';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { MetricDelta } from '@/components/feedback/MetricDelta';
import type { ExecutiveViewData } from '@/lib/types';
import { cn, formatCurrency, formatPercent, formatNumber } from '@/lib/utils';

const VIEW_OPTIONS = [
  { value: 'seeker', label: 'Job Seeker' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'executive', label: 'Executive' },
];

export default function ExecutivePage() {
  const [view, setView] = useState('seeker');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['executiveView', view],
    queryFn: () => getExecutiveView(view),
  });

  if (error) {
    return (
      <div>
        <PageHeader title="Executive View" description="Strategic Workforce Intelligence" />
        <AlertBanner message={(error as Error)?.message || 'Failed to load executive view'} onRetry={refetch} />
      </div>
    );
  }

  const viewData = data?.[view] as ExecutiveViewData | undefined;

  const jobSeekerInsights = useMemo(() => view === 'seeker' && viewData ? [
    { title: 'Top Roles', description: `${viewData.top_roles?.length || 0} roles tracked`, value: viewData.top_roles?.[0]?.role || 'N/A', icon: <Briefcase className="h-4 w-4" />, change: viewData.top_roles?.[0]?.growth },
    { title: 'Salary Benchmarks', description: 'Market salary percentiles', value: viewData.salary_benchmarks?.[0]?.role ? `${formatCurrency(viewData.salary_benchmarks[0].p50)} median` : 'N/A', icon: <DollarSign className="h-4 w-4" /> },
    { title: 'Skill Gaps', description: 'Supply vs demand gaps', value: `${viewData.skill_gaps?.length || 0} gaps identified`, icon: <Search className="h-4 w-4" /> },
    { title: 'Market Outlook', description: 'Hiring intent', value: viewData.market_outlook?.outlook || 'Stable', icon: <TrendingUp className="h-4 w-4" /> },
  ] : [], [view, viewData]);

  const recruiterInsights = useMemo(() => view === 'recruiter' && viewData ? [
    { title: 'Talent Scarcity', description: 'Hardest-to-fill roles', value: viewData.talent_scarcity?.[0]?.role || 'N/A', icon: <Users className="h-4 w-4" />, change: viewData.talent_scarcity?.[0]?.scarcity_index },
    { title: 'Hiring Trends', description: 'Quarterly hiring volume', value: `${viewData.hiring_trends?.length || 0} quarters`, icon: <TrendingUp className="h-4 w-4" /> },
    { title: 'Salary Ranges', description: 'Role-based compensation', value: `${viewData.salary_ranges?.length || 0} roles`, icon: <DollarSign className="h-4 w-4" /> },
    { title: 'Candidate Clusters', description: 'Top skill groups', value: `${viewData.candidate_clusters?.length || 0} clusters`, icon: <BarChart3 className="h-4 w-4" /> },
  ] : [], [view, viewData]);

  const executiveInsights = useMemo(() => view === 'executive' && viewData ? [
    { title: 'Workforce Trends', description: 'Workforce impact analysis', value: `${viewData.workforce_trends?.length || 0} trends`, icon: <Users className="h-4 w-4" /> },
    { title: 'Strategic Insights', description: 'Key market movements', value: `${viewData.strategic_insights?.length || 0} insights`, icon: <Eye className="h-4 w-4" /> },
    { title: 'Competitive Landscape', description: 'Talent concentration', value: `${viewData.competitive_landscape?.length || 0} companies`, icon: <Briefcase className="h-4 w-4" /> },
    { title: 'KPI Summary', description: 'Overall market health', value: viewData.kpi_summary ? `${viewData.kpi_summary.market_health_score}/100` : 'N/A', icon: <BarChart3 className="h-4 w-4" /> },
  ] : [], [view, viewData]);

  const currentInsights = view === 'seeker' ? jobSeekerInsights : view === 'recruiter' ? recruiterInsights : executiveInsights;

  const kpiMetrics = view === 'seeker' && viewData ? [
    { label: 'Top Roles', value: formatNumber(viewData.top_roles?.length || 0), icon: <Briefcase className="h-4 w-4" />, format: 'number' as const },
    { label: 'Salary Benchmarks', value: formatNumber(viewData.salary_benchmarks?.length || 0), icon: <DollarSign className="h-4 w-4" />, format: 'number' as const },
    { label: 'Skill Gaps', value: formatNumber(viewData.skill_gaps?.length || 0), icon: <Search className="h-4 w-4" />, format: 'number' as const },
    { label: 'Market Health', value: viewData.market_outlook?.hiring_intent ? `${viewData.market_outlook.hiring_intent}%` : 'N/A', icon: <TrendingUp className="h-4 w-4" /> },
  ] : view === 'recruiter' && viewData ? [
    { label: 'Talent Pools', value: formatNumber(viewData.talent_scarcity?.length || 0), icon: <Users className="h-4 w-4" />, format: 'number' as const },
    { label: 'Hiring Quarters', value: formatNumber(viewData.hiring_trends?.length || 0), icon: <TrendingUp className="h-4 w-4" />, format: 'number' as const },
    { label: 'Salary Ranges', value: formatNumber(viewData.salary_ranges?.length || 0), icon: <DollarSign className="h-4 w-4" />, format: 'number' as const },
    { label: 'Clusters', value: formatNumber(viewData.candidate_clusters?.length || 0), icon: <BarChart3 className="h-4 w-4" />, format: 'number' as const },
  ] : viewData ? [
    { label: 'Workforce Trends', value: formatNumber(viewData.workforce_trends?.length || 0), icon: <Users className="h-4 w-4" />, format: 'number' as const },
    { label: 'Insights', value: formatNumber(viewData.strategic_insights?.length || 0), icon: <Eye className="h-4 w-4" />, format: 'number' as const },
    { label: 'Companies', value: formatNumber(viewData.competitive_landscape?.length || 0), icon: <Briefcase className="h-4 w-4" />, format: 'number' as const },
    { label: 'Health Score', value: viewData.kpi_summary ? `${viewData.kpi_summary.market_health_score}` : 'N/A', icon: <BarChart3 className="h-4 w-4" /> },
  ] : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive View"
        description="Strategic Workforce Intelligence"
        actions={
          <Tabs value={view} onValueChange={setView}>
            <TabsList>
              {VIEW_OPTIONS.map((opt) => (
                <TabsTrigger key={opt.value} value={opt.value}>{opt.label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        }
      />

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : error ? (
        <AlertBanner message={(error as Error)?.message || 'Failed to load'} onRetry={refetch} />
      ) : data ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiMetrics.map((metric, i) => (
              <KPICard key={i} {...metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentInsights.map((insight, i) => (
              <InsightCard key={i} {...insight} />
            ))}
          </div>

          {view === 'recruiter' && viewData?.candidate_clusters && (
            <Card>
              <CardHeader>
                <CardTitle>Candidate Clusters</CardTitle>
                <CardDescription>Breakdown by skill and seniority</CardDescription>
              </CardHeader>
              <CardContent>
                {viewData.candidate_clusters.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {viewData.candidate_clusters.map((cluster, i) => (
                      <Card key={i} className="bg-surface/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-text-primary">{cluster.cluster}</h4>
                            <Badge variant="secondary">{formatNumber(cluster.count)}</Badge>
                          </div>
                          {cluster.traits.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {cluster.traits.slice(0, 4).map((t) => (
                                <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm py-6 text-center">No cluster data available</p>
                )}
              </CardContent>
            </Card>
          )}

          {view === 'executive' && viewData?.competitive_landscape && (
            <Card>
              <CardHeader>
                <CardTitle>Competitive Landscape</CardTitle>
                <CardDescription>Company hiring activity</CardDescription>
              </CardHeader>
              <CardContent>
                {viewData.competitive_landscape.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-800/60">
                          <th className="text-left py-3 pr-4 text-text-secondary font-medium">Company</th>
                          <th className="text-right py-3 pr-4 text-text-secondary font-medium">Hiring Volume</th>
                          <th className="text-right py-3 pr-4 text-text-secondary font-medium">Avg Salary</th>
                          <th className="text-left py-3 text-text-secondary font-medium">Focus</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewData.competitive_landscape.map((comp, i) => (
                          <tr key={i} className="border-b border-gray-800/30 hover:bg-white/5 transition-colors">
                            <td className="py-3 pr-4 text-text-primary font-medium">{comp.company}</td>
                            <td className="py-3 pr-4 text-right text-text-secondary">{formatNumber(comp.hiring_volume)}</td>
                            <td className="py-3 pr-4 text-right text-text-secondary">{formatCurrency(comp.avg_salary)}</td>
                            <td className="py-3 text-text-secondary">{comp.top_focus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm py-6 text-center">No competitive data available</p>
                )}
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="h-12 w-12 text-text-secondary/30 mx-auto mb-3" />
            <p className="text-text-secondary">Select a view to see strategic workforce data</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
