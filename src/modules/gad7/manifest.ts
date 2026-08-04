import type { AssessmentManifest } from "../assessment/shared/contract";
import { GAD7_QUESTIONS } from "./questions";
import { calculateGAD7Score } from "./score";
import { interpretGAD7Score } from "./interpreter";

export const gad7Manifest: AssessmentManifest = {
  type: "GAD7",
  title: "Generalized Anxiety Disorder 7 (GAD-7)",
  description: "Skrining tingkat kecemasan ibu postpartum (dalam 2 minggu terakhir).",
  questions: GAD7_QUESTIONS,
  level2Reviewer: "DOCTOR", // Assumed DOCTOR for GAD7, similar to EPDS
  calculateScore: calculateGAD7Score,
  interpretScore: interpretGAD7Score,
};
