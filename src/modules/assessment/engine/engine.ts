/**
 * Assessment Engine
 *
 * Core orchestration layer. Menggabungkan status, workflow, dan permission
 * untuk menyediakan operasi assessment yang aman dan konsisten.
 *
 * Semua fungsi mengembalikan `EngineResult` — tidak ada exception yang di-throw
 * ke luar modul ini. Error ditangani secara eksplisit oleh caller.
 */

import { AssessmentStatus, AssessmentType, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { canCreateAssessment, canReview } from "./permission";
import { validateTransition } from "./status";
import {
  getNextStatusOnApprove,
  getNextStatusOnReject,
  getRequiredReviewerRole,
} from "./workflow";
import { fail, ok, type EngineResult } from "@/types/assessment";

// ─── Create ───────────────────────────────────────────────────────────────────

/**
 * Membuat assessment baru berstatus DRAFT.
 * Hanya MOTHER yang dapat membuatnya.
 */
export async function createAssessment(
  motherId: string,
  motherRole: Role,
  type: AssessmentType
): Promise<EngineResult<{ id: string }>> {
  if (!canCreateAssessment(motherRole)) {
    return fail("Hanya Ibu yang dapat membuat assessment.");
  }

  try {
    const assessment = await prisma.assessment.create({
      data: { motherId, type, status: "DRAFT" },
      select: { id: true },
    });
    return ok({ id: assessment.id });
  } catch {
    return fail("Gagal membuat assessment. Silakan coba lagi.");
  }
}

// ─── Submit ───────────────────────────────────────────────────────────────────

/**
 * Mother mengirim assessment dari DRAFT → SUBMITTED.
 * `answers` adalah payload mentah — belum divalidasi domain-specific.
 */
export async function submitAssessment(
  assessmentId: string,
  motherId: string,
  answers: unknown
): Promise<EngineResult<void>> {
  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    select: { id: true, motherId: true, status: true },
  });

  if (!assessment) return fail("Assessment tidak ditemukan.");
  if (assessment.motherId !== motherId)
    return fail("Anda tidak memiliki akses ke assessment ini.");

  const transitionError = validateTransition(assessment.status, "SUBMITTED");
  if (transitionError) return fail(transitionError);

  try {
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        status: "SUBMITTED",
        answers: answers as object,
        submittedAt: new Date(),
      },
    });
    return ok(undefined);
  } catch {
    return fail("Gagal mengirim assessment. Silakan coba lagi.");
  }
}

// ─── Review: Approve ──────────────────────────────────────────────────────────

/**
 * Reviewer menyetujui assessment.
 * Status maju ke UNDER_REVIEW atau COMPLETED tergantung posisi di workflow.
 */
export async function approveAssessment(
  assessmentId: string,
  reviewerId: string,
  reviewerRole: Role,
  note?: string
): Promise<EngineResult<void>> {
  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    select: { id: true, type: true, status: true },
  });

  if (!assessment) return fail("Assessment tidak ditemukan.");

  if (!canReview(reviewerRole, assessment.type, assessment.status)) {
    return fail(
      `Role ${reviewerRole} tidak dapat mereview assessment ini pada status ${assessment.status}.`
    );
  }

  const nextStatus = getNextStatusOnApprove(assessment.status);
  if (!nextStatus) {
    return fail(`Tidak ada transisi approve yang valid dari status ${assessment.status}.`);
  }

  const transitionError = validateTransition(assessment.status, nextStatus);
  if (transitionError) return fail(transitionError);

  // Validasi bahwa role yang mereview sesuai dengan yang dibutuhkan workflow
  const requiredRole = getRequiredReviewerRole(assessment.type, assessment.status);
  if (requiredRole && reviewerRole !== requiredRole && reviewerRole !== "ADMIN") {
    return fail(`Pada status ini dibutuhkan reviewer dengan role ${requiredRole}.`);
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.assessment.update({
        where: { id: assessmentId },
        data: {
          status: nextStatus,
          ...(nextStatus === "COMPLETED" ? { completedAt: new Date() } : {}),
        },
      });

      await tx.assessmentReview.create({
        data: {
          assessmentId,
          reviewerId,
          reviewerRole,
          status: "APPROVED",
          note: note ?? null,
        },
      });
    });

    return ok(undefined);
  } catch {
    return fail("Gagal memproses review. Silakan coba lagi.");
  }
}

// ─── Review: Reject ───────────────────────────────────────────────────────────

/**
 * Reviewer menolak assessment → status REJECTED.
 * Catatan wajib diisi saat menolak.
 */
export async function rejectAssessment(
  assessmentId: string,
  reviewerId: string,
  reviewerRole: Role,
  note: string
): Promise<EngineResult<void>> {
  if (!note || note.trim().length < 5) {
    return fail("Catatan wajib diisi minimal 5 karakter saat menolak.");
  }

  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    select: { id: true, type: true, status: true },
  });

  if (!assessment) return fail("Assessment tidak ditemukan.");

  if (!canReview(reviewerRole, assessment.type, assessment.status)) {
    return fail(
      `Role ${reviewerRole} tidak dapat mereview assessment ini pada status ${assessment.status}.`
    );
  }

  const nextStatus: AssessmentStatus = getNextStatusOnReject();
  const transitionError = validateTransition(assessment.status, nextStatus);
  if (transitionError) return fail(transitionError);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.assessment.update({
        where: { id: assessmentId },
        data: { status: nextStatus },
      });

      await tx.assessmentReview.create({
        data: {
          assessmentId,
          reviewerId,
          reviewerRole,
          status: "REJECTED",
          note: note.trim(),
        },
      });
    });

    return ok(undefined);
  } catch {
    return fail("Gagal memproses penolakan. Silakan coba lagi.");
  }
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Ambil assessment milik satu Mother beserta seluruh riwayat reviewnya.
 */
export async function getMotherAssessments(motherId: string) {
  return prisma.assessment.findMany({
    where: { motherId },
    include: { reviews: { orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Ambil daftar assessment yang menunggu review oleh `role`.
 * - MIDWIFE: semua type, status SUBMITTED
 * - DOCTOR: hanya EPDS, status UNDER_REVIEW
 * - NUTRITIONIST: hanya MAGNESIUM, status UNDER_REVIEW
 */
export async function getPendingReviews(role: Role) {
  if (role === "MIDWIFE") {
    return prisma.assessment.findMany({
      where: { status: "SUBMITTED" },
      include: {
        mother: { select: { id: true, name: true, email: true, motherProfile: { select: { fullName: true } } } },
        reviews: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { submittedAt: "asc" },
    });
  }

  if (role === "DOCTOR") {
    return prisma.assessment.findMany({
      where: { status: "UNDER_REVIEW", type: "EPDS" },
      include: {
        mother: { select: { id: true, name: true, email: true, motherProfile: { select: { fullName: true } } } },
        reviews: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { submittedAt: "asc" },
    });
  }

  if (role === "NUTRITIONIST") {
    return prisma.assessment.findMany({
      where: { status: "UNDER_REVIEW", type: "MAGNESIUM" },
      include: {
        mother: { select: { id: true, name: true, email: true, motherProfile: { select: { fullName: true } } } },
        reviews: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { submittedAt: "asc" },
    });
  }

  return [];
}
