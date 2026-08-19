'use client';

import { useCallback } from 'react';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

interface PieChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: PieChartDataPoint[];
  innerRadius?: number;
  outerRadius?: number;
  height?: number;
  donut?: boolean;
}

const DEFAULT_COLORS = ['#00F5D4', '#5B5FEE', '#E94560', '#FFD700', '#FF6B6B', '#4ECDC4', '#A78BFA', '#F97316'];

export function PieChart({
  data,
  innerRadius = 60,
  outerRadius = 100,
  height = 300,
  donut = true,
}: PieChartProps) {
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

  const renderLabel = useCallback(
    ({ name, percent }: { name: string; percent: number }) =>
      `${name} ${(percent * 100).toFixed(0)}%`,
    []
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={donut ? innerRadius : 0}
          outerRadius={outerRadius}
          dataKey="value"
          nameKey="name"
          label={renderLabel}
          labelLine={{ stroke: 'rgba(255,255,255,0.2)' }}
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
            />
          ))}
        </Pie>
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
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#a0a0a0' }}
          iconType="circle"
          iconSize={8}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
