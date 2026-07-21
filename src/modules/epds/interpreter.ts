import { prisma } from "@/lib/prisma";
import type { EPDSResult } from "./types";

/**
 * Menerjemahkan skor EPDS ke dalam interpretasi klinis resmi dari Master Data.
 */
export async function interpretEPDSScore(
  score: number,
  answers: Record<string, unknown>
): Promise<EPDSResult> {
  let riskStatus: "LOW" | "HIGH" | "URGENT" = "LOW";
  let interpretation = "";

  try {
    // 1. Fetch interpretations from DB
    const dbInterpretations = await prisma.assessmentInterpretation.findMany({
      where: {
        template: { code: "EPDS" },
      },
    });

    const matched = dbInterpretations.find(
      (item) => score >= item.minScore && score <= item.maxScore
    );

    if (matched) {
      riskStatus = matched.priority as "LOW" | "HIGH" | "URGENT";
      interpretation = matched.interpretation;
    } else {
      // Fallback
      if (score >= 13) {
        riskStatus = "HIGH";
        interpretation = "Probable Depression";
      } else if (score >= 10) {
        riskStatus = "HIGH";
        interpretation = "Risiko Depresi";
      } else {
        riskStatus = "LOW";
        interpretation = "Normal";
      }
    }

    // 2. Evaluate Red Flag Rules from DB
    const redFlagRules = await prisma.redFlagRule.findMany({
      where: {
        template: { code: "EPDS" },
      },
    });

    let isRedFlagTriggered = false;
    for (const rule of redFlagRules) {
      const answerValue = answers[rule.questionCode];
      if (answerValue !== undefined && answerValue !== null) {
        const idx = Number(answerValue);
        // Find corresponding option to check its score
        const option = await prisma.assessmentOption.findFirst({
          where: {
            question: {
              template: { code: "EPDS" },
              code: rule.questionCode,
            },
            order: idx + 1,
          },
        });

        if (option && option.score >= rule.triggerScore) {
          riskStatus = rule.overridePriority as "LOW" | "HIGH" | "URGENT";
          isRedFlagTriggered = true;
          break;
        }
      }
    }

    if (isRedFlagTriggered) {
      interpretation = `${interpretation} (Peringatan: Terdapat indikasi pikiran untuk membahayakan diri sendiri, harap segera hubungi tenaga medis atau kontak darurat).`;
    }

  } catch (error) {
    console.error("Error fetching interpretations from DB, falling back to static logic:", error);
    
    // Fallback logic
    const suicidalIdeationIndex = answers["epds_q10"];
    const hasSuicidalIdeation = suicidalIdeationIndex !== undefined && Number(suicidalIdeationIndex) < 3;

    if (score >= 13) {
      riskStatus = "HIGH";
      interpretation = "Kemungkinan besar mengalami depresi derajat sedang hingga berat. Sangat disarankan untuk segera berkonsultasi dengan profesional medis.";
    } else if (score >= 10) {
      riskStatus = "HIGH";
      interpretation = "Menunjukkan adanya gejala kecemasan atau kemungkinan depresi ringan. Disarankan untuk berkonsultasi dengan Bidan atau Dokter.";
    } else {
      riskStatus = "LOW";
      interpretation = "Skor Anda menunjukkan tingkat kecemasan atau depresi yang rendah. Tetap jaga kesehatan fisik dan mental Anda.";
    }

    if (hasSuicidalIdeation && suicidalIdeationIndex !== 3) {
      riskStatus = "HIGH";
      interpretation = `${interpretation} (Peringatan: Terdapat indikasi pikiran untuk membahayakan diri sendiri, harap segera hubungi tenaga medis atau kontak darurat).`;
    }
  }

  return {
    score,
    interpretation,
    riskStatus,
  };
}

