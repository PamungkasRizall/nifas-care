-- CreateEnum
CREATE TYPE "InterventionType" AS ENUM ('COUNSELING', 'EDUCATION', 'REFERRAL', 'HOME_VISIT', 'PSYCHOTHERAPY');

-- AlterTable
ALTER TABLE "AssessmentReview" ADD COLUMN     "decision" TEXT,
ADD COLUMN     "followUpDate" TIMESTAMP(3),
ADD COLUMN     "followUpNote" TEXT;

-- CreateTable
CREATE TABLE "ClinicalIntervention" (
    "id" TEXT NOT NULL,
    "assessmentReviewId" TEXT NOT NULL,
    "type" "InterventionType" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClinicalIntervention_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClinicalIntervention" ADD CONSTRAINT "ClinicalIntervention_assessmentReviewId_fkey" FOREIGN KEY ("assessmentReviewId") REFERENCES "AssessmentReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
