import { AssessmentStatus, AssessmentType, Role } from "@prisma/client";

/**
 * Hanya MOTHER yang dapat membuat assessment.
 */
export function canCreateAssessment(role: Role): boolean {
  return role === "MOTHER";
}

/**
 * MOTHER hanya dapat melihat assessment miliknya sendiri.
 * Pengecekan "milik sendiri" dilakukan di level query (motherId === userId).
 * Fungsi ini hanya memeriksa apakah role bisa mengakses daftar assessment Mother.
 */
export function canViewOwnAssessments(role: Role): boolean {
  return role === "MOTHER";
}

/**
 * Tentukan apakah reviewer dengan `role` berhak mereview
 * assessment dengan `type` pada `status` saat ini.
 *
 * Aturan:
 * - MIDWIFE  → mereview assessment berstatus SUBMITTED (level 1)
 * - DOCTOR   → mereview EPDS berstatus UNDER_REVIEW (level 2)
 * - NUTRITIONIST → mereview MAGNESIUM berstatus UNDER_REVIEW (level 2)
 * - ADMIN    → dapat mereview semua (untuk kebutuhan operasional)
 */
export function canReview(
  role: Role,
  type: AssessmentType,
  status: AssessmentStatus
): boolean {
  if (role === "ADMIN") return true;

  if (role === "MIDWIFE" && status === "SUBMITTED") return true;

  if (role === "DOCTOR" && type === "EPDS" && status === "UNDER_REVIEW")
    return true;

  if (
    role === "NUTRITIONIST" &&
    type === "MAGNESIUM" &&
    status === "UNDER_REVIEW"
  )
    return true;

  return false;
}

/**
 * Tentukan apakah user dengan `role` dapat melihat
 * daftar assessment dari `type` tertentu.
 *
 * - MIDWIFE      → semua type (review level 1)
 * - DOCTOR       → hanya EPDS
 * - NUTRITIONIST → hanya MAGNESIUM
 * - ADMIN        → semua
 * - MOTHER       → hanya milik sendiri (difilter di query)
 */
export function canViewAssessmentType(
  role: Role,
  type: AssessmentType
): boolean {
  if (role === "ADMIN" || role === "MIDWIFE") return true;
  if (role === "MOTHER") return true; // dibatasi motherId di query
  if (role === "DOCTOR" && type === "EPDS") return true;
  if (role === "NUTRITIONIST" && type === "MAGNESIUM") return true;
  return false;
}
