-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('APPROVED', 'RETURNED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;

-- CreateTable
CREATE TABLE "OnboardingVerification" (
    "id" TEXT NOT NULL,
    "motherUserId" TEXT NOT NULL,
    "midwifeUserId" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OnboardingVerification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OnboardingVerification" ADD CONSTRAINT "OnboardingVerification_motherUserId_fkey" FOREIGN KEY ("motherUserId") REFERENCES "MotherProfile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingVerification" ADD CONSTRAINT "OnboardingVerification_midwifeUserId_fkey" FOREIGN KEY ("midwifeUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
