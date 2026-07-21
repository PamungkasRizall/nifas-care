import type { Assignment, AssignmentStatus } from "@prisma/client";

export type { Assignment, AssignmentStatus };

export interface DashboardData {
  greeting: string;
  daysPostpartum: number;
  progressPercent: number;
  totalAssignments: number;
  completedAssignments: number;
  assignments: Assignment[];
  activities: ActivityTimelineItem[];
  recentNotes: HealthNote[];

  // Analytics extensions
  latestEpdsScore: number | null;
  todayMagnesium: number;
  nextAssessmentSchedule: string | null;
  epdsTrend: Array<{ label: string; value: number }>;
  magnesiumTrend: Array<{ label: string; value: number }>;
  progressStats: Array<{ label: string; value: number; color: string }>;
  priorityAssessments: Array<{ id: string; title: string; priority: string; dueDate: Date }>;

  // Mood extensions
  todayMood: { score: number; emoji: string; label: string; note: string | null } | null;
  moodStreak: number;
  moodAverageThisWeek: number;
  moodTrend: Array<{ label: string; value: number }>;
  moodDistribution: Array<{ label: string; value: number; color: string }>;
}

export interface ActivityTimelineItem {
  id: string;
  title: string;
  description: string;
  date: Date;
  status: "success" | "pending" | "info" | "warning";
}

export interface HealthNote {
  id: string;
  authorName: string;
  authorRole: string;
  note: string;
  date: Date;
}
