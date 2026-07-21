"use server";

/**
 * Assessment Server Actions
 *
 * Lapisan tipis di atas engine.ts yang:
 * 1. Memvalidasi session Auth.js
 * 2. Memvalidasi input dengan Zod
 * 3. Mendelegasikan ke engine
 *
 * Tidak ada business logic di sini — semua ada di engine.ts.
 */

import { auth } from "@/lib/auth/auth";
import {
  approveAssessment,
  createAssessment,
  rejectAssessment,
  submitAssessment,
} from "@/modules/assessment/engine/engine";
import type { EngineResult } from "@/types/assessment";
import { AssessmentType } from "@prisma/client";
import { z } from "zod";

// ─── Schema validasi ──────────────────────────────────────────────────────────

const AssessmentTypeSchema = z.nativeEnum(AssessmentType);

const SubmitSchema = z.object({
  assessmentId: z.string().min(1),
  answers: z.record(z.string(), z.unknown()), // format bebas — tiap sprint mendefinisikan sendiri
});

const ReviewSchema = z.object({
  assessmentId: z.string().min(1),
  note: z.string().optional(),
});

const RejectSchema = z.object({
  assessmentId: z.string().min(1),
  note: z.string().min(5, "Catatan wajib diisi minimal 5 karakter"),
});

// ─── Helper: ambil session ────────────────────────────────────────────────────

async function getSession() {
  const session = await auth();
  if (!session?.user?.id || !session.user.role) {
    return null;
  }
  return session;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

/**
 * Mother membuat assessment baru (DRAFT).
 */
export async function createAssessmentAction(
  type: AssessmentType
): Promise<EngineResult<{ id: string }>> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Sesi tidak valid. Silakan login ulang." };

  const parsed = AssessmentTypeSchema.safeParse(type);
  if (!parsed.success) return { ok: false, error: "Jenis assessment tidak valid." };

  return createAssessment(session.user.id, session.user.role, parsed.data);
}

/**
 * Mother mengirim assessment yang sudah diisi (DRAFT → SUBMITTED).
 */
export async function submitAssessmentAction(
  assessmentId: string,
  answers: Record<string, unknown>
): Promise<EngineResult<void>> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Sesi tidak valid. Silakan login ulang." };

  const parsed = SubmitSchema.safeParse({ assessmentId, answers });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Input tidak valid." };
  }

  return submitAssessment(
    parsed.data.assessmentId,
    session.user.id,
    parsed.data.answers
  );
}

/**
 * Reviewer menyetujui assessment.
 * Status maju: SUBMITTED → UNDER_REVIEW atau UNDER_REVIEW → COMPLETED.
 */
export async function approveAssessmentAction(
  assessmentId: string,
  note?: string
): Promise<EngineResult<void>> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Sesi tidak valid. Silakan login ulang." };

  const parsed = ReviewSchema.safeParse({ assessmentId, note });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Input tidak valid." };
  }

  return approveAssessment(
    parsed.data.assessmentId,
    session.user.id,
    session.user.role,
    parsed.data.note
  );
}

/**
 * Reviewer menolak assessment (→ REJECTED).
 * Catatan wajib diisi.
 */
export async function rejectAssessmentAction(
  assessmentId: string,
  note: string
): Promise<EngineResult<void>> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Sesi tidak valid. Silakan login ulang." };

  const parsed = RejectSchema.safeParse({ assessmentId, note });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Input tidak valid." };
  }

  return rejectAssessment(
    parsed.data.assessmentId,
    session.user.id,
    session.user.role,
    parsed.data.note
  );
}
