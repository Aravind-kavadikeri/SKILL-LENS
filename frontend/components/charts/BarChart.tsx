'use client';

import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { useMemo } from 'react';

interface BarChartDataPoint {
  name?: string;
  value?: number;
  [key: string]: unknown;
}

interface BarChartProps {
  data: BarChartDataPoint[];
  xKey?: string;
  yKey?: string;
  color?: string;
  height?: number;
  layout?: 'vertical' | 'horizontal';
  rounded?: boolean;
}

export function BarChart({
  data,
  xKey = 'name',
  yKey = 'value',
  color = '#00F5D4',
  height = 300,
  layout = 'vertical',
  rounded = true,
}: BarChartProps) {
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

  const isVertical = layout === 'vertical';

  const RoundedTopBar = useMemo(() => {
    const BarShape = (props: Record<string, unknown>) => {
      const { x, y, width, height: barHeight, fill } = props as {
        x: number;
        y: number;
        width: number;
        height: number;
        fill: string;
      };
      if (!rounded) {
        return <rect x={x} y={y} width={width} height={barHeight} fill={fill} />;
      }
      const radius = Math.min(4, width / 2, barHeight / 2);
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={barHeight}
          fill={fill}
          rx={radius}
          ry={radius}
        />
      );
    };
    BarShape.displayName = 'RoundedTopBar';
    return BarShape;
  }, [rounded]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={isVertical ? 'horizontal' : 'vertical'}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        barCategoryGap="20%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
          horizontal={isVertical}
          vertical={!isVertical}
        />
        {isVertical ? (
          <>
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
          </>
        ) : (
          <>
            <XAxis type="number" tick={{ fill: '#a0a0a0', fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey={xKey}
              tick={{ fill: '#a0a0a0', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              width={100}
            />
          </>
        )}
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
        <Bar
          dataKey={yKey}
          fill={color}
          shape={<RoundedTopBar />}
          radius={rounded ? [4, 4, 0, 0] : undefined}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={color} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
