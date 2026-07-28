import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAssessmentManifest } from "@/modules/assessment/registry";

// Reusable analytics components
import SummaryCard from "@/components/analytics/SummaryCard";
import TrendChart from "@/components/analytics/TrendChart";
import DistributionChart from "@/components/analytics/DistributionChart";
import PriorityTable from "@/components/analytics/PriorityTable";
import RecentActivity from "@/components/analytics/RecentActivity";

export const metadata: Metadata = {
  title: "Dashboard Ahli Gizi — Nifas Care",
  robots: { index: false, follow: false },
};

async function getNutritionistDashboardStats(nutritionistId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const magnesiumManifest = getAssessmentManifest("MAGNESIUM");

  // Get active target
  let magnesiumTarget = 320;
  const targetObj = await prisma.magnesiumTarget.findFirst({
    where: { isActive: true },
  });
  if (targetObj) {
    magnesiumTarget = targetObj.target;
  }

  // 1. Total pending reviews (UNDER_REVIEW)
  const pendingAssessments = await prisma.assessment.findMany({
    where: {
      status: "UNDER_REVIEW",
      type: "MAGNESIUM",
    },
    include: {
      mother: {
        select: {
          name: true,
          motherProfile: {
            select: { fullName: true },
          },
        },
      },
    },
  });

  let lowIntakeCount = 0;
  let normalIntakeCount = 0;

  const priorityRows = await Promise.all(
    pendingAssessments.map(async (a) => {
      const answers = (a.answers as any) || {};
      const score = await magnesiumManifest.calculateScore(answers);

      let status: "Sangat Kurang" | "Kurang" | "Cukup" | "Tinggi" = "Kurang";
      if (score < magnesiumTarget * 0.5) {
        status = "Sangat Kurang";
        lowIntakeCount++;
      } else if (score < magnesiumTarget * 0.9) {
        status = "Kurang";
        lowIntakeCount++;
      } else if (score > magnesiumTarget * 1.2) {
        status = "Tinggi";
        normalIntakeCount++;
      } else {
        status = "Cukup";
        normalIntakeCount++;
      }

      return {
        id: a.id,
        name: a.mother.motherProfile?.fullName || a.mother.name || "Ibu",
        score,
        status,
        date: a.submittedAt || a.createdAt,
      };
    })
  );

  // Sort priority queue: Lowest score first, then newest date
  priorityRows.sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // 2. Reviews completed by current nutritionist today
  const reviewedToday = await prisma.assessmentReview.count({
    where: {
      reviewerId: nutritionistId,
      reviewerRole: "NUTRITIONIST",
      createdAt: { gte: today },
    },
  });

  // 3. Weekly Magnesium Intake Trend (average score) and Review Trend (count) (last 4 weeks)
  const magnesiumTrend = [];
  const reviewCountTrend = [];
  const now = new Date();

  for (let i = 3; i >= 0; i--) {
    const start = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
    const end = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);

    // Reviews count
    const revCount = await prisma.assessmentReview.count({
      where: {
        reviewerId: nutritionistId,
        reviewerRole: "NUTRITIONIST",
        createdAt: { gte: start, lte: end },
      },
    });
    reviewCountTrend.push({ label: `Mgg ${4 - i}`, value: revCount });

    // Average Magnesium intake
    const weeklyMag = await prisma.assessment.findMany({
      where: {
        type: "MAGNESIUM",
        status: "COMPLETED",
        completedAt: { gte: start, lte: end },
      },
      select: { answers: true },
    });

    let sum = 0;
    let count = 0;
    for (const ass of weeklyMag) {
      const answers = (ass.answers as any) || {};
      const score = await magnesiumManifest.calculateScore(answers);
      sum += score;
      count++;
    }
    const avg = count > 0 ? Math.round(sum / count) : 0;
    magnesiumTrend.push({ label: `Mgg ${4 - i}`, value: avg });
  }

  // 4. Magnesium Status Distribution (Sangat Kurang, Kurang, Cukup, Tinggi) from all completed MAGNESIUM assessments
  const completedAssessments = await prisma.assessment.findMany({
    where: { type: "MAGNESIUM", status: "COMPLETED" },
    select: { answers: true },
  });

  let sgKurangCount = 0;
  let kurangCount = 0;
  let cukupCount = 0;
  let tinggiCount = 0;

  for (const ass of completedAssessments) {
    const answers = (ass.answers as any) || {};
    const score = await magnesiumManifest.calculateScore(answers);
    if (score < magnesiumTarget * 0.5) {
      sgKurangCount++;
    } else if (score < magnesiumTarget * 0.9) {
      kurangCount++;
    } else if (score > magnesiumTarget * 1.2) {
      tinggiCount++;
    } else {
      cukupCount++;
    }
  }

  // 5. Top Food Items consumed
  const foodOccurrences: Record<string, number> = {};
  for (const ass of completedAssessments) {
    const answers = (ass.answers as any) || {};
    if (answers && Array.isArray(answers.items)) {
      answers.items.forEach((item: any) => {
        if (item.foodId) {
          foodOccurrences[item.foodId] = (foodOccurrences[item.foodId] || 0) + (item.qty || 1);
        }
      });
    }
  }

  // Fetch foods to map names
  const topFoods = Object.entries(foodOccurrences)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topFoodsTrend = await Promise.all(
    topFoods.map(async ([foodId, qty]) => {
      const food = await prisma.food.findUnique({
        where: { id: foodId },
        select: { name: true },
      });
      return {
        label: food?.name || foodId,
        value: qty,
      };
    })
  );

  // 6. Recent reviews by current nutritionist
  const recentReviews = await prisma.assessmentReview.findMany({
    where: { reviewerId: nutritionistId, reviewerRole: "NUTRITIONIST" },
    include: {
      assessment: {
        select: {
          mother: {
            select: {
              name: true,
              motherProfile: { select: { fullName: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const activities = recentReviews.map((rev) => ({
    id: rev.id,
    title: `Review Magnesium Selesai`,
    description: `Memberikan rekomendasi gizi Ibu ${
      rev.assessment.mother.motherProfile?.fullName || rev.assessment.mother.name || "Ibu"
    } - Status: ${rev.status === "APPROVED" ? "Disetujui" : "Perlu Tindak Lanjut"}`,
    timestamp: rev.createdAt,
    status: rev.status === "APPROVED" ? ("success" as const) : ("warning" as const),
  }));

  // 7. Total nutritionist reviews in total
  const totalReviewed = await prisma.assessmentReview.count({
    where: {
      reviewerId: nutritionistId,
      reviewerRole: "NUTRITIONIST",
    },
  });

  return {
    pendingCount: pendingAssessments.length,
    reviewedToday,
    lowIntakeCount,
    normalIntakeCount,
    magnesiumTrend,
    reviewCountTrend,
    activities,
    totalReviewed,
    priorityRows: priorityRows.slice(0, 5),
    magnesiumDistribution: [
      { label: "Sangat Kurang", value: sgKurangCount, color: "#b15c67" },
      { label: "Kurang", value: kurangCount, color: "#e8a85a" },
      { label: "Cukup", value: cukupCount, color: "var(--primary)" },
      { label: "Tinggi", value: tinggiCount, color: "#8aab74" },
    ],
    topFoodsTrend,
  };
}

export default async function NutritionistDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "NUTRITIONIST" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  const stats = await getNutritionistDashboardStats(session.user.id);

  const cards = [
    {
      id: "stat-pending",
      label: "Menunggu Review",
      value: stats.pendingCount,
      description: "Pencatatan magnesium menanti evaluasi",
      href: "/nutritionist/review",
      accent: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/50",
      iconBg: "bg-amber-100 dark:bg-amber-950/50",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-amber-600">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      id: "stat-reviewed-today",
      label: "Review Hari Ini",
      value: stats.reviewedToday,
      description: "Asupan Magnesium direview hari ini",
      href: "/nutritionist/review?tab=completed",
      accent: "bg-sage-50 border-sage-200 text-sage-700 dark:bg-sage-950/20 dark:border-sage-900/50",
      iconBg: "bg-sage-100 dark:bg-sage-950/50",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-sage-600">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      id: "stat-low-intake",
      label: "Asupan Kurang",
      value: stats.lowIntakeCount,
      description: "Ibu dengan asupan di bawah target harian",
      href: "/nutritionist/review?tab=pending&status=KURANG",
      accent: "bg-blush-50 border-blush-200 text-blush-700 dark:bg-blush-950/20 dark:border-blush-900/50",
      iconBg: "bg-blush-100 dark:bg-blush-950/50",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-blush-600">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      id: "stat-normal-intake",
      label: "Asupan Cukup",
      value: stats.normalIntakeCount,
      description: "Ibu dengan asupan memenuhi/melebihi target",
      href: "/nutritionist/review?tab=pending&status=CUKUP",
      accent: "bg-primary/10 border-primary/20 text-primary-foreground",
      iconBg: "bg-primary/20",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Selamat datang, {session?.user?.name?.split(" ")[0] ?? "Ahli Gizi"} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Berikut ringkasan analytics antrean peninjauan nutrisi dan asupan magnesium Ibu.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <SummaryCard
            key={card.id}
            title={card.label}
            value={card.value}
            description={card.description}
            icon={card.icon}
            accentClass={card.accent}
            iconBgClass={card.iconBg}
          />
        ))}
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TrendChart
          title="Rata-rata Asupan Magnesium Harian"
          data={stats.magnesiumTrend}
          type="line"
          targetLine={320}
          yAxisSuffix=" mg"
        />
        <TrendChart
          title="Tren Jumlah Review Mingguan Anda"
          data={stats.reviewCountTrend}
          type="bar"
        />
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DistributionChart
          title="Distribusi Status Magnesium"
          items={stats.magnesiumDistribution}
          type="donut"
        />
        <TrendChart
          title="Top 5 Makanan Paling Sering Dikonsumsi"
          data={stats.topFoodsTrend}
          type="bar"
        />
      </div>

      {/* Priority Table & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PriorityTable
            title="Antrean Asupan Terendah (Priority Queue)"
            columns={[
              { key: "name", header: "Nama Ibu" },
              {
                key: "score",
                header: "Total Magnesium",
                render: (row) => `${row.score} mg`,
                alignClass: "text-center"
              },
              {
                key: "status",
                header: "Status Asupan",
                render: (row) => (
                  <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    row.status === "Sangat Kurang"
                      ? "bg-rose-50 border-rose-200 text-rose-700"
                      : row.status === "Kurang"
                      ? "bg-amber-50 border-amber-200 text-amber-700"
                      : "bg-sage-50 border-sage-200 text-sage-700"
                  }`}>
                    {row.status}
                  </span>
                )
              },
              {
                key: "date",
                header: "Tgl Pencatatan",
                render: (row) => new Intl.DateTimeFormat("id-ID", { dateStyle: "short" }).format(new Date(row.date))
              },
              {
                key: "id",
                header: "Aksi",
                alignClass: "text-center",
                render: (row) => (
                  <Link
                    href={`/nutritionist/review/${row.id}`}
                    className="bg-primary text-primary-foreground font-semibold px-3 py-1 rounded-lg text-[10px] hover:opacity-90 transition"
                  >
                    Review
                  </Link>
                )
              }
            ]}
            rows={stats.priorityRows}
          />
        </div>

        <div>
          <RecentActivity
            title="Aktivitas Review Terbaru"
            activities={stats.activities}
          />
        </div>
      </div>
    </div>
  );
}
