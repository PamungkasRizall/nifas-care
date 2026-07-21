"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function verifyUserSession() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

/**
 * Mendapatkan semua notifikasi aktif (In-App) milik user
 */
export async function getNotificationsAction() {
  try {
    const userId = await verifyUserSession();
    const list = await prisma.notification.findMany({
      where: {
        recipientId: userId,
        channel: "IN_APP",
        status: { not: "ARCHIVED" },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: list };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Menandai satu notifikasi telah dibaca
 */
export async function markAsReadAction(id: string) {
  try {
    const userId = await verifyUserSession();
    await prisma.notification.updateMany({
      where: { id, recipientId: userId },
      data: {
        status: "READ",
        readAt: new Date(),
      },
    });
    revalidatePath("/dashboard");
    revalidatePath("/midwife");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Menandai semua notifikasi milik user aktif telah dibaca
 */
export async function markAllAsReadAction() {
  try {
    const userId = await verifyUserSession();
    await prisma.notification.updateMany({
      where: { recipientId: userId, channel: "IN_APP", status: "UNREAD" },
      data: {
        status: "READ",
        readAt: new Date(),
      },
    });
    revalidatePath("/dashboard");
    revalidatePath("/midwife");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Mengarsipkan notifikasi
 */
export async function archiveNotificationAction(id: string) {
  try {
    const userId = await verifyUserSession();
    await prisma.notification.updateMany({
      where: { id, recipientId: userId },
      data: {
        status: "ARCHIVED",
      },
    });
    revalidatePath("/dashboard");
    revalidatePath("/midwife");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
