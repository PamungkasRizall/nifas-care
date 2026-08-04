import { prisma } from "@/lib/prisma";
import type { AssessmentInterpretation } from "@prisma/client";

/**
 * Menerjemahkan skor GAD-7 ke dalam interpretasi klinis.
 */
export async function interpretGAD7Score(
  score: number,
  answers?: Record<string, unknown>
): Promise<{ score: number; interpretation: string; riskStatus: "LOW" | "HIGH" | "URGENT" }> {
  const template = await prisma.assessmentTemplate.findUnique({
    where: { code: "GAD7" },
    include: { interpretations: true },
  });

  if (template && template.interpretations.length > 0) {
    const interpretation = template.interpretations.find(
      (rule) => score >= rule.minScore && score <= rule.maxScore
    );
    if (interpretation) {
      return {
        score,
        interpretation: interpretation.interpretation,
        riskStatus: interpretation.priority as "LOW" | "HIGH" | "URGENT",
      };
    }
  }

  // Fallback to static rules
  let riskStatus: "LOW" | "HIGH" | "URGENT" = "LOW";
  let interpretation = "Minimal";

  if (score >= 15) {
    riskStatus = "URGENT";
    interpretation = "Kecemasan Berat";
  } else if (score >= 10) {
    riskStatus = "HIGH";
    interpretation = "Kecemasan Sedang";
  } else if (score >= 5) {
    riskStatus = "LOW";
    interpretation = "Kecemasan Ringan";
  }

  return {
    score,
    interpretation,
    riskStatus,
  };
}
