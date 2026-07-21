import React from "react";

interface DataPoint {
  label: string;
  value: number;
}

interface TrendChartProps {
  title: string;
  data: DataPoint[];
  type: "line" | "bar";
  targetLine?: number;
  yAxisSuffix?: string;
}

export default function TrendChart({
  title,
  data,
  type,
  targetLine,
  yAxisSuffix = "",
}: TrendChartProps) {
  const width = 500;
  const height = 240;
  const paddingLeft = 60;
  const paddingRight = 15;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values, targetLine || 10, 10);
  const minVal = 0;
  const yRange = maxVal - minVal;

  const getY = (val: number) => {
    const ratio = yRange === 0 ? 0.5 : (val - minVal) / yRange;
    return height - paddingBottom - ratio * chartHeight;
  };

  const getX = (index: number) => {
    if (data.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (data.length - 1)) * chartWidth;
  };

  // Generate SVG path for line chart
  let linePath = "";
  let areaPath = "";
  if (type === "line" && data.length > 0) {
    data.forEach((d, i) => {
      const x = getX(i);
      const y = getY(d.value);
      if (i === 0) {
        linePath += `M ${x} ${y}`;
        areaPath += `M ${x} ${height - paddingBottom} L ${x} ${y}`;
      } else {
        linePath += ` L ${x} ${y}`;
        areaPath += ` L ${x} ${y}`;
      }
      if (i === data.length - 1) {
        areaPath += ` L ${x} ${height - paddingBottom} Z`;
      }
    });
  }

  // Bar details
  const barWidth = data.length > 0 ? Math.min(25, (chartWidth / data.length) * 0.5) : 10;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground text-sm uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
        {targetLine && (
          <span className="text-[10px] bg-blush-50 border border-blush-200 text-blush-700 px-2 py-0.5 rounded-full font-bold">
            Target: {targetLine}
            {yAxisSuffix}
          </span>
        )}
      </div>

      {data.length === 0 ? (
        <div className="h-[180px] flex items-center justify-center text-xs text-muted-foreground italic">
          Belum ada data untuk grafik tren.
        </div>
      ) : (
        <div className="w-full">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id="trendLineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="trendBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
              const y = paddingTop + r * chartHeight;
              const gridVal = Math.round(maxVal - r * yRange);
              return (
                <g key={idx}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="var(--border)"
                    strokeWidth={1}
                    strokeDasharray="2 4"
                    className="opacity-35"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 4}
                    textAnchor="end"
                    style={{ fill: "var(--muted-foreground, #71717a)" }}
                    className="text-xs font-bold tabular-nums"
                  >
                    {gridVal}
                    {idx === 0 ? yAxisSuffix : ""}
                  </text>
                </g>
              );
            })}

            {/* Target Line */}
            {targetLine !== undefined && (
              <g>
                <line
                  x1={paddingLeft}
                  y1={getY(targetLine)}
                  x2={width - paddingRight}
                  y2={getY(targetLine)}
                  stroke="#b15c67"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  className="opacity-70"
                />
              </g>
            )}

            {/* Render Line Chart */}
            {type === "line" && (
              <>
                <path d={areaPath} fill="url(#trendLineGradient)" />
                <path
                  d={linePath}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {data.map((d, i) => (
                  <circle
                    key={i}
                    cx={getX(i)}
                    cy={getY(d.value)}
                    r={3.5}
                    className="fill-card stroke-primary stroke-[2px]"
                  />
                ))}
              </>
            )}

            {/* Render Bar Chart */}
            {type === "bar" &&
              data.map((d, i) => {
                const x = getX(i) - barWidth / 2;
                const y = getY(d.value);
                const barHeight = height - paddingBottom - y;
                return (
                  <rect
                    key={i}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={Math.max(2, barHeight)}
                    rx={3}
                    fill="url(#trendBarGradient)"
                  />
                );
              })}

            {/* X Axis Labels */}
            {data.map((d, i) => {
              const x = getX(i);
              return (
                <text
                  key={i}
                  x={x}
                  y={height - paddingBottom + 16}
                  textAnchor="middle"
                  style={{ fill: "var(--muted-foreground, #71717a)" }}
                  className="text-xs font-bold max-w-[50px] truncate"
                >
                  {d.label}
                </text>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
}
