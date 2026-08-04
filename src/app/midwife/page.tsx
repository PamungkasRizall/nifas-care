import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { getAssessmentManifest } from "@/modules/assessment/registry";

// Reusable analytics components
import SummaryCard from "@/components/analytics/SummaryCard";
import TrendChart from "@/components/analytics/TrendChart";
import DistributionChart from "@/components/analytics/DistributionChart";
import PriorityTable from "@/components/analytics/PriorityTable";
import RecentActivity from "@/components/analytics/RecentActivity";

export const metadata: Metadata = {
  title: "Dashboard Bidan — Nifas Care",
  robots: { index: false, follow: false },
};

async function getMidwifeDashboardStats(midwifeId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Load manifests
  const epdsManifest = getAssessmentManifest("EPDS");
  const magnesiumManifest = getAssessmentManifest("MAGNESIUM");
  const gad7Manifest = getAssessmentManifest("GAD7");

  // Get active target
  let magnesiumTarget = 320;
  const targetObj = await prisma.magnesiumTarget.findFirst({
    where: { isActive: true },
  });
  if (targetObj) {
    magnesiumTarget = targetObj.target;
  }

  // 1. Fetch pending reviews (SUBMITTED)
  const pendingAssessments = await prisma.assessment.findMany({
    where: { status: "SUBMITTED" },
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
  let epdsLow = 0;
  let epdsHigh = 0;
  let epdsUrgent = 0;
  let mgSangatKurang = 0;
  let mgKurang = 0;
  let mgCukup = 0;
  let mgTinggi = 0;

  const priorityRows = await Promise.all(
    pendingAssessments.map(async (a) => {
      const answers = (a.answers as any) || {};
      let score = 0;
      let priority = "LOW";

      if (a.type === "EPDS") {
        score = await epdsManifest.calculateScore(answers);
        const interp = await epdsManifest.interpretScore(score, answers);
        priority = interp.riskStatus;

        if (priority === "URGENT") {
          urgentPriorityCount++;
          epdsUrgent++;
        } else if (priority === "HIGH") {
          highPriorityCount++;
          epdsHigh++;
        } else {
          epdsLow++;
        }
      } else if (a.type === "MAGNESIUM") {
        score = await magnesiumManifest.calculateScore(answers);
        if (score < magnesiumTarget * 0.5) {
          priority = "HIGH";
          mgSangatKurang++;
          highPriorityCount++;
        } else if (score < magnesiumTarget) {
          priority = "LOW";
          mgKurang++;
        } else if (score >= magnesiumTarget * 1.5) {
          priority = "LOW";
          mgTinggi++;
        } else {
          priority = "LOW";
          mgCukup++;
        }
      } else if (a.type === "GAD7") {
        score = await gad7Manifest.calculateScore(answers);
        const interp = await gad7Manifest.interpretScore(score, answers);
        priority = interp.riskStatus;

        if (priority === "URGENT") {
          urgentPriorityCount++;
        } else if (priority === "HIGH") {
          highPriorityCount++;
        }
      }

      return {
        id: a.id,
        name: a.mother.motherProfile?.fullName || a.mother.name || "Ibu",
        type: a.type,
        score: `${score} ${a.type === "MAGNESIUM" ? "mg" : ""}`,
        priority,
        date: a.submittedAt || a.createdAt,
      };
    })
  );

  // Sort: URGENT > HIGH > LOW, then oldest date first
  const pWeight = { URGENT: 3, HIGH: 2, LOW: 1 };
  priorityRows.sort((a, b) => {
    const wA = pWeight[a.priority as keyof typeof pWeight] || 0;
    const wB = pWeight[b.priority as keyof typeof pWeight] || 0;
    if (wB !== wA) return wB - wA;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // 2. Reviews completed by current midwife today
  const reviewedToday = await prisma.assessmentReview.count({
    where: {
      reviewerId: midwifeId,
      reviewerRole: "MIDWIFE",
      createdAt: { gte: today },
    },
  });

  // 3. Weekly submission trends (last 4 weeks)
  const getSubmissionsTrend = async (type: "EPDS" | "MAGNESIUM") => {
    const trend = [];
    const now = new Date();
    for (let i = 3; i >= 0; i--) {
      const start = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const end = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const count = await prisma.assessment.count({
        where: {
          type,
          submittedAt: { gte: start, lte: end },
        },
      });
      trend.push({ label: `Mgg ${4 - i}`, value: count });
    }
    return trend;
  };
  const epdsTrend = await getSubmissionsTrend("EPDS");
  const magnesiumTrend = await getSubmissionsTrend("MAGNESIUM");

  // 4. Onboarding verifications pending
  const pendingMothersCount = await prisma.user.count({
    where: {
      role: "MOTHER",
      status: "PENDING_MIDWIFE_REVIEW",
    },
  });

  // 5. Recent reviews by current midwife
  const recentReviews = await prisma.assessmentReview.findMany({
    where: { reviewerId: midwifeId, reviewerRole: "MIDWIFE" },
    include: {
      assessment: {
        select: {
          type: true,
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
    title: `Review ${rev.assessment.type} Selesai`,
    description: `Meninjau assessment Ibu ${
      rev.assessment.mother.motherProfile?.fullName || rev.assessment.mother.name || "Ibu"
    } - Status: ${rev.status === "APPROVED" ? "Disetujui" : "Perlu Perbaikan"}`,
    timestamp: rev.createdAt,
    status: rev.status === "APPROVED" ? ("success" as const) : ("warning" as const),
  }));

  return {
    pendingCount: pendingAssessments.length,
    reviewedToday,
    highPriorityCount,
    urgentPriorityCount,
    pendingMothersCount,
    epdsTrend,
    magnesiumTrend,
    activities,
    priorityRows: priorityRows.slice(0, 5),
    epdsDistribution: [
      { label: "Normal (LOW)", value: epdsLow, color: "var(--primary)" },
      { label: "Risiko (HIGH)", value: epdsHigh, color: "#e8a85a" },
      { label: "Depresi (URGENT)", value: epdsUrgent, color: "#b15c67" },
    ],
    magnesiumDistribution: [
      { label: "Sangat Kurang", value: mgSangatKurang, color: "#b15c67" },
      { label: "Kurang", value: mgKurang, color: "#e8a85a" },
      { label: "Cukup", value: mgCukup, color: "var(--primary)" },
      { label: "Tinggi", value: mgTinggi, color: "#8aab74" },
    ],
  };
}

export default async function MidwifeDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  if (session.user.role !== "MIDWIFE" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  const stats = await getMidwifeDashboardStats(session.user.id);

  const cards = [
    {
      id: "stat-pending",
      label: "Menunggu Review",
      value: stats.pendingCount,
      description: "Assessment masuk antrean review",
      href: "/midwife/review",
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
      description: "Respons yang telah Anda review hari ini",
      href: "/midwife/review?tab=completed",
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
      label: "Priority HIGH",
      value: stats.highPriorityCount,
      description: "Kasus prioritas tinggi menunggu tinjauan",
      href: "/midwife/review?tab=pending",
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
      label: "Priority URGENT",
      value: stats.urgentPriorityCount,
      description: "Kasus darurat klinis/red-flag",
      href: "/midwife/review?tab=pending",
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Selamat datang, {session?.user?.name?.split(" ")[0] ?? "Bidan"} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Berikut ringkasan analytics dan prioritas antrean peninjauan Ibu Nifas.
          </p>
        </div>
        <div className="shrink-0">
          <a
            href="/api/export"
            download
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl transition shadow-sm text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Unduh Laporan (Excel)
          </a>
        </div>
      </div>

      {/* Summary Cards */}
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

      {/* Quick Action Verifikasi Ibu Baru */}
      {stats.pendingMothersCount > 0 && (
        <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-semibold text-sky-900">
              Ada {stats.pendingMothersCount} Ibu baru menunggu verifikasi data profil
            </p>
            <p className="text-sm text-sky-700 mt-0.5">
              Tinjau data diri dan informasi kehamilan mereka untuk mengaktifkan jadwal pemantauan.
            </p>
          </div>
          <Link
            id="btn-go-to-verify-mothers"
            href="/midwife/verifikasi"
            className="bg-sky-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-sky-700 transition whitespace-nowrap text-sm"
          >
            Verifikasi Sekarang →
          </Link>
        </div>
      )}

      {/* Trend & Distribution Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TrendChart
          title="Tren Pengisian EPDS (Mingguan)"
          data={stats.epdsTrend}
          type="line"
        />
        <TrendChart
          title="Tren Pengisian Magnesium (Mingguan)"
          data={stats.magnesiumTrend}
          type="line"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DistributionChart
          title="Distribusi Prioritas EPDS"
          items={stats.epdsDistribution}
          type="donut"
        />
        <DistributionChart
          title="Distribusi Status Magnesium"
          items={stats.magnesiumDistribution}
          type="donut"
        />
      </div>

      {/* Priority List & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PriorityTable
            title="Antrean Review Prioritas Utama"
            columns={[
              { key: "name", header: "Nama Ibu" },
              {
                key: "type",
                header: "Jenis",
                render: (row) => (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    row.type === "EPDS"
                      ? "bg-blush-50 border-blush-200 text-blush-700"
                      : row.type === "GAD7"
                      ? "bg-purple-50 border-purple-200 text-purple-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}>
                    {row.type}
                  </span>
                )
              },
              { key: "score", header: "Hasil", alignClass: "text-center" },
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
                key: "id",
                header: "Tindakan",
                alignClass: "text-center",
                render: (row) => (
                  <Link
                    href={`/midwife/review/${row.id}`}
                    className="bg-primary text-primary-foreground font-semibold px-3 py-1 rounded-lg text-[10px] hover:opacity-90 transition"
                  >
                    Tinjau
                  </Link>
                )
              }
            ]}
            rows={stats.priorityRows}
          />
        </div>

        <div>
          <RecentActivity
            title="Review Terbaru Anda"
            activities={stats.activities}
          />
        </div>
      </div>
    </div>
  );
}
