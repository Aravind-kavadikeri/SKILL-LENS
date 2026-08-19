'use client';

import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { getDashboardSummary, getMarketPulse } from '@/lib/api';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { MetricRow } from '@/components/cards/MetricRow';
import { formatCurrency, formatPercent, formatNumber, formatDate } from '@/lib/utils';

const COLORS = ['#00F5D4', '#5B5FEE', '#E94560', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4'];

export default function DashboardPage() {
  const {
    data: summary,
    isLoading: sumLoading,
    error: sumError,
    refetch: sumRefetch,
  } = useQuery({ queryKey: ['dashboardSummary'], queryFn: getDashboardSummary });

  const {
    data: pulse,
    isLoading: pulseLoading,
    error: pulseError,
    refetch: pulseRefetch,
  } = useQuery({ queryKey: ['marketPulse'], queryFn: getMarketPulse });

  const isLoading = sumLoading || pulseLoading;
  const error = sumError || pulseError;
  const refetchAll = () => { sumRefetch(); pulseRefetch(); };

  if (error) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Career Intelligence Overview" />
        <AlertBanner
          message={(error as Error)?.message || 'Failed to load dashboard data'}
          onRetry={refetchAll}
        />
      </div>
    );
  }

  const metrics = summary
    ? [
        { label: 'Total Jobs Tracked', value: summary.total_jobs, change: summary.job_growth_rate, format: 'number' as const, icon: <Users className="h-4 w-4" /> },
        { label: 'Skills Monitored', value: summary.top_skills.length, format: 'number' as const, icon: <TrendingUp className="h-4 w-4" /> },
        { label: 'Average Salary', value: summary.avg_salary, format: 'currency' as const, icon: <DollarSign className="h-4 w-4" /> },
        { label: 'Market Pulse', value: summary.market_pulse_score, change: summary.job_growth_rate, format: 'percent' as const, icon: <Activity className="h-4 w-4" /> },
      ]
    : [];

  const educationData = summary?.top_skills?.slice(0, 6).map((s) => ({ name: s.name, value: s.demand })) || [];
  const experienceData = summary?.top_skills?.slice(0, 8).map((s, i) => ({ name: s.name, jobs: s.demand, growth: Math.round(s.demand * 0.1) })) || [];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Career Intelligence Overview" />

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-80 rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-72 rounded-xl" />
            <Skeleton className="h-72 rounded-xl" />
          </div>
        </div>
      ) : (
        <>
          <MetricRow metrics={metrics} />

          <Card>
            <CardHeader>
              <CardTitle>Market Pulse</CardTitle>
            </CardHeader>
            <CardContent>
              {pulse?.data && pulse.data.length > 0 ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={pulse.data}>
                      <defs>
                        <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00F5D4" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00F5D4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
                      <XAxis dataKey="date" tickFormatter={(d) => formatDate(d, { month: 'short' })} stroke="#a0a0a0" fontSize={12} />
                      <YAxis stroke="#a0a0a0" fontSize={12} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '8px' }}
                        labelFormatter={(d) => formatDate(d)}
                      />
                      <Area type="monotone" dataKey="value" stroke="#00F5D4" fill="url(#pulseGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-text-secondary text-sm py-8 text-center">No market pulse data available</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top In-Demand Skills</CardTitle>
              </CardHeader>
              <CardContent>
                {educationData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={educationData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {educationData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '8px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm py-8 text-center">No skill demand data available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skill Demand Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                {experienceData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={experienceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
                        <XAxis dataKey="name" stroke="#a0a0a0" fontSize={11} interval={0} angle={-15} textAnchor="end" />
                        <YAxis stroke="#a0a0a0" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '8px' }} />
                        <Bar dataKey="jobs" name="Demand Score" fill="#5B5FEE" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm py-8 text-center">No skill comparison data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
