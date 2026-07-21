import type { AssessmentManifest } from "../shared/contract";
import { MAGNESIUM_QUESTIONS } from "./questions";
import { calculateMagnesiumScore } from "./calculator";
import { interpretMagnesiumScore } from "./interpreter";

export const magnesiumManifest: AssessmentManifest = {
  type: "MAGNESIUM",
  title: "Skrining Asupan Magnesium Harian",
  description: "Skrining asupan gizi magnesium harian bagi Ibu postpartum.",
  questions: MAGNESIUM_QUESTIONS,
  level2Reviewer: "NUTRITIONIST",
  calculateScore: calculateMagnesiumScore,
  interpretScore: interpretMagnesiumScore,
};
