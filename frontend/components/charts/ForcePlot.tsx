'use client';

interface ForceFeature {
  name: string;
  value: number;
  shapValue: number;
  impactDirection: 'positive' | 'negative';
}

interface ForcePlotProps {
  features: ForceFeature[];
  baseValue?: number;
  height?: number;
}

export function ForcePlot({
  features,
  baseValue = 0,
  height = 300,
}: ForcePlotProps) {
  if (!features || features.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-gray-800/60 bg-surface/50"
        style={{ height }}
      >
        <p className="text-sm text-text-secondary">No data available</p>
      </div>
    );
  }

  const maxAbsShap = Math.max(...features.map((f) => Math.abs(f.shapValue)), 0.01);
  const barHeight = Math.max(20, Math.min(40, (height - 60) / features.length));

  return (
    <div className="relative" style={{ height }}>
      <svg width="100%" height={height} className="overflow-visible">
        {features.map((feature, i) => {
          const y = i * (barHeight + 8) + 20;
          const barWidth = Math.abs((feature.shapValue / maxAbsShap) * 200);
          const isPositive = feature.shapValue >= 0;
          const color = isPositive ? '#00F5D4' : '#E94560';
          const barX = isPositive ? 220 : 220 - barWidth;

          return (
            <g key={feature.name}>
              <text
                x={210}
                y={y + barHeight / 2}
                textAnchor="end"
                dominantBaseline="middle"
                fill="#a0a0a0"
                fontSize={11}
                fontFamily="Inter, system-ui, sans-serif"
              >
                {feature.name}
              </text>
              <rect
                x={barX}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={color}
                fillOpacity={0.8}
                rx={3}
              />
              <text
                x={isPositive ? barX + barWidth + 6 : barX - 6}
                y={y + barHeight / 2}
                textAnchor={isPositive ? 'start' : 'end'}
                dominantBaseline="middle"
                fill={color}
                fontSize={10}
                fontFamily="Inter, system-ui, sans-serif"
              >
                {feature.shapValue.toFixed(3)}
              </text>
            </g>
          );
        })}
        <line
          x1={220}
          y1={0}
          x2={220}
          y2={features.length * (barHeight + 8) + 10}
          stroke="#F8FAFC"
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
        <text
          x={220}
          y={features.length * (barHeight + 8) + 22}
          textAnchor="middle"
          fill="#F8FAFC"
          fontSize={10}
          fontFamily="Inter, system-ui, sans-serif"
        >
          Base: {baseValue.toFixed(2)}
        </text>
      </svg>
    </div>
  );
}
