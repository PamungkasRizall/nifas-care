import { prisma } from "@/lib/prisma";
import type { DashboardData, ActivityTimelineItem, HealthNote } from "../types";
import { getAssessmentManifest } from "@/modules/assessment/registry";
import { getMotherMoodStats } from "@/modules/mood/queries";

export async function getDashboardData(motherId: string): Promise<DashboardData> {
  const mother = await prisma.user.findUnique({
    where: { id: motherId },
    include: {
      motherProfile: true,
    },
  });

  if (!mother || !mother.motherProfile) {
    throw new Error("Mother profile not found");
  }

  const profile = mother.motherProfile;

  // 1. Hitung Hari Nifas (Hari postpartum)
  let daysPostpartum = 0;
  if (profile.deliveryDate) {
    const delivery = new Date(profile.deliveryDate);
    const today = new Date();
    // Set jam ke 0 untuk menghitung selisih hari dengan presisi hari penuh
    delivery.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(today.getTime() - delivery.getTime());
    daysPostpartum = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  // 2. Sapaan berdasarkan waktu lokal saat ini
  const hours = new Date().getHours();
  let greeting = "Selamat pagi";
  if (hours >= 11 && hours < 15) {
    greeting = "Selamat siang";
  } else if (hours >= 15 && hours < 18) {
    greeting = "Selamat sore";
  } else if (hours >= 18 || hours < 4) {
    greeting = "Selamat malam";
  }

  const firstName = profile.fullName ? profile.fullName.split(" ")[0] : mother.name || "Ibu";
  greeting = `${greeting}, Ibu ${firstName}`;

  // 3. Ambil data Assignments
  const assignments = await prisma.assignment.findMany({
    where: { motherId },
    orderBy: { dueDate: "asc" },
  });

  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter((a) => a.status === "COMPLETED").length;
  const progressPercent = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

  // 4. Ambil timeline aktivitas dari Assessment + Review
  const assessments = await prisma.assessment.findMany({
    where: { motherId },
    include: {
      reviews: {
        orderBy: { createdAt: "asc" },
        include: {
          reviewer: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const activities: ActivityTimelineItem[] = [];

  // Tambahkan riwayat onboarding
  if (profile.createdAt) {
    activities.push({
      id: "onboarding-reg",
      title: "Pendaftaran Akun",
      description: "Anda telah melengkapi data onboarding nifas.",
      date: profile.createdAt,
      status: "success",
    });
  }

  // Cari verifikasi onboarding
  const verification = await prisma.onboardingVerification.findFirst({
    where: { motherUserId: motherId },
    orderBy: { createdAt: "desc" },
    include: { midwife: true },
  });

  if (verification) {
    activities.push({
      id: `onboarding-verify-${verification.id}`,
      title: verification.status === "APPROVED" ? "Onboarding Disetujui" : "Onboarding Dikembalikan",
      description: verification.status === "APPROVED"
        ? `Akun Anda diverifikasi oleh Bidan ${verification.midwife.name || "Bidan"}.`
        : `Data onboarding perlu diperbaiki: ${verification.note || ""}`,
      date: verification.createdAt,
      status: verification.status === "APPROVED" ? "success" : "warning",
    });
  }

  // Tambahkan riwayat assessment & review
  assessments.forEach((assessment) => {
    if (assessment.submittedAt) {
      activities.push({
        id: `submit-${assessment.id}`,
        title: `${assessment.type} Dikirim`,
        description: `Assessment ${assessment.type} telah berhasil dikirim.`,
        date: assessment.submittedAt,
        status: "info",
      });
    }

    assessment.reviews.forEach((review) => {
      activities.push({
        id: `review-${review.id}`,
        title: `${review.reviewerRole} Review ${assessment.type}`,
        description: `${review.status === "APPROVED" ? "Disetujui" : "Dikembalikan"}: ${review.note || ""}`,
        date: review.reviewedAt,
        status: review.status === "APPROVED" ? "success" : "warning",
      });
    });
  });

  // Urutkan timeline aktivitas dari terbaru ke terlama
  activities.sort((a, b) => b.date.getTime() - a.date.getTime());

  // 5. Ambil 3 Catatan Terbaru dari Bidan / Dokter / Ahli Gizi
  const recentNotes: HealthNote[] = [];

  // Catatan onboarding midwife
  if (profile.midwifeNotes) {
    recentNotes.push({
      id: "midwife-onboarding-note",
      authorName: "Bidan",
      authorRole: "MIDWIFE",
      note: profile.midwifeNotes,
      date: profile.updatedAt || new Date(),
    });
  }

  // Catatan review assessment
  assessments.forEach((ass) => {
    ass.reviews.forEach((rev) => {
      if (rev.note) {
        recentNotes.push({
          id: rev.id,
          authorName: rev.reviewer.name || rev.reviewerRole,
          authorRole: rev.reviewerRole,
          note: rev.note,
          date: rev.reviewedAt,
        });
      }
    });
  });

  // Urutkan catatan dari yang terbaru
  recentNotes.sort((a, b) => b.date.getTime() - a.date.getTime());

  // --- ANALYTICS EXTENSIONS ---
  const epdsManifest = getAssessmentManifest("EPDS");
  const magnesiumManifest = getAssessmentManifest("MAGNESIUM");

  // A. Latest EPDS score
  const latestEpds = assessments.find((ass) => ass.type === "EPDS" && ass.status === "COMPLETED");
  let latestEpdsScore = null;
  if (latestEpds && latestEpds.answers) {
    const answers: any = latestEpds.answers;
    const parsed: any = {};
    Object.keys(answers).forEach((k) => {
      if (typeof answers[k] === "string" || typeof answers[k] === "number") {
        parsed[k] = answers[k];
      }
    });
    latestEpdsScore = await epdsManifest.calculateScore(parsed);
  }

  // B. Today's Magnesium intake
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const todayMagnesiumAssessment = assessments.find(
    (ass) => ass.type === "MAGNESIUM" && ass.createdAt >= startOfToday && ass.createdAt <= endOfToday
  );
  let todayMagnesium = 0;
  if (todayMagnesiumAssessment && todayMagnesiumAssessment.answers) {
    todayMagnesium = await magnesiumManifest.calculateScore(todayMagnesiumAssessment.answers as any);
  }

  // C. Next assessment schedule
  const nextPendingAssignment = assignments.find((a) => a.status === "PENDING" || a.status === "IN_PROGRESS");
  let nextAssessmentSchedule = null;
  if (nextPendingAssignment) {
    const formattedDate = new Intl.DateTimeFormat("id-ID", { dateStyle: "short" }).format(
      new Date(nextPendingAssignment.dueDate)
    );
    nextAssessmentSchedule = `${nextPendingAssignment.title} (Batas Waktu: ${formattedDate})`;
  }

  // D. EPDS Score Trend (mapped to postpartum day milestones: Hari 14, Hari 18, Hari 42)
  const milestones = [
    { label: "Hari 14", targetDays: 14 },
    { label: "Hari 28", targetDays: 28 },
    { label: "Hari 42", targetDays: 42 },
  ];

  const epdsTrend = await Promise.all(
    milestones.map(async (m) => {
      // Process completed EPDS assessments
      const completedEpdsAssessments = assessments.filter(
        (ass) => ass.type === "EPDS" && ass.status === "COMPLETED"
      );

      const scoredAssessments = await Promise.all(
        completedEpdsAssessments.map(async (ass) => {
          const answers: any = ass.answers || {};
          const parsed: any = {};
          Object.keys(answers).forEach((k) => {
            if (typeof answers[k] === "string" || typeof answers[k] === "number") {
              parsed[k] = answers[k];
            }
          });
          const score = await epdsManifest.calculateScore(parsed);

          // Calculate postpartum day at completion
          let postpartumDay = 0;
          if (profile.deliveryDate && ass.completedAt) {
            const delivery = new Date(profile.deliveryDate);
            const completed = new Date(ass.completedAt);
            delivery.setHours(0, 0, 0, 0);
            completed.setHours(0, 0, 0, 0);
            const diffTime = Math.abs(completed.getTime() - delivery.getTime());
            postpartumDay = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          }
          return { score, postpartumDay };
        })
      );

      // Find closest within a 5-day window
      const closest = scoredAssessments.find((x) => Math.abs(x.postpartumDay - m.targetDays) <= 5);

      return {
        label: m.label,
        value: closest ? closest.score : 0,
      };
    })
  );

  // E. Magnesium intake trend (last 7 completed assessments)
  const completedMagnesium = assessments
    .filter((ass) => ass.type === "MAGNESIUM" && ass.status === "COMPLETED")
    .slice(0, 7)
    .reverse();

  const magnesiumTrend = await Promise.all(
    completedMagnesium.map(async (ass) => {
      const score = await magnesiumManifest.calculateScore(ass.answers as any);
      const label = ass.completedAt
        ? new Intl.DateTimeFormat("id-ID", { month: "short", day: "numeric" }).format(new Date(ass.completedAt))
        : "—";
      return { label, value: score };
    })
  );

  // F. Progress stats
  const progressStats = [
    { label: "Sudah Diisi", value: completedAssignments, color: "var(--primary)" },
    { label: "Belum Diisi", value: totalAssignments - completedAssignments, color: "#e7e2d8" },
  ];

  // G. Priority assessments
  const priorityAssessments = assignments
    .filter((a) => a.status === "PENDING" || a.status === "IN_PROGRESS" || a.status === "OVERDUE")
    .slice(0, 5)
    .map((a) => {
      let priority = "LOW";
      if (a.type === "EPDS") {
        priority = "URGENT"; // EPDS is mandatory/urgent
      } else if (a.status === "OVERDUE" || (a.status !== "COMPLETED" && new Date(a.dueDate) < new Date())) {
        priority = "HIGH";
      }
      return {
        id: a.id,
        title: a.title,
        priority,
        dueDate: new Date(a.dueDate),
      };
    });

  // --- MOOD EXTENSIONS ---
  const moodStats = await getMotherMoodStats(motherId);

  // Mood trend (last 7 days of daily mood entries)
  const lastSevenMoods = await prisma.dailyMood.findMany({
    where: { motherId },
    orderBy: { date: "asc" },
    take: 7,
  });

  const moodTrend = lastSevenMoods.map((m) => ({
    label: new Intl.DateTimeFormat("id-ID", { month: "short", day: "numeric" }).format(new Date(m.date)),
    value: m.score,
  }));

  // Mood distribution
  const allMoods = await prisma.dailyMood.findMany({
    where: { motherId },
  });
  let sangatBahagia = 0, bahagia = 0, biasaSaja = 0, sedih = 0, sangatSedih = 0;
  allMoods.forEach((m) => {
    if (m.score === 5) sangatBahagia++;
    else if (m.score === 4) bahagia++;
    else if (m.score === 3) biasaSaja++;
    else if (m.score === 2) sedih++;
    else if (m.score === 1) sangatSedih++;
  });

  const moodDistribution = [
    { label: "Sangat Bahagia", value: sangatBahagia, color: "#8aab74" },
    { label: "Bahagia", value: bahagia, color: "var(--primary)" },
    { label: "Biasa Saja", value: biasaSaja, color: "#e7e2d8" },
    { label: "Sedih", value: sedih, color: "#e8a85a" },
    { label: "Sangat Sedih", value: sangatSedih, color: "#b15c67" },
  ];

  return {
    greeting,
    daysPostpartum,
    progressPercent,
    totalAssignments,
    completedAssignments,
    assignments,
    activities: activities.slice(0, 5),
    recentNotes: recentNotes.slice(0, 3),

    // Analytics
    latestEpdsScore,
    todayMagnesium,
    nextAssessmentSchedule,
    epdsTrend,
    magnesiumTrend,
    progressStats,
    priorityAssessments,

    // Mood
    todayMood: moodStats.todayMood,
    moodStreak: moodStats.streak,
    moodAverageThisWeek: moodStats.averageThisWeek,
    moodTrend,
    moodDistribution,
  };
}
