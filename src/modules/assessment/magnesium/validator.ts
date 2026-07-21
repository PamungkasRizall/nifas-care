import { z } from "zod";
import { MAGNESIUM_QUESTIONS } from "./questions";

export const MagnesiumAnswersSchema = z.object(
  MAGNESIUM_QUESTIONS.reduce((acc, q) => {
    acc[q.id] = z.coerce
      .number()
      .int()
      .min(0)
      .max(3, { message: "Jawaban tidak valid." });
    return acc;
  }, {} as Record<string, z.ZodTypeAny>)
);

export type MagnesiumAnswers = z.infer<typeof MagnesiumAnswersSchema>;

export function validateMagnesiumAnswers(answers: unknown) {
  return MagnesiumAnswersSchema.safeParse(answers);
}
