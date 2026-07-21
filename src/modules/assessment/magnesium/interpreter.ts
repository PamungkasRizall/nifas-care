import { prisma } from "@/lib/prisma";

/**
 * Menafsirkan total asupan magnesium harian secara dinamis berdasarkan target dan aturan interpretasi di database.
 */
export async function interpretMagnesiumScore(
  score: number,
  answers: Record<string, unknown>
): Promise<{
  score: number;
  interpretation: string;
  riskStatus: "LOW" | "HIGH" | "URGENT";
}> {
  // Ambil target AKG aktif
  const targetObj = await prisma.magnesiumTarget.findFirst({
    where: { isActive: true },
  });
  const target = targetObj?.target ?? 320;

  const percentage = (score / target) * 100;

  // Temukan aturan interpretasi yang cocok berdasarkan persentase pencapaian
  const rule = await prisma.magnesiumInterpretationRule.findFirst({
    where: {
      minPercent: { lte: percentage },
      maxPercent: { gte: percentage },
    },
  });

  const status = rule?.status || (percentage >= 100 ? "Cukup" : "Kurang");
  const interpretation =
    rule?.interpretation ||
    (percentage >= 100
      ? "Asupan magnesium harian Anda telah memenuhi target AKG. Pertahankan pola makan sehat Anda!"
      : "Asupan magnesium harian Anda kurang dari target AKG. Disarankan untuk meningkatkan konsumsi makanan tinggi magnesium.");

  const riskStatus: "LOW" | "HIGH" | "URGENT" = status === "Cukup" ? "LOW" : "HIGH";

  return {
    score,
    interpretation,
    riskStatus,
  };
}
