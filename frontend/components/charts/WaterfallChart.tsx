'use client';

interface WaterfallDataPoint {
  feature: string;
  contribution: number;
  cumulative: number;
}

interface WaterfallChartProps {
  data: WaterfallDataPoint[];
  height?: number;
}

export function WaterfallChart({
  data,
  height = 400,
}: WaterfallChartProps) {
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

  const allValues = data.map((d) => d.cumulative);
  const minVal = Math.min(...allValues, 0);
  const maxVal = Math.max(...allValues);
  const range = maxVal - minVal || 1;
  const chartWidth = 600;
  const chartHeight = Math.max(200, data.length * 36 + 60);
  const barHeight = 24;
  const leftLabelWidth = 140;
  const rightLabelWidth = 60;

  return (
    <div className="relative overflow-x-auto" style={{ height }}>
      <svg
        width="100%"
        height={chartHeight}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="overflow-visible"
      >
        {data.map((d, i) => {
          const y = i * 36 + 20 + (chartHeight - data.length * 36) / 2;
          const prevCumulative = i === 0 ? 0 : data[i - 1].cumulative;
          const startX =
            ((prevCumulative - minVal) / range) * (chartWidth - leftLabelWidth - rightLabelWidth) +
            leftLabelWidth;
          const endX =
            ((d.cumulative - minVal) / range) * (chartWidth - leftLabelWidth - rightLabelWidth) +
            leftLabelWidth;
          const isPositive = d.contribution >= 0;
          const color = isPositive ? '#00F5D4' : '#E94560';
          const barX = Math.min(startX, endX);
          const barW = Math.abs(endX - startX) || 2;

          return (
            <g key={d.feature}>
              {i > 0 && (
                <line
                  x1={startX}
                  y1={y - 10}
                  x2={startX}
                  y2={y}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth={1}
                />
              )}
              <rect x={barX} y={y} width={barW} height={barHeight} fill={color} fillOpacity={0.8} rx={3} />
              <text
                x={leftLabelWidth - 8}
                y={y + barHeight / 2}
                textAnchor="end"
                dominantBaseline="middle"
                fill="#a0a0a0"
                fontSize={11}
                fontFamily="Inter, system-ui, sans-serif"
              >
                {d.feature}
              </text>
              <text
                x={Math.max(endX, startX) + 6}
                y={y + barHeight / 2}
                textAnchor="start"
                dominantBaseline="middle"
                fill={color}
                fontSize={10}
                fontFamily="Inter, system-ui, sans-serif"
              >
                {d.contribution > 0 ? '+' : ''}
                {d.contribution.toFixed(2)}
              </text>
              <text
                x={chartWidth - rightLabelWidth + 4}
                y={y + barHeight / 2}
                textAnchor="start"
                dominantBaseline="middle"
                fill="#F8FAFC"
                fontSize={10}
                fontFamily="Inter, system-ui, sans-serif"
              >
                {d.cumulative.toFixed(2)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
