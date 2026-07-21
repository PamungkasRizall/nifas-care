import type {
  Assessment,
  AssessmentReview,
  AssessmentStatus,
  AssessmentType,
  ReviewStatus,
  Role,
} from "@prisma/client";

// ─── Re-export Prisma enums ───────────────────────────────────────────────────

export type { AssessmentType, AssessmentStatus, ReviewStatus };

// ─── Result type ─────────────────────────────────────────────────────────────

export type EngineResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function ok<T>(data: T): EngineResult<T> {
  return { ok: true, data };
}

export function fail(error: string): EngineResult<never> {
  return { ok: false, error };
}

// ─── Assessment with reviews (full view) ─────────────────────────────────────

export type AssessmentWithReviews = Assessment & {
  reviews: AssessmentReview[];
};

// ─── Reviewer config per assessment type ─────────────────────────────────────

export interface WorkflowConfig {
  type: AssessmentType;
  /** Role yang mereview pada level 1 — selalu MIDWIFE */
  level1Reviewer: Role;
  /** Role yang mereview pada level 2 — berbeda per type */
  level2Reviewer: Role;
}

// ─── Review payload ───────────────────────────────────────────────────────────

export interface ReviewPayload {
  assessmentId: string;
  reviewerId: string;
  reviewerRole: Role;
  status: ReviewStatus;
  note?: string;
}

// ─── Permission query ─────────────────────────────────────────────────────────

export interface PermissionContext {
  userId: string;
  role: Role;
}
