import { z } from "zod";
import { EPDS_QUESTIONS } from "./questions";

/**
 * Validasi form pengisian EPDS.
 * Setiap pertanyaan wajib memiliki jawaban berupa angka indeks 0-3.
 */
export const EPDSAnswersSchema = z.object(
  EPDS_QUESTIONS.reduce((acc, q) => {
    acc[q.id] = z.coerce
      .number()
      .int()
      .min(0)
      .max(3, { message: "Jawaban tidak valid." });
    return acc;
  }, {} as Record<string, z.ZodTypeAny>)
);

export type EPDSAnswers = z.infer<typeof EPDSAnswersSchema>;

export function validateEPDSAnswers(answers: unknown) {
  return EPDSAnswersSchema.safeParse(answers);
}
