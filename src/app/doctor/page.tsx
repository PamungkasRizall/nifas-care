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
  title: "Dashboard Dokter — Nifas Care",
  robots: { index: false, follow: false },
};

async function getDoctorDashboardStats(doctorId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const epdsManifest = getAssessmentManifest("EPDS");

  // 1. Total pending reviews (UNDER_REVIEW)
  const pendingAssessments = await prisma.assessment.findMany({
    where: {
      status: "UNDER_REVIEW",
      type: "EPDS",
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

  let highPriorityCount = 0;
  let urgentPriorityCount = 0;

  const priorityRows = await Promise.all(
    pendingAssessments.map(async (a) => {
      const answers: Record<string, string | number> = {};
      if (a.answers && typeof a.answers === "object") {
        const rawAnswers = a.answers as Record<string, unknown>;
        Object.keys(rawAnswers).forEach((key) => {
          const val = rawAnswers[key];
          if (typeof val === "string" || typeof val === "number") {
            answers[key] = val;
          }
        });
      }

      const score = await epdsManifest.calculateScore(answers);
      const interpretationResult = await epdsManifest.interpretScore(score, answers);
      const priority = interpretationResult.riskStatus;

      if (priority === "URGENT") {
        urgentPriorityCount++;
      } else if (priority === "HIGH") {
        highPriorityCount++;
      }

      return {
        id: a.id,
        name: a.mother.motherProfile?.fullName || a.mother.name || "Ibu",
        score,
        priority,
        date: a.submittedAt || a.createdAt,
      };
    })
  );

  // Sort priority queue: URGENT > HIGH > LOW, then oldest date first
  const pWeight = { URGENT: 3, HIGH: 2, LOW: 1 };
  priorityRows.sort((a, b) => {
    const wA = pWeight[a.priority as keyof typeof pWeight] || 0;
    const wB = pWeight[b.priority as keyof typeof pWeight] || 0;
    if (wB !== wA) return wB - wA;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // 2. Reviews completed by current doctor today
  const reviewedToday = await prisma.assessmentReview.count({
    where: {
      reviewerId: doctorId,
      reviewerRole: "DOCTOR",
      createdAt: { gte: today },
    },
  });

  // 3. Weekly EPDS Score Trend (average score) and Review Trend (count) (last 4 weeks)
  const epdsScoreTrend = [];
  const reviewCountTrend = [];
  const now = new Date();

  for (let i = 3; i >= 0; i--) {
    const start = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
    const end = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);

    // Review counts
    const revCount = await prisma.assessmentReview.count({
      where: {
        reviewerId: doctorId,
        reviewerRole: "DOCTOR",
        createdAt: { gte: start, lte: end },
      },
    });
    reviewCountTrend.push({ label: `Mgg ${4 - i}`, value: revCount });

    // Average EPDS scores
    const weeklyEpds = await prisma.assessment.findMany({
      where: {
        type: "EPDS",
        status: "COMPLETED",
        completedAt: { gte: start, lte: end },
      },
      select: { answers: true },
    });

    let sum = 0;
    let count = 0;
    for (const ass of weeklyEpds) {
      const answers = (ass.answers as any) || {};
      const score = await epdsManifest.calculateScore(answers);
      sum += score;
      count++;
    }
    const avg = count > 0 ? Math.round(sum / count) : 0;
    epdsScoreTrend.push({ label: `Mgg ${4 - i}`, value: avg });
  }

  // 4. EPDS Results Distribution (Normal, Risiko Depresi, Probable Depression)
  const completedEpdsAssessments = await prisma.assessment.findMany({
    where: { type: "EPDS", status: "COMPLETED" },
    select: { answers: true },
  });

  let normalCount = 0;
  let riskCount = 0;
  let depressionCount = 0;

  for (const ass of completedEpdsAssessments) {
    const answers = (ass.answers as any) || {};
    const score = await epdsManifest.calculateScore(answers);
    if (score >= 13) {
      depressionCount++;
    } else if (score >= 10) {
      riskCount++;
    } else {
      normalCount++;
    }
  }

  // 5. Interventions distribution count
  const allDoctorReviews = await prisma.assessmentReview.findMany({
    where: { reviewerId: doctorId, reviewerRole: "DOCTOR" },
    include: { interventions: true },
  });

  let education = 0;
  let counseling = 0;
  let psychotherapy = 0;
  let referral = 0;
  let homevisit = 0;

  allDoctorReviews.forEach((r) => {
    r.interventions.forEach((int) => {
      if (int.type === "EDUCATION") education++;
      else if (int.type === "COUNSELING") counseling++;
      else if (int.type === "PSYCHOTHERAPY") psychotherapy++;
      else if (int.type === "REFERRAL") referral++;
      else if (int.type === "HOME_VISIT") homevisit++;
    });
  });

  const interventionsData = [
    { label: "Edukasi", value: education },
    { label: "Konseling", value: counseling },
    { label: "Psikoterapi", value: psychotherapy },
    { label: "Rujukan", value: referral },
    { label: "Kunjungan Rumah", value: homevisit },
  ];

  // 6. Recent reviews by current doctor
  const recentReviews = await prisma.assessmentReview.findMany({
    where: { reviewerId: doctorId, reviewerRole: "DOCTOR" },
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
    title: `Review EPDS Selesai`,
    description: `Memberikan evaluasi klinis Ibu ${
      rev.assessment.mother.motherProfile?.fullName || rev.assessment.mother.name || "Ibu"
    } - Hasil: ${rev.status === "APPROVED" ? "Disetujui" : "Perlu Tindak Lanjut"}`,
    timestamp: rev.createdAt,
    status: rev.status === "APPROVED" ? ("success" as const) : ("warning" as const),
  }));

  return {
    pendingCount: pendingAssessments.length,
    reviewedToday,
    highPriorityCount,
    urgentPriorityCount,
    epdsScoreTrend,
    reviewCountTrend,
    activities,
    priorityRows: priorityRows.slice(0, 5),
    epdsDistribution: [
      { label: "Normal (LOW)", value: normalCount, color: "var(--primary)" },
      { label: "Risiko (HIGH)", value: riskCount, color: "#e8a85a" },
      { label: "Depresi (URGENT)", value: depressionCount, color: "#b15c67" },
    ],
    interventionsData,
  };
}

export default async function DoctorDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "DOCTOR" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  const stats = await getDoctorDashboardStats(session.user.id);

  const cards = [
    {
      id: "stat-pending",
      label: "Menunggu Review",
      value: stats.pendingCount,
      description: "EPDS yang memerlukan keputusan medis",
      href: "/doctor/review",
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
      description: "Respons yang Anda review hari ini",
      href: "/doctor/review?tab=completed",
      accent: "bg-sage-50 border-sage-200 text-sage-700 dark:bg-sage-950/20 dark:border-sage-900/50",
      iconBg: "bg-sage-100 dark:bg-sage-950/50",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-sage-600">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      id: "stat-high-priority",
      label: "Prioritas HIGH",
      value: stats.highPriorityCount,
      description: "Kasus prioritas tinggi menanti review",
      href: "/doctor/review?tab=pending&priority=HIGH",
      accent: "bg-blush-50 border-blush-200 text-blush-700 dark:bg-blush-950/20 dark:border-blush-900/50",
      iconBg: "bg-blush-100 dark:bg-blush-950/50",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blush-600">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    {
      id: "stat-urgent-priority",
      label: "Prioritas URGENT",
      value: stats.urgentPriorityCount,
      description: "Kasus kritis/red-flag memerlukan atensi",
      href: "/doctor/review?tab=pending&priority=URGENT",
      accent: "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/50",
      iconBg: "bg-rose-100 dark:bg-rose-950/50",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-rose-600">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Selamat datang, dr. {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Berikut ringkasan analytics antrean peninjauan klinis kuesioner EPDS Ibu.
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
          title="Rata-rata Skor EPDS Mingguan"
          data={stats.epdsScoreTrend}
          type="line"
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
          title="Distribusi Tingkat Depresi (EPDS)"
          items={stats.epdsDistribution}
          type="donut"
        />
        <TrendChart
          title="Distribusi Intervensi Medis"
          data={stats.interventionsData}
          type="bar"
        />
      </div>

      {/* Priority Table & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PriorityTable
            title="Antrean Kasus Mendesak (Priority Queue)"
            columns={[
              { key: "name", header: "Nama Ibu" },
              { key: "score", header: "Skor EPDS", alignClass: "text-center" },
              {
                key: "priority",
                header: "Prioritas",
                render: (row) => (
                  <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    row.priority === "URGENT"
                      ? "bg-rose-50 border-rose-200 text-rose-700"
                      : row.priority === "HIGH"
                      ? "bg-amber-50 border-amber-200 text-amber-700"
                      : "bg-sage-50 border-sage-200 text-sage-700"
                  }`}>
                    {row.priority}
                  </span>
                )
              },
              {
                key: "date",
                header: "Tgl Pengisian",
                render: (row) => new Intl.DateTimeFormat("id-ID", { dateStyle: "short" }).format(new Date(row.date))
              },
              {
                key: "id",
                header: "Aksi",
                alignClass: "text-center",
                render: (row) => (
                  <Link
                    href={`/doctor/review/${row.id}`}
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
