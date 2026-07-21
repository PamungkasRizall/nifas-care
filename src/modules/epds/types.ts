export interface AnswerOption {
  text: string;
  score: number;
}

export interface Question {
  id: string;
  text: string;
  options: AnswerOption[];
}

export interface EPDSResult {
  score: number;
  interpretation: string;
  riskStatus: "LOW" | "HIGH" | "URGENT";
}
