"use server";

import { auth } from "@/lib/auth/auth";
import { approveAssessment, rejectAssessment } from "@/modules/assessment/engine/engine";
import { revalidatePath } from "next/cache";
import { z } from "zod";

async function verifyMidwife() {
  const session = await auth();
  if (!session?.user?.id || !session.user.role) {
    throw new Error("Unauthorized");
  }
  if (session.user.role !== "MIDWIFE" && session.user.role !== "ADMIN") {
    throw new Error("Hanya Bidan yang dapat melakukan tindakan ini.");
  }
  return session.user;
}

const ReviewSchema = z.object({
  assessmentId: z.string().min(1),
  note: z.string().optional(),
});

const RejectSchema = z.object({
  assessmentId: z.string().min(1),
  note: z.string().min(5, "Catatan penolakan wajib diisi minimal 5 karakter"),
});

export async function midwifeApproveAction(assessmentId: string, note?: string) {
  try {
    const user = await verifyMidwife();
    const parsed = ReviewSchema.safeParse({ assessmentId, note });
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Input tidak valid" };
    }

    const res = await approveAssessment(
      parsed.data.assessmentId,
      user.id,
      user.role,
      parsed.data.note
    );

    if (res.ok) {
      revalidatePath("/midwife");
      revalidatePath("/midwife/review");
      return { success: true };
    } else {
      return { success: false, error: res.error };
    }
  } catch (err: any) {
    return { success: false, error: err.message || "Terjadi kesalahan internal" };
  }
}

export async function midwifeRejectAction(assessmentId: string, note: string) {
  try {
    const user = await verifyMidwife();
    const parsed = RejectSchema.safeParse({ assessmentId, note });
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Input tidak valid" };
    }

    const res = await rejectAssessment(
      parsed.data.assessmentId,
      user.id,
      user.role,
      parsed.data.note
    );

    if (res.ok) {
      revalidatePath("/midwife");
      revalidatePath("/midwife/review");
      return { success: true };
    } else {
      return { success: false, error: res.error };
    }
  } catch (err: any) {
    return { success: false, error: err.message || "Terjadi kesalahan internal" };
  }
}
