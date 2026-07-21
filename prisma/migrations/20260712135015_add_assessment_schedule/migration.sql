-- CreateEnum
CREATE TYPE "ScheduleTriggerType" AS ENUM ('POSTPARTUM_DAY', 'POSTPARTUM_WEEK', 'CUSTOM');

-- CreateTable
CREATE TABLE "AssessmentTemplate" (
    "id" TEXT NOT NULL,
    "code" "AssessmentType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentSchedule" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "triggerType" "ScheduleTriggerType" NOT NULL,
    "triggerValue" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentTemplate_code_key" ON "AssessmentTemplate"("code");

-- AddForeignKey
ALTER TABLE "AssessmentSchedule" ADD CONSTRAINT "AssessmentSchedule_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "AssessmentTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
