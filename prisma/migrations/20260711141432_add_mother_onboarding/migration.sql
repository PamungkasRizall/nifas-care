-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING_ONBOARDING', 'PENDING_MIDWIFE_REVIEW', 'ACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'PENDING_ONBOARDING';

-- CreateTable
CREATE TABLE "MotherProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT,
    "phoneNumber" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "education" TEXT,
    "occupation" TEXT,
    "address" TEXT,
    "deliveryDate" TIMESTAMP(3),
    "deliveryMethod" TEXT,
    "gravida" INTEGER,
    "parity" INTEGER,
    "abortus" INTEGER,
    "babyName" TEXT,
    "babyGender" TEXT,
    "birthWeight" DOUBLE PRECISION,
    "birthLength" DOUBLE PRECISION,
    "hypertension" BOOLEAN NOT NULL DEFAULT false,
    "diabetes" BOOLEAN NOT NULL DEFAULT false,
    "preEclampsia" BOOLEAN NOT NULL DEFAULT false,
    "anxietyDisorder" BOOLEAN NOT NULL DEFAULT false,
    "depressionHistory" BOOLEAN NOT NULL DEFAULT false,
    "emergencyContactName" TEXT,
    "emergencyContactRelationship" TEXT,
    "emergencyContactPhone" TEXT,
    "privacyPolicyConsent" BOOLEAN NOT NULL DEFAULT false,
    "dataProcessingConsent" BOOLEAN NOT NULL DEFAULT false,
    "researchParticipationConsent" BOOLEAN NOT NULL DEFAULT false,
    "midwifeNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MotherProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MotherProfile_userId_key" ON "MotherProfile"("userId");

-- AddForeignKey
ALTER TABLE "MotherProfile" ADD CONSTRAINT "MotherProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
