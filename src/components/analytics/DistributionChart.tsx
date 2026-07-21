import React from "react";

interface DistributionItem {
  label: string;
  value: number;
  color: string; // HEX color or inline style compatible color
}

interface DistributionChartProps {
  title: string;
  items: DistributionItem[];
  type?: "donut" | "pie";
}

export default function DistributionChart({
  title,
  items,
  type = "donut",
}: DistributionChartProps) {
  const total = items.reduce((acc, curr) => acc + curr.value, 0);

  // SVG parameters
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
      <h3 className="font-bold text-foreground text-sm uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>

      {total === 0 ? (
        <div className="h-[150px] flex items-center justify-center text-xs text-muted-foreground italic">
          Belum ada data untuk grafik distribusi.
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
          {/* SVG Pie/Donut Chart */}
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {items.map((item, idx) => {
                const percent = item.value / total;
                const strokeLength = percent * circumference;
                const strokeOffset = circumference - accumulatedPercent * circumference;
                accumulatedPercent += percent;

                return (
                  <circle
                    key={idx}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth={type === "donut" ? 14 : 70} // Thick stroke for donut, massive stroke for pie
                    strokeDasharray={`${strokeLength} ${circumference}`}
                    strokeDashoffset={strokeOffset}
                    className="transition-all duration-500 hover:opacity-90 cursor-pointer"
                  />
                );
              })}
            </svg>
            {type === "donut" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold text-foreground tabular-nums">{total}</span>
                <span className="text-[9px] uppercase font-bold text-muted-foreground">Total</span>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2 w-full">
            {items.map((item, idx) => {
              const percent = total === 0 ? 0 : Math.round((item.value / total) * 100);
              return (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-foreground truncate max-w-[120px]">{item.label}</span>
                  </div>
                  <span className="text-muted-foreground font-bold tabular-nums">
                    {item.value} ({percent}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
