import type { AssessmentType, Role } from "@prisma/client";

export interface AnswerOption {
  text: string;
  score: number;
}

export interface Question {
  id: string;
  text: string;
  options: AnswerOption[];
}

export interface AssessmentManifest {
  type: AssessmentType;
  title: string;
  description: string;
  questions: Question[];
  level2Reviewer: Role;
  calculateScore: (answers: Record<string, unknown>) => Promise<number> | number;
  interpretScore: (
    score: number,
    answers: Record<string, unknown>
  ) =>
    | Promise<{
        score: number;
        interpretation: string;
        riskStatus: "LOW" | "HIGH" | "URGENT";
      }>
    | {
        score: number;
        interpretation: string;
        riskStatus: "LOW" | "HIGH" | "URGENT";
      };
}
