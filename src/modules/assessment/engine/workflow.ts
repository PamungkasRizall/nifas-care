import { AssessmentStatus, AssessmentType, Role } from "@prisma/client";
import type { WorkflowConfig } from "@/types/assessment";

/**
 * Konfigurasi workflow per assessment type.
 *
 * Perbedaan antar-type hanya pada level2Reviewer.
 * Dengan registry ini, menambah type baru tidak perlu mengubah engine.ts.
 */
const WORKFLOW_REGISTRY: Record<AssessmentType, WorkflowConfig> = {
  EPDS: {
    type: "EPDS",
    level1Reviewer: "MIDWIFE",
    level2Reviewer: "DOCTOR",
  },
  MAGNESIUM: {
    type: "MAGNESIUM",
    level1Reviewer: "MIDWIFE",
    level2Reviewer: "NUTRITIONIST",
  },
};

/**
 * Ambil konfigurasi workflow untuk `type` tertentu.
 */
export function getWorkflowConfig(type: AssessmentType): WorkflowConfig {
  return WORKFLOW_REGISTRY[type];
}

/**
 * Kembalikan role reviewer yang dibutuhkan pada status saat ini.
 *
 * - SUBMITTED   → butuh level1Reviewer (MIDWIFE)
 * - UNDER_REVIEW → butuh level2Reviewer (DOCTOR / NUTRITIONIST)
 * - Status lain → null (tidak ada reviewer yang dibutuhkan)
 */
export function getRequiredReviewerRole(
  type: AssessmentType,
  status: AssessmentStatus
): Role | null {
  const config = getWorkflowConfig(type);

  if (status === "SUBMITTED") return config.level1Reviewer;
  if (status === "UNDER_REVIEW") return config.level2Reviewer;

  return null;
}

/**
 * Status berikutnya setelah review disetujui.
 *
 * - SUBMITTED   → UNDER_REVIEW  (menunggu level 2)
 * - UNDER_REVIEW → COMPLETED
 */
export function getNextStatusOnApprove(
  status: AssessmentStatus
): AssessmentStatus | null {
  const transitions: Partial<Record<AssessmentStatus, AssessmentStatus>> = {
    SUBMITTED:    "UNDER_REVIEW",
    UNDER_REVIEW: "COMPLETED",
  };
  return transitions[status] ?? null;
}

/**
 * Status setelah review ditolak — selalu REJECTED.
 */
export function getNextStatusOnReject(): AssessmentStatus {
  return "REJECTED";
}
