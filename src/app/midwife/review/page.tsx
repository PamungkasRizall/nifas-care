import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { getAllManifests } from "@/modules/assessment/registry";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MidwifeReviewDataTable, {
  type MotherReviewGroup,
  type ReviewAssessmentItem,
} from "./components/MidwifeReviewDataTable";

export const metadata: Metadata = {
  title: "Review Assessment — Portal Bidan",
  robots: { index: false, follow: false },
};

export default async function MidwifeReviewQueuePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Hanya perbolehkan MIDWIFE atau ADMIN
  if (session.user.role !== "MIDWIFE" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Ambil manifest skrining untuk mendapatkan title deskriptif
  const manifests = getAllManifests();
  const manifestMap = new Map<string, string>();
  manifests.forEach((m) => {
    manifestMap.set(m.type, m.title);
  });

  // Query SELURUH data Ibu terdaftar (role "MOTHER") beserta profil lengkap dan assessment-nya
  const mothersFromDb = await prisma.user.findMany({
    where: {
      role: "MOTHER",
    },
    include: {
      motherProfile: true,
      assessments: {
        where: {
          status: {
            in: ["SUBMITTED", "UNDER_REVIEW", "COMPLETED", "REJECTED"],
          },
        },
        include: {
          reviews: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              id: true,
              reviewerRole: true,
              status: true,
              decision: true,
              note: true,
              reviewedAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Transformasi data ke struktur MotherReviewGroup lengkap
  const motherGroups: MotherReviewGroup[] = mothersFromDb.map((mother) => {
    const profile = mother.motherProfile;
    const motherName = profile?.fullName || mother.name || "Ibu";

    // Hitung Hari Nifas (Postpartum)
    let daysPostpartum: number | null = null;
    if (profile?.deliveryDate) {
      const delivery = new Date(profile.deliveryDate);
      const today = new Date();
      delivery.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const diffTime = today.getTime() - delivery.getTime();
      daysPostpartum = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    const allAssessments: ReviewAssessmentItem[] = mother.assessments.map((a) => {
      const latestRev = a.reviews[0] || null;
      return {
        id: a.id,
        type: a.type,
        typeTitle: manifestMap.get(a.type) || a.type,
        status: a.status,
        submittedAt: a.submittedAt ? a.submittedAt.toISOString() : null,
        completedAt: a.completedAt ? a.completedAt.toISOString() : null,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
        latestReview: latestRev
          ? {
              id: latestRev.id,
              reviewerRole: latestRev.reviewerRole,
              status: latestRev.status,
              decision: latestRev.decision,
              note: latestRev.note,
              reviewedAt: latestRev.reviewedAt.toISOString(),
            }
          : null,
      };
    });

    const pendingAssessments = allAssessments.filter((a) => a.status === "SUBMITTED");
    const completedAssessments = allAssessments.filter((a) =>
      ["UNDER_REVIEW", "COMPLETED", "REJECTED"].includes(a.status)
    );

    const latest = allAssessments[0];
    const latestDate = latest
      ? latest.updatedAt || latest.createdAt
      : mother.updatedAt.toISOString();
    const latestType = latest ? latest.typeTitle.split(" (")[0] : "Belum ada skrining";

    return {
      motherId: mother.id,
      motherName,
      phoneNumber: profile?.phoneNumber || null,
      email: mother.email || null,
      userStatus: mother.status,
      registeredAt: mother.createdAt.toISOString(),

      // Data Pribadi
      dateOfBirth: profile?.dateOfBirth ? profile.dateOfBirth.toISOString() : null,
      education: profile?.education || null,
      occupation: profile?.occupation || null,
      address: profile?.address || null,

      // Data Persalinan
      deliveryDate: profile?.deliveryDate ? profile.deliveryDate.toISOString() : null,
      daysPostpartum,
      deliveryMethod: profile?.deliveryMethod || null,
      gravida: profile?.gravida ?? null,
      parity: profile?.parity ?? null,
      abortus: profile?.abortus ?? null,

      // Data Bayi
      babyName: profile?.babyName || null,
      babyGender: profile?.babyGender || null,
      birthWeight: profile?.birthWeight ?? null,
      birthLength: profile?.birthLength ?? null,

      // Faktor Risiko & Komorbiditas
      hypertension: profile?.hypertension ?? false,
      diabetes: profile?.diabetes ?? false,
      preEclampsia: profile?.preEclampsia ?? false,
      anxietyDisorder: profile?.anxietyDisorder ?? false,
      depressionHistory: profile?.depressionHistory ?? false,

      // Kontak Darurat
      emergencyContactName: profile?.emergencyContactName || null,
      emergencyContactRelationship: profile?.emergencyContactRelationship || null,
      emergencyContactPhone: profile?.emergencyContactPhone || null,

      // Catatan Bidan
      midwifeNotes: profile?.midwifeNotes || null,

      // Assessment Counts & Lists
      pendingCount: pendingAssessments.length,
      completedCount: completedAssessments.length,
      totalAssessments: allAssessments.length,
      latestDate,
      latestType,
      pendingAssessments,
      completedAssessments,
    };
  });

  // Urutkan: Ibu dengan antrean SUBMITTED ditaruh paling atas (FIFO berdasarkan submittedAt)
  // Diikuti ibu dengan skrining completed, dan terakhir ibu yang belum mengisi skrining
  motherGroups.sort((a, b) => {
    if (a.pendingCount > 0 && b.pendingCount === 0) return -1;
    if (a.pendingCount === 0 && b.pendingCount > 0) return 1;

    if (a.pendingCount > 0 && b.pendingCount > 0) {
      const aEarliest = a.pendingAssessments[0]?.submittedAt || a.pendingAssessments[0]?.createdAt || "";
      const bEarliest = b.pendingAssessments[0]?.submittedAt || b.pendingAssessments[0]?.createdAt || "";
      return aEarliest.localeCompare(bEarliest);
    }

    if (a.totalAssessments > 0 && b.totalAssessments === 0) return -1;
    if (a.totalAssessments === 0 && b.totalAssessments > 0) return 1;

    return new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime();
  });

  const manifestOptions = manifests.map((m) => ({
    type: m.type,
    title: m.title.split(" (")[0],
  }));

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Daftar Pasien & Review Skrining
        </h1>
        <p className="text-muted-foreground mt-1">
          Daftar seluruh Ibu nifas terdaftar. Klik nama Ibu untuk melihat antrean review, riwayat tinjauan skrining, serta data profil & rekam klinis lengkap.
        </p>
      </div>

      {/* Datatable Terpadu Per Nama Ibu */}
      <MidwifeReviewDataTable
        initialMothers={motherGroups}
        manifests={manifestOptions}
      />
    </div>
  );
}
