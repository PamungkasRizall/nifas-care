import { prisma } from "@/lib/prisma";

/**
 * Service untuk query database spesifik Magnesium.
 */
export async function getMagnesiumAssessmentsForMother(motherId: string) {
  return prisma.assessment.findMany({
    where: {
      motherId,
      type: "MAGNESIUM",
    },
    include: {
      reviews: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
