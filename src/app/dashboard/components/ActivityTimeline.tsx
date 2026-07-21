import type { ActivityTimelineItem } from "@/modules/mother/dashboard/types";

interface ActivityTimelineProps {
  activities: ActivityTimelineItem[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-xs text-muted-foreground">Belum ada riwayat aktivitas.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 border-l-2 border-border space-y-6 ml-2 py-1">
      {activities.map((activity) => {
        const statusColors = {
          success: "bg-sage-500 border-sage-200",
          pending: "bg-amber-500 border-amber-200",
          info: "bg-primary border-primary/20",
          warning: "bg-blush-500 border-blush-200",
        };

        const colorClass = statusColors[activity.status] || "bg-muted border-border";

        return (
          <div key={activity.id} className="relative">
            {/* Titik Timeline */}
            <span className={`absolute -left-[31px] top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 ${colorClass}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>

            {/* Konten Timeline */}
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-foreground truncate">{activity.title}</h4>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {new Intl.DateTimeFormat("id-ID", { dateStyle: "short" }).format(new Date(activity.date))}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{activity.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
