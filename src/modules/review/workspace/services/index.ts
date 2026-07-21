import { prisma } from "@/lib/prisma";
import type { AssessmentType, Role } from "@prisma/client";

/**
 * Mendapatkan daftar assessment UNDER_REVIEW yang ditugaskan ke level 2 reviewer role tertentu.
 */
export async function getLevel2PendingQueue(role: Role, type: AssessmentType) {
  return prisma.assessment.findMany({
    where: {
      status: "UNDER_REVIEW",
      type,
    },
    include: {
      mother: {
        select: {
          id: true,
          name: true,
          email: true,
          motherProfile: {
            select: {
              fullName: true,
              deliveryDate: true,
            },
          },
        },
      },
      reviews: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { submittedAt: "asc" },
  });
}
