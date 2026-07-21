import { prisma } from "@/lib/prisma";

/**
 * Menghitung total asupan magnesium harian secara dinamis dari database.
 */
export async function calculateMagnesiumScore(answers: Record<string, unknown>): Promise<number> {
  let totalMagnesium = 0;

  if (!answers || !Array.isArray(answers.items)) {
    return 0;
  }

  const items = answers.items as Array<{ foodId: string; servingId: string; qty: number }>;

  for (const item of items) {
    if (!item.servingId || !item.qty) continue;
    
    const serving = await prisma.foodServing.findUnique({
      where: { id: item.servingId },
      select: { magnesium: true }
    });

    if (serving) {
      totalMagnesium += serving.magnesium * item.qty;
    }
  }

  return totalMagnesium;
}
