import { auth } from "@/lib/auth/auth";
import { getDashboardData } from "@/modules/mother/dashboard/services";
import Link from "next/link";
import { redirect } from "next/navigation";
import AssignmentCard from "./components/AssignmentCard";
import ReviewNotes from "./components/ReviewNotes";
import MoodWidget from "./components/MoodWidget";

// Reusable analytics components
import SummaryCard from "@/components/analytics/SummaryCard";
import TrendChart from "@/components/analytics/TrendChart";
import DistributionChart from "@/components/analytics/DistributionChart";
import RecentActivity from "@/components/analytics/RecentActivity";

export default async function MotherDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const data = await getDashboardData(session.user.id);

  // Filter tugas aktif (PENDING / IN_PROGRESS / OVERDUE)
  const activeAssignments = data.assignments.filter(
    (a) => a.status === "PENDING" || a.status === "IN_PROGRESS" || a.status === "OVERDUE"
  );

  const summaryCards = [
    {
      title: "Progress Pemantauan",
      value: `${data.progressPercent}%`,
      description: `${data.completedAssignments} dari ${data.totalAssignments} tugas selesai`,
      iconBgClass: "bg-primary/10",
      accentClass: "bg-sage-50/50 border-sage-200 text-sage-800",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    },
    {
      title: "Skor EPDS Terakhir",
      value: data.latestEpdsScore !== null ? data.latestEpdsScore : "—",
      description: data.latestEpdsScore !== null ? "Skrining kesehatan mental" : "Belum ada skrining",
      iconBgClass: "bg-blush-100",
      accentClass: "bg-blush-50/50 border-blush-200 text-blush-800",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blush-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    },
    {
      title: "Skor GAD-7 Terakhir",
      value: data.latestGad7Score !== null ? data.latestGad7Score : "—",
      description: data.latestGad7Score !== null ? `Interpretasi: ${data.latestGad7Interpretation || "-"}` : "Belum ada data",
      iconBgClass: "bg-purple-100",
      accentClass: "bg-purple-50/50 border-purple-200 text-purple-800",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-purple-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        </svg>
      )
    },
    {
      title: "Magnesium Hari Ini",
      value: `${data.todayMagnesium} mg`,
      description: "Asupan dari log makanan harian",
      iconBgClass: "bg-amber-100",
      accentClass: "bg-amber-50/50 border-amber-200 text-amber-800",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-amber-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
        </svg>
      )
    },
    {
      title: "Jadwal Terdekat",
      value: activeAssignments.length > 0 ? "Tugas" : "Selesai",
      description: data.nextAssessmentSchedule || "Semua tugas selesai!",
      iconBgClass: "bg-sky-100",
      accentClass: "bg-sky-50/50 border-sky-200 text-sky-800",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-sky-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    }
  ];

  // Map timeline activities to activity items for RecentActivity component
  const mappedActivities = data.activities.map((a) => {
    let status: "success" | "pending" | "info" | "warning" = "info";
    if (a.status === "success") status = "success";
    else if (a.status === "warning") status = "warning";
    else if (a.status === "pending") status = "pending";

    return {
      id: a.id,
      title: a.title,
      description: a.description,
      timestamp: a.date,
      status,
    };
  });

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Sapaan & Hari Nifas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-sage-50 to-sage-100/50 border border-sage-200/50 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {data.greeting} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Semoga Ibu dan bayi selalu dalam keadaan sehat.
          </p>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-2xl px-5 py-3 text-center shrink-0">
          <span className="block text-xs font-semibold text-primary uppercase tracking-wider">Masa Nifas</span>
          <span className="block text-2xl font-bold text-primary mt-0.5">Hari ke-{data.daysPostpartum}</span>
        </div>
      </div>

      {/* Mood Tracker Widget */}
      <MoodWidget
        initialMood={data.todayMood}
        streak={data.moodStreak}
        averageThisWeek={data.moodAverageThisWeek}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {summaryCards.map((card, idx) => (
          <SummaryCard
            key={idx}
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
            accentClass={card.accentClass}
            iconBgClass={card.iconBgClass}
          />
        ))}
      </div>

      {/* Grid Grafik & Distribusi (3 Kolom di bawah Summary Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DistributionChart
          title="Progress Program"
          items={data.progressStats}
          type="donut"
        />
        <TrendChart
          title="Perkembangan Skor EPDS"
          data={data.epdsTrend}
          type="line"
        />
        <TrendChart
          title="Asupan Magnesium Harian"
          data={data.magnesiumTrend}
          type="bar"
          targetLine={320}
          yAxisSuffix=" mg"
        />
      </div>

      {/* Grid Grafik & Distribusi Mood (2 Kolom) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TrendChart
          title="Tren Mood Harian Anda"
          data={data.moodTrend}
          type="line"
        />
        <DistributionChart
          title="Distribusi Perasaan Anda"
          items={data.moodDistribution}
          type="donut"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Tugas (Span 2) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tugas Hari Ini */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">Tugas Pemantauan Hari Ini</h2>
            {activeAssignments.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-muted-foreground">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="font-semibold text-foreground text-sm">Belum ada tugas hari ini</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Semua tugas pemantauan nifas Anda sudah selesai dikerjakan.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {activeAssignments.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Timeline & Catatan Medis (Span 1) */}
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Catatan Medis</h2>
            <ReviewNotes notes={data.recentNotes} />
          </div>
          <RecentActivity
            title="Aktivitas Terbaru"
            activities={mappedActivities}
          />
        </div>
      </div>
    </div>
  );
}
