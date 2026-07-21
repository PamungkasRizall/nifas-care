"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { InterventionType } from "@prisma/client";
import { NotificationCenter } from "@/modules/notification/services";

// Skema validasi keputusan klinis tingkat 2
const ClinicalReviewSchema = z.object({
  assessmentId: z.string().min(1),
  decision: z.string().min(5, "Keputusan/kesimpulan klinis wajib diisi minimal 5 karakter"),
  note: z.string().optional(),
  interventions: z.array(z.object({
    type: z.nativeEnum(InterventionType),
    notes: z.string().optional(),
  })),
  followUpDate: z.string().optional().refine((val) => {
    if (!val) return true;
    const d = new Date(val);
    return !isNaN(d.getTime()) && d > new Date();
  }, "Tanggal tindak lanjut harus di masa depan"),
  followUpNote: z.string().optional(),
});

const RejectSchema = z.object({
  assessmentId: z.string().min(1),
  note: z.string().min(5, "Alasan pengembalian wajib diisi minimal 5 karakter"),
});

async function verifyLevel2Reviewer() {
  const session = await auth();
  if (!session?.user?.id || !session.user.role) {
    throw new Error("Unauthorized");
  }
  // Level 2 reviewer mencakup DOCTOR, NUTRITIONIST, dan ADMIN
  const allowedRoles = ["DOCTOR", "NUTRITIONIST", "ADMIN"];
  if (!allowedRoles.includes(session.user.role)) {
    throw new Error("Anda tidak memiliki hak akses sebagai Reviewer Level 2.");
  }
  return session.user;
}

/**
 * Menyelesaikan kuesioner (Complete) - APPROVED tingkat 2
 */
export async function completeClinicalReviewAction(data: {
  assessmentId: string;
  decision: string;
  note?: string;
  interventions: { type: InterventionType; notes?: string }[];
  followUpDate?: string;
  followUpNote?: string;
}) {
  try {
    const user = await verifyLevel2Reviewer();
    const parsed = ClinicalReviewSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Input tidak valid" };
    }

    const { assessmentId, decision, note, interventions, followUpDate, followUpNote } = parsed.data;

    // Verifikasi assessment
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
    });

    if (!assessment) {
      return { success: false, error: "Assessment tidak ditemukan." };
    }

    if (assessment.status !== "UNDER_REVIEW") {
      return { success: false, error: "Assessment tidak berada dalam tahap review tingkat 2." };
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update status assessment ke COMPLETED
      await tx.assessment.update({
        where: { id: assessmentId },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });

      // 2. Cari assignment terkait dan update ke COMPLETED
      if (assessment.assignmentId) {
        await tx.assignment.update({
          where: { id: assessment.assignmentId },
          data: {
            status: "COMPLETED",
          },
        });
      }

      // 3. Buat record review
      const review = await tx.assessmentReview.create({
        data: {
          assessmentId,
          reviewerId: user.id,
          reviewerRole: user.role,
          status: "APPROVED",
          note: note || null,
          decision,
          followUpDate: followUpDate ? new Date(followUpDate) : null,
          followUpNote: followUpNote || null,
        },
      });

      // 4. Buat record intervensi
      if (interventions.length > 0) {
        await tx.clinicalIntervention.createMany({
          data: interventions.map((item) => ({
            assessmentReviewId: review.id,
            type: item.type,
            notes: item.notes || null,
          })),
        });
      }
    });

    // Kirim notifikasi hasil review & intervensi medis ke Ibu
    try {
      const motherUser = await prisma.user.findUnique({
        where: { id: assessment.motherId },
        select: { name: true },
      });
      const mName = motherUser?.name || "Ibu";

      // 1. Notifikasi skrining selesai
      await NotificationCenter.send("ASSESSMENT_COMPLETED", assessment.motherId, "MOTHER", {
        motherName: mName,
        assessmentName: assessment.type,
      });

      // 2. Notifikasi intervensi (jika ada yang dibuat)
      if (interventions.length > 0) {
        const typesStr = interventions.map((i) => i.type).join(", ");
        await NotificationCenter.send("CLINICAL_INTERVENTION_CREATED", assessment.motherId, "MOTHER", {
          motherName: mName,
          interventionType: typesStr,
          decisionNote: decision,
        });
      }
    } catch (err) {
      console.error("Gagal mengirim notifikasi completion level 2:", err);
    }

    revalidatePath("/doctor/review");
    revalidatePath("/nutritionist/review");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Terjadi kesalahan internal" };
  }
}

/**
 * Mengembalikan kuesioner ke Mother (Reject tingkat 2)
 */
export async function rejectClinicalReviewAction(assessmentId: string, note: string) {
  try {
    const user = await verifyLevel2Reviewer();
    const parsed = RejectSchema.safeParse({ assessmentId, note });
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Input tidak valid" };
    }

    // Verifikasi assessment
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
    });

    if (!assessment) {
      return { success: false, error: "Assessment tidak ditemukan." };
    }

    if (assessment.status !== "UNDER_REVIEW") {
      return { success: false, error: "Assessment tidak berada dalam tahap review tingkat 2." };
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update status assessment ke REJECTED
      await tx.assessment.update({
        where: { id: assessmentId },
        data: {
          status: "REJECTED",
        },
      });

      // 2. Cari assignment terkait dan update ke IN_PROGRESS agar bisa dikerjakan ulang
      if (assessment.assignmentId) {
        await tx.assignment.update({
          where: { id: assessment.assignmentId },
          data: {
            status: "IN_PROGRESS",
          },
        });
      }

      // 3. Buat record review
      await tx.assessmentReview.create({
        data: {
          assessmentId,
          reviewerId: user.id,
          reviewerRole: user.role,
          status: "REJECTED",
          note: parsed.data.note,
        },
      });
    });

    // Kirim notifikasi pengembalian ke Ibu
    try {
      const motherUser = await prisma.user.findUnique({
        where: { id: assessment.motherId },
        select: { name: true },
      });
      await NotificationCenter.send("ASSESSMENT_REJECTED", assessment.motherId, "MOTHER", {
        motherName: motherUser?.name || "Ibu",
        assessmentName: assessment.type,
        rejectReason: note,
      });
    } catch (err) {
      console.error("Gagal mengirim notifikasi rejection level 2:", err);
    }

    revalidatePath("/doctor/review");
    revalidatePath("/nutritionist/review");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Terjadi kesalahan internal" };
  }
}
