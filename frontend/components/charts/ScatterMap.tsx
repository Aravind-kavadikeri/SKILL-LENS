'use client';

import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ZAxis,
} from 'recharts';

interface ScatterMapDataPoint {
  name: string;
  lat: number;
  lon: number;
  value: number;
  size?: number;
}

interface ScatterMapProps {
  data: ScatterMapDataPoint[];
  height?: number;
}

const MAP_COLORS = ['#00F5D4', '#5B5FEE', '#E94560', '#FFD700', '#FF6B6B', '#4ECDC4', '#A78BFA'];

export function ScatterMap({ data, height = 400 }: ScatterMapProps) {
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

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="lon"
          type="number"
          tick={{ fill: '#a0a0a0', fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          domain={[-180, 180]}
          tickFormatter={() => ''}
        />
        <YAxis
          dataKey="lat"
          type="number"
          tick={{ fill: '#a0a0a0', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          domain={[-90, 90]}
          tickFormatter={() => ''}
        />
        <ZAxis dataKey="size" range={[40, 400]} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a1a2e',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.37)',
          }}
          labelStyle={{ color: '#F8FAFC', fontWeight: 600 }}
          formatter={(value: number, name: string) => {
            if (name === 'value') return [value, 'Value'];
            return [value, name];
          }}
          labelFormatter={(label: string) => label}
        />
        <Scatter data={data} dataKey="value">
          {data.map((_, index) => (
            <Cell key={index} fill={MAP_COLORS[index % MAP_COLORS.length]} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
