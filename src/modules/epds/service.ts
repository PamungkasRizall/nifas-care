import { prisma } from "@/lib/prisma";

/**
 * Service untuk query data spesifik EPDS.
 */
export async function getEPDSAssessmentsForMother(motherId: string) {
  return prisma.assessment.findMany({
    where: {
      motherId,
      type: "EPDS",
    },
    include: {
      reviews: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getEPDSAssessmentDetail(assessmentId: string) {
  return prisma.assessment.findFirst({
    where: {
      id: assessmentId,
      type: "EPDS",
    },
    include: {
      mother: {
        include: {
          motherProfile: true,
        },
      },
      reviews: {
        include: {
          reviewer: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}
