import { AssessmentStatus } from "@prisma/client";

/**
 * Graph transisi status yang valid.
 * Key = status asal, Value = set status tujuan yang diperbolehkan.
 *
 * Tidak ada hardcode per-type assessment — semua assessment
 * mengikuti jalur yang sama.
 */
const VALID_TRANSITIONS: Record<AssessmentStatus, Set<AssessmentStatus>> = {
  DRAFT:       new Set(["SUBMITTED"]),
  SUBMITTED:   new Set(["UNDER_REVIEW", "REJECTED"]),
  UNDER_REVIEW: new Set(["COMPLETED", "REJECTED"]),
  REJECTED:    new Set(["SUBMITTED"]),    // Mother perbaiki → submit ulang
  COMPLETED:   new Set(),                 // Terminal — tidak ada transisi
};

/**
 * Kembalikan `true` jika transisi dari `from` ke `to` valid.
 */
export function isValidTransition(
  from: AssessmentStatus,
  to: AssessmentStatus
): boolean {
  return VALID_TRANSITIONS[from].has(to);
}

/**
 * Validasi transisi; kembalikan pesan error jika tidak valid.
 */
export function validateTransition(
  from: AssessmentStatus,
  to: AssessmentStatus
): string | null {
  if (isValidTransition(from, to)) return null;
  return `Transisi status dari ${from} ke ${to} tidak diperbolehkan.`;
}

/**
 * Status yang berarti assessment sudah final (tidak bisa diubah).
 */
export function isTerminalStatus(status: AssessmentStatus): boolean {
  return status === "COMPLETED";
}

/**
 * Status yang berarti assessment bisa diedit oleh Mother.
 */
export function isEditableByMother(status: AssessmentStatus): boolean {
  return status === "DRAFT" || status === "REJECTED";
}
