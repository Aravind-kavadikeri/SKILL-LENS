'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, TrendingUp, DollarSign, Building } from 'lucide-react';
import { getGeographic } from '@/lib/api';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { KPICard } from '@/components/cards/KPICard';
import { MetricDelta } from '@/components/feedback/MetricDelta';
import { cn, formatCurrency, formatPercent, formatNumber } from '@/lib/utils';

const METRIC_OPTIONS = [
  { value: 'hiring', label: 'Hiring Activity' },
  { value: 'salary', label: 'Salary' },
  { value: 'remote', label: 'Remote Work' },
];

function generateMockCities(metric: string, baseCount: number) {
  const cities = [
    'San Francisco', 'New York', 'Bengaluru', 'London', 'Seattle', 'Austin',
    'Singapore', 'Toronto', 'Berlin', 'Amsterdam', 'Sydney', 'Dubai',
    'Chicago', 'Los Angeles', 'Dallas', 'Denver', 'Mumbai', 'Hyderabad',
  ];
  return cities.slice(0, baseCount).map((city, i) => ({
    location: city,
    value: metric === 'salary' ? 80000 + Math.round(Math.random() * 120000) :
           metric === 'hiring' ? Math.round(Math.random() * 5000) :
           Math.round(Math.random() * 100),
    growth: -15 + Math.round(Math.random() * 30),
    avg_salary: 70000 + Math.round(Math.random() * 130000),
    x: 10 + Math.round(Math.random() * 80),
    y: 10 + Math.round(Math.random() * 80),
    size: 5 + Math.round(Math.random() * 20),
  }));
}

export default function GeographicPage() {
  const [metric, setMetric] = useState('salary');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['geographic', metric],
    queryFn: () => getGeographic(metric),
  });

  const cities = data?.locations
    ? data.locations.map((d) => {
        const maxV = Math.max(...data.locations.map((l) => l.value), 1);
        return {
          location: d.name,
          value: d.value,
          growth: d.growth ?? Math.round((Math.random() - 0.5) * 40),
          avg_salary: metric === 'salary' ? d.value : (d.count > 0 ? Math.round((d.value / d.count) * 1000) : 1450000),
          x: ((d.lon + 180) / 360) * 100,
          y: ((90 - d.lat) / 180) * 100,
          size: Math.max(3, Math.min(25, (Math.abs(d.value) / maxV) * 22 + 3)),
        };
      })
    : generateMockCities(metric, 12);

  const totalCities = cities.length;
  const avgValue = totalCities > 0 ? cities.reduce((s, c) => s + c.value, 0) / totalCities : 0;
  const topRegion = cities.length > 0 ? cities.reduce((best, c) => c.value > best.value ? c : best, cities[0]).location : 'N/A';
  const avgSalary = cities.length > 0 ? Math.round(cities.reduce((s, c) => s + (c.avg_salary || 0), 0) / cities.length) : 0;

  if (error) {
    return (
      <div>
        <PageHeader title="Geographic Intelligence" description="Location-Based Market Insights" />
        <AlertBanner message={(error as Error)?.message || 'Failed to load geographic data'} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Geographic Intelligence"
        description="Location-Based Market Insights"
        actions={
          <Tabs value={metric} onValueChange={setMetric}>
            <TabsList>
              {METRIC_OPTIONS.map((opt) => (
                <TabsTrigger key={opt.value} value={opt.value}>{opt.label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        }
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {cities.length > 0 ? (
                <div className="relative h-80 w-full bg-surface/20 rounded-lg overflow-hidden border border-gray-800/60">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <radialGradient id="cityDot">
                        <stop offset="0%" stopColor="#00F5D4" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#00F5D4" stopOpacity={0.1} />
                      </radialGradient>
                    </defs>
                    {cities.map((city, i) => (
                      <g key={i}>
                        <circle
                          cx={city.x} cy={city.y} r={city.size}
                          fill="url(#cityDot)"
                          stroke="#00F5D4"
                          strokeWidth={0.5}
                          opacity={0.8}
                        />
                        <text
                          x={city.x} y={city.y - city.size - 2}
                          textAnchor="middle" fill="#a0a0a0"
                          fontSize={2.5}
                        >
                          {city.location}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              ) : (
                <p className="text-text-secondary text-sm py-16 text-center">No geographic data available</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KPICard label="Total Cities" value={totalCities} format="number" icon={<MapPin className="h-4 w-4" />} />
            <KPICard label={`Avg ${metric === 'salary' ? 'Salary' : metric === 'hiring' ? 'Hiring' : 'Remote Score'}`} value={metric === 'salary' ? avgSalary : Math.round(avgValue)} format={metric === 'salary' ? 'currency' : 'number'} icon={<TrendingUp className="h-4 w-4" />} />
            <KPICard label="Top Region" value={topRegion} icon={<Building className="h-4 w-4" />} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Regional Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {cities.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800/60">
                        <th className="text-left py-3 pr-4 text-text-secondary font-medium">City</th>
                        <th className="text-right py-3 pr-4 text-text-secondary font-medium">
                          {metric === 'salary' ? 'Avg Salary' : metric === 'hiring' ? 'Jobs' : 'Remote Score'}
                        </th>
                        <th className="text-right py-3 pr-4 text-text-secondary font-medium">Growth</th>
                        <th className="text-right py-3 text-text-secondary font-medium">Avg Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cities.map((city, i) => (
                        <tr key={i} className="border-b border-gray-800/30 hover:bg-white/5 transition-colors">
                          <td className="py-3 pr-4 text-text-primary font-medium">{city.location}</td>
                          <td className="py-3 pr-4 text-right text-text-primary">
                            {metric === 'salary' ? formatCurrency(city.value) : formatNumber(city.value)}
                          </td>
                          <td className="py-3 pr-4 text-right">
                            <MetricDelta value={city.growth} />
                          </td>
                          <td className="py-3 text-right text-text-secondary">
                            {formatCurrency(city.avg_salary || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-text-secondary text-sm py-6 text-center">No regional data available</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
