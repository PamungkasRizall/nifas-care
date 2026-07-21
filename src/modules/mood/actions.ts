"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const MOOD_MAP: Record<number, { emoji: string; label: string }> = {
  5: { emoji: "😄", label: "Sangat Bahagia" },
  4: { emoji: "🙂", label: "Bahagia" },
  3: { emoji: "😐", label: "Biasa Saja" },
  2: { emoji: "😔", label: "Sedih" },
  1: { emoji: "😭", label: "Sangat Sedih" },
};

export async function saveDailyMoodAction(score: number, note?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Only allow Mother or Admin
  if (session.user.role !== "MOTHER" && session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  const mapping = MOOD_MAP[score];
  if (!mapping) {
    throw new Error("Invalid mood score. Must be 1 to 5.");
  }

  const motherId = session.user.id;

  // Local midnight of today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dailyMood = await prisma.dailyMood.upsert({
    where: {
      motherId_date: {
        motherId,
        date: today,
      },
    },
    update: {
      score,
      emoji: mapping.emoji,
      label: mapping.label,
      note: note || null,
    },
    create: {
      motherId,
      score,
      emoji: mapping.emoji,
      label: mapping.label,
      note: note || null,
      date: today,
    },
  });

  revalidatePath("/dashboard");
  return { success: true, data: dailyMood };
}
