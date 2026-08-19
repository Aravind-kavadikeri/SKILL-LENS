'use client';

import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { getJobMarket } from '@/lib/api';
import { useAppStore } from '@/lib/store';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { formatPercent, formatNumber } from '@/lib/utils';

const COLORS = ['#00F5D4', '#5B5FEE', '#E94560', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4'];

const COUNTRY_OPTIONS = [
  { value: 'india', label: 'India' },
  { value: 'us', label: 'US' },
  { value: 'global', label: 'Global' },
];

export default function JobMarketPage() {
  const { selectedCountry, setCountry } = useAppStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['jobMarket', selectedCountry],
    queryFn: () => getJobMarket(selectedCountry),
  });

  if (error) {
    return (
      <div>
        <PageHeader title="Job Market" description="Location & Industry Analysis" />
        <AlertBanner message={(error as Error)?.message || 'Failed to load job market data'} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Market"
        description="Location & Industry Analysis"
        actions={
              <Tabs value={selectedCountry} onValueChange={(v) => setCountry(v as 'india' | 'us' | 'global')}>
            <TabsList>
              {COUNTRY_OPTIONS.map((opt) => (
                <TabsTrigger key={opt.value} value={opt.value}>{opt.label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        }
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-72 rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      ) : !data ? (
        <p className="text-text-secondary text-sm py-8 text-center">No job market data available</p>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Top Locations by Job Count</CardTitle>
            </CardHeader>
            <CardContent>
              {data.locations.length > 0 ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.locations.slice(0, 10)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
                      <XAxis type="number" stroke="#a0a0a0" fontSize={12} />
                      <YAxis type="category" dataKey="name" stroke="#a0a0a0" fontSize={12} width={120} />
                      <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '8px' }} />
                      <Bar dataKey="count" fill="#00F5D4" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-text-secondary text-sm py-8 text-center">No location data available</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Industry Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {data.industries.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={data.industries} cx="50%" cy="50%" outerRadius={80} dataKey="count" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {data.industries.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '8px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm py-8 text-center">No industry data available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Remote Work Stats</CardTitle>
              </CardHeader>
              <CardContent>
                {data.remote_stats ? (
                  <div className="flex flex-col gap-4 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-primary">Remote</span>
                      <StatusBadge status="success" label={formatPercent(data.remote_stats.remote_percent)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-primary">Hybrid</span>
                      <StatusBadge status="warning" label={formatPercent(data.remote_stats.hybrid_percent)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-primary">Onsite</span>
                      <StatusBadge status="info" label={formatPercent(data.remote_stats.onsite_percent)} />
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-800/60">
                      <p className="text-xs text-text-secondary">Total Listings: {formatNumber(data.total_jobs)}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm py-8 text-center">No remote work data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
