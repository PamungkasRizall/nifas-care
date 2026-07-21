import React from "react";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: Date | string;
  status?: "success" | "pending" | "info" | "warning";
}

interface RecentActivityProps {
  title: string;
  activities: ActivityItem[];
  emptyMessage?: string;
}

export default function RecentActivity({
  title,
  activities,
  emptyMessage = "Belum ada aktivitas tercatat.",
}: RecentActivityProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "success":
        return "bg-sage-500 border-sage-200";
      case "warning":
        return "bg-amber-500 border-amber-200";
      case "danger":
      case "warning-high":
        return "bg-blush-500 border-blush-200";
      case "info":
      default:
        return "bg-primary border-primary/20";
    }
  };

  const formatTime = (time: Date | string) => {
    const d = new Date(time);
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(d);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
      <h3 className="font-bold text-foreground text-sm uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>

      {activities.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground italic">
          {emptyMessage}
        </div>
      ) : (
        <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
          {activities.map((act) => (
            <div key={act.id} className="relative space-y-1">
              {/* Bullet point indicator */}
              <span
                className={`absolute -left-[22px] top-1 w-2.5 h-2.5 rounded-full border-2 border-card ${getStatusColor(
                  act.status
                )}`}
              />
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-bold text-foreground leading-none">{act.title}</p>
                <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                  {formatTime(act.timestamp)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{act.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
