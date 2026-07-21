import type { Assignment } from "@/modules/mother/dashboard/types";
import Link from "next/link";

interface AssignmentCardProps {
  assignment: Assignment;
}

export default function AssignmentCard({ assignment }: AssignmentCardProps) {
  const isEpds = assignment.type === "EPDS";
  const isOverdue =
    assignment.status === "OVERDUE" ||
    (assignment.status !== "COMPLETED" &&
      new Date(assignment.dueDate) < new Date());

  const statusLabel = isOverdue
    ? "Terlambat"
    : assignment.status === "IN_PROGRESS"
      ? "Sedang Dikerjakan"
      : "Belum Dimulai";
  const statusColor = isOverdue
    ? "bg-blush-50 border-blush-200 text-blush-700"
    : assignment.status === "IN_PROGRESS"
      ? "bg-amber-50 border-amber-200 text-amber-700"
      : "bg-muted border-border text-muted-foreground";

  const formattedDueDate = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(new Date(assignment.dueDate));

  return (
    <div
      className={`border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all duration-300 ${
        isEpds
          ? "bg-card border-blush-200 border-l-4 border-l-blush-500 dark:bg-blush-950/10 dark:border-blush-900/50 dark:border-l-blush-600"
          : "bg-card border-border"
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h3 className="font-semibold text-foreground text-base">
            {assignment.title}
          </h3>
          {isEpds && (
            <span className="inline-flex items-center gap-1 bg-blush-100 border border-blush-200 text-blush-800 dark:bg-blush-950/60 dark:border-blush-800/50 dark:text-blush-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Penting & Wajib
            </span>
          )}
          <span
            className={`inline-flex items-center border text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor}`}
          >
            {statusLabel}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
          <div>
            <span className="font-medium text-foreground">Jadwal:</span>{" "}
            {new Intl.DateTimeFormat("id-ID", { dateStyle: "short" }).format(
              new Date(assignment.scheduledAt),
            )}
          </div>
          <div>
            <span className="font-medium text-foreground">Batas Waktu:</span>{" "}
            {formattedDueDate}
          </div>
        </div>
      </div>
      <Link
        id={`btn-start-${assignment.id}`}
        href={`/dashboard/assessment/fill/${assignment.id}`}
        className={`${
          isEpds
            ? "bg-blush-600 hover:bg-blush-700 text-white shadow-sm"
            : "bg-primary text-primary-foreground hover:opacity-90"
        } font-semibold px-5 py-2.5 rounded-xl transition text-sm text-center shrink-0`}
      >
        Mulai
      </Link>
    </div>
  );
}
