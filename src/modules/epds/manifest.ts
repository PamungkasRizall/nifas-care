import type { AssessmentManifest } from "../assessment/shared/contract";
import { EPDS_QUESTIONS } from "./questions";
import { calculateEPDSScore } from "./score";
import { interpretEPDSScore } from "./interpreter";

export const epdsManifest: AssessmentManifest = {
  type: "EPDS",
  title: "Edinburgh Postnatal Depression Scale (EPDS)",
  description: "Skrining kesehatan mental dan kecemasan ibu postpartum.",
  questions: EPDS_QUESTIONS,
  level2Reviewer: "DOCTOR",
  calculateScore: calculateEPDSScore,
  interpretScore: interpretEPDSScore,
};
