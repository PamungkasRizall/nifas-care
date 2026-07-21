import { prisma } from "@/lib/prisma";
import { EPDS_QUESTIONS } from "./questions";

/**
 * Menghitung total skor EPDS dari data jawaban mentah.
 * answers: map dari questionId ke index pilihan jawaban.
 */
export async function calculateEPDSScore(answers: Record<string, unknown>): Promise<number> {
  let totalScore = 0;

  try {
    const questions = await prisma.assessmentQuestion.findMany({
      where: {
        template: { code: "EPDS" },
        isActive: true,
      },
      include: {
        options: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (questions.length > 0) {
      for (const q of questions) {
        const selectedAnswerIndex = answers[q.code];
        if (selectedAnswerIndex !== undefined && selectedAnswerIndex !== null) {
          const idx = Number(selectedAnswerIndex);
          const option = q.options[idx];
          if (option) {
            totalScore += option.score;
          }
        }
      }
      return totalScore;
    }
  } catch (error) {
    console.error("Error calculating score from DB, falling back to static questions:", error);
  }

  // Fallback to static questions
  for (const q of EPDS_QUESTIONS) {
    const selectedAnswerIndex = answers[q.id];
    if (typeof selectedAnswerIndex === "number" || typeof selectedAnswerIndex === "string") {
      const idx = Number(selectedAnswerIndex);
      const option = q.options[idx];
      if (option) {
        totalScore += option.score;
      }
    }
  }

  return totalScore;
}

