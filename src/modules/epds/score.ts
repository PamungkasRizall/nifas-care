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

/**
 * Menghitung skor EPDS-3A (Pertanyaan 3, 4, dan 5)
 * Digunakan sebagai deteksi awal indikasi kecemasan (cut-off >= 5)
 */
export async function calculateEPDS3AScore(answers: Record<string, unknown>): Promise<number> {
  let score = 0;
  const targetKeys = ["epds_q3", "epds_q4", "epds_q5"];

  try {
    const questions = await prisma.assessmentQuestion.findMany({
      where: {
        template: { code: "EPDS" },
        code: { in: targetKeys },
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
            score += option.score;
          }
        }
      }
      return score;
    }
  } catch (error) {
    console.error("Error calculating EPDS-3A score from DB, falling back to static questions:", error);
  }

  // Fallback to static questions
  for (const q of EPDS_QUESTIONS) {
    if (targetKeys.includes(q.id)) {
      const selectedAnswerIndex = answers[q.id];
      if (typeof selectedAnswerIndex === "number" || typeof selectedAnswerIndex === "string") {
        const idx = Number(selectedAnswerIndex);
        const option = q.options[idx];
        if (option) {
          score += option.score;
        }
      }
    }
  }

  return score;
}

