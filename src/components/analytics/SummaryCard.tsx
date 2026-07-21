import React from "react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  accentClass?: string;
  iconBgClass?: string;
}

export default function SummaryCard({
  title,
  value,
  description,
  icon,
  accentClass = "bg-card border-border",
  iconBgClass = "bg-muted",
}: SummaryCardProps) {
  return (
    <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-md ${accentClass}`}>
      <div className="flex items-start justify-between">
        {icon && (
          <div className={`p-2.5 rounded-xl ${iconBgClass}`}>
            {icon}
          </div>
        )}
        <span className="text-4xl font-extrabold text-foreground tabular-nums">
          {value}
        </span>
      </div>
      <div className="mt-4">
        <p className="font-bold text-base text-foreground">{title}</p>
        {description && (
          <p className="text-xs opacity-80 mt-0.5 text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
