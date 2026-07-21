import { prisma } from "@/lib/prisma";
import { NotificationCenter } from "@/modules/notification/services";

export async function runReminderEngine(): Promise<number> {
  let triggerCount = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Ambil aturan reminder yang aktif
  const rules = await prisma.reminderRule.findMany({
    where: { isActive: true },
  });

  for (const rule of rules) {
    // ----------------------------------------------------
    // KONDISI A: ASSESSMENT_DUE (Pengingat Batas Waktu Kuesioner ke Ibu)
    // ----------------------------------------------------
    if (rule.trigger === "ASSESSMENT_DUE") {
      // Cari assignment PENDING atau IN_PROGRESS
      const assignments = await prisma.assignment.findMany({
        where: {
          status: { in: ["PENDING", "IN_PROGRESS"] },
        },
        include: { mother: true },
      });

      for (const assign of assignments) {
        const targetDate = new Date(assign.dueDate);
        targetDate.setDate(targetDate.getDate() + rule.offset);
        targetDate.setHours(0, 0, 0, 0);

        // Jika hari target pencocokan jatuh pada hari ini
        if (targetDate.getTime() === today.getTime()) {
          // Cek history agar tidak terkirim ganda untuk assignment & rule ini hari ini
          const sent = await prisma.reminderHistory.findFirst({
            where: {
              ruleId: rule.id,
              recipientId: assign.motherId,
              assessmentId: assign.id,
              triggeredAt: { gte: today },
            },
          });

          if (!sent) {
            // Memicu notifikasi via NotificationCenter
            const daysLeft = Math.abs(rule.offset);
            const msgTitle = `Pengingat Batas Waktu: ${assign.title}`;
            const msgBody = `Halo ${assign.mother.name || "Ibu"}, tugas pengisian "${assign.title}" akan berakhir dalam ${daysLeft} hari (${new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(assign.dueDate))}). Harap segera mengisi.`;

            // Simpan riwayat & picu notifikasi
            await prisma.$transaction(async (tx) => {
              await tx.reminderHistory.create({
                data: {
                  ruleId: rule.id,
                  recipientId: assign.motherId,
                  assessmentId: assign.id,
                },
              });

              // Picu notifikasi dengan override format pesan/title khusus pengingat
              await NotificationCenter.send("ASSESSMENT_ASSIGNED", assign.motherId, "MOTHER", {
                motherName: assign.mother.name || "Ibu",
                assessmentName: `${assign.title} (Batas waktu tinggal ${daysLeft} hari!)`,
                dueDate: new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(assign.dueDate)),
              });
            });

            triggerCount++;
          }
        }
      }
    }

    // ----------------------------------------------------
    // KONDISI B: ASSESSMENT_OVERDUE (Terlambat Mengisi)
    // ----------------------------------------------------
    if (rule.trigger === "ASSESSMENT_OVERDUE") {
      const assignments = await prisma.assignment.findMany({
        where: {
          status: { in: ["PENDING", "IN_PROGRESS"] },
          dueDate: { lt: new Date() }, // Sudah melewati batas
        },
        include: { mother: true },
      });

      for (const assign of assignments) {
        // Cek history agar tidak terkirim berkali-kali hari ini
        const sent = await prisma.reminderHistory.findFirst({
          where: {
            ruleId: rule.id,
            recipientId: assign.motherId,
            assessmentId: assign.id,
            triggeredAt: { gte: today },
          },
        });

        if (!sent) {
          await prisma.$transaction(async (tx) => {
            await tx.reminderHistory.create({
              data: {
                ruleId: rule.id,
                recipientId: assign.motherId,
                assessmentId: assign.id,
              },
            });

            // Picu notifikasi revisi / terlambat
            await NotificationCenter.send("ASSESSMENT_REJECTED", assign.motherId, "MOTHER", {
              motherName: assign.mother.name || "Ibu",
              assessmentName: assign.title,
              rejectReason: "Anda telah melewati batas waktu pengisian kuesioner ini. Mohon untuk segera menyelesaikannya.",
            });
          });

          triggerCount++;
        }
      }
    }

    // ----------------------------------------------------
    // KONDISI C: PENDING_REVIEW (Peringatan Tugas Review Mengendap)
    // ----------------------------------------------------
    if (rule.trigger === "PENDING_REVIEW") {
      // 1. Reviewer Level 1 (Bidan)
      if (rule.code === "MIDWIFE_PENDING") {
        const pendingMidwifeReviews = await prisma.assessment.findMany({
          where: { status: "SUBMITTED" },
        });

        if (pendingMidwifeReviews.length > 0) {
          // Kirim pengingat ke semua bidan aktif
          const midwives = await prisma.user.findMany({
            where: { role: "MIDWIFE" },
          });

          for (const midwife of midwives) {
            const sent = await prisma.reminderHistory.findFirst({
              where: {
                ruleId: rule.id,
                recipientId: midwife.id,
                triggeredAt: { gte: today },
              },
            });

            if (!sent) {
              await prisma.$transaction(async (tx) => {
                await tx.reminderHistory.create({
                  data: {
                    ruleId: rule.id,
                    recipientId: midwife.id,
                  },
                });

                await NotificationCenter.send("ASSESSMENT_SUBMITTED", midwife.id, "MIDWIFE", {
                  motherName: `${pendingMidwifeReviews.length} Ibu nifas`,
                  assessmentName: "kuesioner baru",
                });
              });

              triggerCount++;
            }
          }
        }
      }

      // 2. Reviewer Level 2 (Dokter / Ahli Gizi)
      if (rule.code === "DOCTOR_PENDING") {
        const pendingEpds = await prisma.assessment.findMany({
          where: { status: "UNDER_REVIEW", type: "EPDS" },
        });

        if (pendingEpds.length > 0) {
          const doctors = await prisma.user.findMany({
            where: { role: "DOCTOR" },
          });

          for (const doc of doctors) {
            const sent = await prisma.reminderHistory.findFirst({
              where: {
                ruleId: rule.id,
                recipientId: doc.id,
                triggeredAt: { gte: today },
              },
            });

            if (!sent) {
              await prisma.$transaction(async (tx) => {
                await tx.reminderHistory.create({
                  data: {
                    ruleId: rule.id,
                    recipientId: doc.id,
                  },
                });

                // Memicu notifikasi bell Dokter
                await NotificationCenter.send("ASSESSMENT_SUBMITTED", doc.id, "DOCTOR", {
                  motherName: `${pendingEpds.length} tugas screening EPDS`,
                  assessmentName: "menunggu keputusan klinis Anda",
                });
              });

              triggerCount++;
            }
          }
        }
      }

      if (rule.code === "NUTRITIONIST_PENDING") {
        const pendingMagnesium = await prisma.assessment.findMany({
          where: { status: "UNDER_REVIEW", type: "MAGNESIUM" },
        });

        if (pendingMagnesium.length > 0) {
          const nutritionists = await prisma.user.findMany({
            where: { role: "NUTRITIONIST" },
          });

          for (const nut of nutritionists) {
            const sent = await prisma.reminderHistory.findFirst({
              where: {
                ruleId: rule.id,
                recipientId: nut.id,
                triggeredAt: { gte: today },
              },
            });

            if (!sent) {
              await prisma.$transaction(async (tx) => {
                await tx.reminderHistory.create({
                  data: {
                    ruleId: rule.id,
                    recipientId: nut.id,
                  },
                });

                await NotificationCenter.send("ASSESSMENT_SUBMITTED", nut.id, "NUTRITIONIST", {
                  motherName: `${pendingMagnesium.length} tugas asupan Magnesium`,
                  assessmentName: "menunggu keputusan gizi Anda",
                });
              });

              triggerCount++;
            }
          }
        }
      }
    }
  }

  return triggerCount;
}
