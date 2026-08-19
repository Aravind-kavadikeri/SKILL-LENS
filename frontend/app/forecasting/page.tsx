'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, ComposedChart,
} from 'recharts';
import { getForecast } from '@/lib/api';
import { useAppStore } from '@/lib/store';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { KPICard } from '@/components/cards/KPICard';
import { RoleSelect } from '@/components/forms/RoleSelect';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';

const MODEL_OPTIONS = [
  { value: 'prophet', label: 'Prophet' },
  { value: 'xgboost', label: 'XGBoost' },
  { value: 'lstm', label: 'LSTM' },
];

const TIME_OPTIONS = [
  { value: '6', label: '6 Months' },
  { value: '12', label: '12 Months' },
  { value: '24', label: '24 Months' },
];

export default function ForecastingPage() {
  const { selectedRole, setRole, selectedTimeRange, setTimeRange } = useAppStore();
  const [model, setModel] = useState('prophet');

  const months = parseInt(selectedTimeRange.replace('m', ''));

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['forecast', selectedRole, model, months],
    queryFn: () => getForecast(selectedRole || '', model, months),
    enabled: !!selectedRole,
  });

  const chartData = useMemo(() => {
    if (!data) return [];
    const historicalPoints = (data.historical || []).map((h) => ({
      date: h.date,
      historical: h.value,
      forecast: null as number | null,
      upper_bound: null as number | null,
      lower_bound: null as number | null,
    }));

    const lastHist = data.historical?.[data.historical.length - 1];
    const forecastPoints = (data.forecast || []).map((f) => ({
      date: f.date,
      historical: null as number | null,
      forecast: f.value,
      upper_bound: f.upper_bound ?? f.value * 1.05,
      lower_bound: f.lower_bound ?? f.value * 0.95,
    }));

    if (lastHist && forecastPoints.length > 0) {
      forecastPoints.unshift({
        date: lastHist.date,
        historical: null,
        forecast: lastHist.value,
        upper_bound: lastHist.value,
        lower_bound: lastHist.value,
      });
    }

    return [...historicalPoints, ...forecastPoints];
  }, [data]);

  return (
    <div className="space-y-6">
      <PageHeader title="Forecasting" description="Skill Demand Forecasting" />

      <div className="flex flex-wrap items-center gap-4">
        <div className="w-56">
          <RoleSelect value={selectedRole || ''} onValueChange={(v) => setRole(v)} placeholder="Select a skill..." />
        </div>
        <Tabs value={model} onValueChange={setModel}>
          <TabsList>
            {MODEL_OPTIONS.map((opt) => (
              <TabsTrigger key={opt.value} value={opt.value}>{opt.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Tabs value={selectedTimeRange} onValueChange={(v) => setTimeRange(v as '6m' | '12m' | '24m')}>
          <TabsList>
            {TIME_OPTIONS.map((opt) => (
              <TabsTrigger key={opt.value} value={`${opt.value}m`}>{opt.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {!selectedRole ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-text-secondary">Select a skill to view demand forecast</p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-80 rounded-xl" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        </div>
      ) : error ? (
        <AlertBanner message={(error as Error)?.message || 'Failed to load forecast'} onRetry={refetch} />
      ) : !data ? (
        <p className="text-text-secondary text-sm py-8 text-center">No forecast data available</p>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Demand Forecast — {data.skill}</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
                      <XAxis dataKey="date" tickFormatter={(d) => formatDate(d, { month: 'short', year: '2-digit' })} stroke="#a0a0a0" fontSize={12} />
                      <YAxis stroke="#a0a0a0" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '8px' }} labelFormatter={(d) => formatDate(d)} />
                      <Legend />
                      <Area type="monotone" dataKey="upper_bound" fill="#00F5D4" fillOpacity={0.08} stroke="none" name="Confidence Range" />
                      <Area type="monotone" dataKey="lower_bound" fill="#00F5D4" fillOpacity={0.08} stroke="none" name="Confidence Base" />
                      <Line type="monotone" dataKey="historical" stroke="#00F5D4" strokeWidth={2} dot={false} name="Historical" connectNulls />
                      <Line type="monotone" dataKey="forecast" stroke="#5B5FEE" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Forecast" connectNulls />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-text-secondary text-sm py-8 text-center">No forecast points available</p>
              )}
            </CardContent>
          </Card>

          {data.metrics && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <KPICard label="MAE (Mean Absolute Error)" value={formatNumber(Math.round(data.metrics.mae))} />
              <KPICard label="RMSE (Root Mean Square Error)" value={formatNumber(Math.round(data.metrics.rmse))} />
              <KPICard label="MAPE (Mean Absolute % Error)" value={`${data.metrics.mape.toFixed(1)}%`} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
