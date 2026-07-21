"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateAssignmentsForMother } from "@/modules/assessment/schedule/engine";
import { NotificationCenter } from "@/modules/notification/services";

const ApproveSchema = z.object({
  motherUserId: z.string().min(1),
  note: z.string().optional(),
});

const ReturnSchema = z.object({
  motherUserId: z.string().min(1),
  note: z.string().min(5, "Catatan wajib diisi dan minimal 5 karakter"),
});

async function getMidwifeSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "MIDWIFE") throw new Error("Hanya Bidan yang dapat melakukan tindakan ini");
  return session;
}

async function getMotherPending(motherUserId: string) {
  const mother = await prisma.user.findUnique({
    where: { id: motherUserId },
    select: { id: true, role: true, status: true },
  });
  if (!mother) throw new Error("Ibu tidak ditemukan");
  if (mother.role !== "MOTHER") throw new Error("User bukan Ibu");
  if (mother.status !== "PENDING_MIDWIFE_REVIEW") {
    throw new Error("Data Ibu tidak dalam status menunggu verifikasi");
  }
  return mother;
}

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function approveMother(
  motherUserId: string,
  note?: string
): Promise<ActionResult> {
  try {
    const parsed = ApproveSchema.safeParse({ motherUserId, note });
    if (!parsed.success) {
      return { success: false, error: "Data tidak valid" };
    }

    const session = await getMidwifeSession();
    await getMotherPending(motherUserId);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: motherUserId },
        data: { status: "ACTIVE" },
      });

      await tx.onboardingVerification.create({
        data: {
          motherUserId,
          midwifeUserId: session.user.id,
          status: "APPROVED",
          note: note ?? null,
        },
      });
    });

    // Pemicu otomatis Assessment Schedule Engine
    try {
      await generateAssignmentsForMother(motherUserId);
    } catch (err) {
      console.error("Gagal menjalankan schedule engine:", err);
    }

    // Kirim notifikasi akun aktif ke Ibu
    try {
      const motherUser = await prisma.user.findUnique({
        where: { id: motherUserId },
        select: { name: true },
      });
      await NotificationCenter.send("MOTHER_ACTIVATED", motherUserId, "MOTHER", {
        motherName: motherUser?.name || "Ibu",
      });
    } catch (err) {
      console.error("Gagal mengirim notifikasi aktivasi:", err);
    }

    revalidatePath("/midwife/verifikasi");
    revalidatePath(`/midwife/verifikasi/${motherUserId}`);
    return { success: true };
  } catch (error) {
    console.error("approveMother error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Terjadi kesalahan",
    };
  }
}

export async function returnMother(
  motherUserId: string,
  note: string
): Promise<ActionResult> {
  try {
    const parsed = ReturnSchema.safeParse({ motherUserId, note });
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Data tidak valid";
      return { success: false, error: firstError };
    }

    const session = await getMidwifeSession();
    await getMotherPending(motherUserId);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: motherUserId },
        data: { status: "PENDING_ONBOARDING" },
      });

      await tx.motherProfile.update({
        where: { userId: motherUserId },
        data: { midwifeNotes: note },
      });

      await tx.onboardingVerification.create({
        data: {
          motherUserId,
          midwifeUserId: session.user.id,
          status: "RETURNED",
          note,
        },
      });
    });

    revalidatePath("/midwife/verifikasi");
    revalidatePath(`/midwife/verifikasi/${motherUserId}`);
    return { success: true };
  } catch (error) {
    console.error("returnMother error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Terjadi kesalahan",
    };
  }
}
