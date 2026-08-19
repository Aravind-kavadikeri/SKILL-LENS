'use client';

import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  ComposedChart,
} from 'recharts';

interface ChartDataPoint {
  date?: string;
  value?: number;
  lowerBound?: number;
  upperBound?: number;
  [key: string]: unknown;
}

interface LineChartProps {
  data: ChartDataPoint[];
  xKey?: string;
  yKey?: string;
  lowerKey?: string;
  upperKey?: string;
  color?: string;
  height?: number;
  showConfidence?: boolean;
}

export function LineChart({
  data,
  xKey = 'date',
  yKey = 'value',
  lowerKey = 'lowerBound',
  upperKey = 'upperBound',
  color = '#00F5D4',
  height = 300,
  showConfidence = false,
}: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-gray-800/60 bg-surface/50"
        style={{ height }}
      >
        <p className="text-sm text-text-secondary">No data available</p>
      </div>
    );
  }

  const ChartComponent = showConfidence ? ComposedChart : RechartsLineChart;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ChartComponent data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`confidence-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
            <stop offset="95%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: '#a0a0a0', fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
        />
        <YAxis
          tick={{ fill: '#a0a0a0', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          width={60}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a1a2e',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.37)',
          }}
          labelStyle={{ color: '#F8FAFC', fontWeight: 600 }}
          itemStyle={{ color: '#a0a0a0' }}
        />
        {showConfidence && lowerKey && upperKey && (
          <Area
            type="monotone"
            dataKey={upperKey}
            stroke="none"
            fill={`url(#confidence-${color.replace('#', '')})`}
          />
        )}
        {showConfidence && lowerKey && upperKey && (
          <Area
            type="monotone"
            dataKey={lowerKey}
            stroke="none"
            fill={`url(#confidence-${color.replace('#', '')})`}
          />
        )}
        <Line
          type="monotone"
          dataKey={yKey}
          stroke={color}
          strokeWidth={2}
          dot={{ r: 4, fill: color, stroke: '#1a1a2e', strokeWidth: 2 }}
          activeDot={{ r: 6, fill: color, stroke: '#1a1a2e', strokeWidth: 2 }}
        />
      </ChartComponent>
    </ResponsiveContainer>
  );
}
