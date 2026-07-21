"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { calculateEPDSScore } from "@/modules/epds/score";
import { NotificationCenter } from "@/modules/notification/services";

async function verifySession() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user;
}

export async function submitAssessmentPlayerAction(
  assignmentId: string,
  answers: Record<string, string | number>
) {
  try {
    const user = await verifySession();

    // Verifikasi assignment
    const assignment = await prisma.assignment.findFirst({
      where: { id: assignmentId, motherId: user.id },
    });

    if (!assignment) {
      return { success: false, error: "Assignment tidak ditemukan." };
    }

    if (assignment.status === "COMPLETED") {
      return { success: false, error: "Tugas ini sudah diselesaikan." };
    }

    // Cari draft assessment atau buat baru
    const existingDraft = await prisma.assessment.findFirst({
      where: { assignmentId, motherId: user.id },
    });

    await prisma.$transaction(async (tx) => {
      if (existingDraft) {
        // Update data assessment menjadi SUBMITTED
        await tx.assessment.update({
          where: { id: existingDraft.id },
          data: {
            status: "SUBMITTED",
            answers: answers as any,
            submittedAt: new Date(),
          },
        });
      } else {
        // Buat assessment baru langsung SUBMITTED
        await tx.assessment.create({
          data: {
            motherId: user.id,
            assignmentId,
            type: assignment.type,
            status: "SUBMITTED",
            answers: answers as any,
            submittedAt: new Date(),
          },
        });
      }

      // Update status assignment ke SUBMITTED (Menunggu Review)
      await tx.assignment.update({
        where: { id: assignmentId },
        data: {
          status: "SUBMITTED",
        },
      });
    });

    // Kirim notifikasi respons ke Bidan
    try {
      const verification = await prisma.onboardingVerification.findFirst({
        where: { motherUserId: user.id },
        select: { midwifeUserId: true },
      });

      let targetMidwifeId = verification?.midwifeUserId;
      if (!targetMidwifeId) {
        // Fallback: cari bidan pertama terdaftar
        const firstMidwife = await prisma.user.findFirst({
          where: { role: "MIDWIFE" },
          select: { id: true },
        });
        targetMidwifeId = firstMidwife?.id;
      }

      if (targetMidwifeId) {
        await NotificationCenter.send("ASSESSMENT_SUBMITTED", targetMidwifeId, "MIDWIFE", {
          motherName: user.name || "Ibu",
          assessmentName: assignment.type,
        });
      }
    } catch (err) {
      console.error("Gagal mengirim notifikasi submission:", err);
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/assessment");
    revalidatePath("/dashboard/history");
    return { success: true };
  } catch (err) {
    console.error("submitAssessmentPlayerAction error:", err);
    return { success: false, error: "Terjadi kesalahan internal." };
  }
}
