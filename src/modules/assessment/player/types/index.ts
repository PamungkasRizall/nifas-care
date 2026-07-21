export interface PlayerQuestionOption {
  text: string;
  value: string | number;
  score?: number;
}

export interface PlayerQuestion {
  id: string;
  text: string;
  options: PlayerQuestionOption[];
}

export interface AssessmentPlayerProps {
  assignmentId: string;
  title: string;
  description?: string;
  questions: PlayerQuestion[];
  initialAnswers?: Record<string, string | number>;
  onSubmit?: (answers: Record<string, string | number>) => Promise<{ success: boolean; message?: string }>;
  readOnly?: boolean;
}
