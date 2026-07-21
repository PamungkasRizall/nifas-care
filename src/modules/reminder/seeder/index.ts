import { prisma } from "@/lib/prisma";

export async function seedReminderRules(): Promise<void> {
  const rulesData = [
    { code: "MOTHER_DUE_H1", trigger: "ASSESSMENT_DUE", offset: -1 },
    { code: "MOTHER_DUE_H0", trigger: "ASSESSMENT_DUE", offset: 0 },
    { code: "MOTHER_OVERDUE", trigger: "ASSESSMENT_OVERDUE", offset: 1 },
    { code: "MIDWIFE_PENDING", trigger: "PENDING_REVIEW", offset: 0 },
    { code: "DOCTOR_PENDING", trigger: "PENDING_REVIEW", offset: 0 },
    { code: "NUTRITIONIST_PENDING", trigger: "PENDING_REVIEW", offset: 0 },
  ];

  for (const r of rulesData) {
    await prisma.reminderRule.upsert({
      where: { code: r.code },
      update: {
        trigger: r.trigger,
        offset: r.offset,
      },
      create: {
        code: r.code,
        trigger: r.trigger,
        offset: r.offset,
        isActive: true,
      },
    });
  }

  console.log("seedReminderRules: Aturan pengingat berhasil didaftarkan di database.");
}
