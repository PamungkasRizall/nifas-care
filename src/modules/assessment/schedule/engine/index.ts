import { prisma } from "@/lib/prisma";
import { NotificationCenter } from "@/modules/notification/services";

/**
 * Menghasilkan Assignment Assessment terjadwal secara otomatis untuk Mother tertentu.
 * Dijalankan ketika status Mother berubah menjadi ACTIVE.
 * Fungsi ini idempotent (aman dijalankan berkali-kali tanpa memicu tugas duplikat).
 */
export async function generateAssignmentsForMother(motherId: string): Promise<void> {
  const mother = await prisma.user.findUnique({
    where: { id: motherId },
    include: {
      motherProfile: true,
    },
  });

  if (!mother || mother.role !== "MOTHER" || mother.status !== "ACTIVE") {
    console.warn(`generateAssignmentsForMother: User ${motherId} tidak aktif atau bukan Mother.`);
    return;
  }

  const profile = mother.motherProfile;
  if (!profile || !profile.deliveryDate) {
    console.warn(`generateAssignmentsForMother: Mother ${motherId} tidak memiliki deliveryDate.`);
    return;
  }

  // Hitung Hari Nifas berjalan
  const delivery = new Date(profile.deliveryDate);
  const today = new Date();
  delivery.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(today.getTime() - delivery.getTime());
  const daysPostpartum = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Ambil semua jadwal (schedule) aktif dari database
  const activeSchedules = await prisma.assessmentSchedule.findMany({
    where: {
      isActive: true,
      template: {
        isActive: true,
      },
    },
    include: {
      template: true,
    },
  });

  for (const schedule of activeSchedules) {
    let isTriggered = false;

    if (schedule.triggerType === "POSTPARTUM_DAY") {
      // Trigger jika hari postpartum saat ini sudah melewati atau sama dengan jadwal
      isTriggered = daysPostpartum >= schedule.triggerValue;
    } else if (schedule.triggerType === "POSTPARTUM_WEEK") {
      isTriggered = daysPostpartum >= schedule.triggerValue * 7;
    }

    if (!isTriggered) {
      continue;
    }

    // Tentukan judul assignment (e.g. "EPDS (Skrining Ke-1)")
    const title = `${schedule.template.name} (Skrining Ke-${schedule.sequence})`;

    // Hitung tanggal mulai (scheduledAt) dan batas waktu (dueDate)
    const scheduledAt = new Date(delivery);
    if (schedule.triggerType === "POSTPARTUM_DAY") {
      scheduledAt.setDate(scheduledAt.getDate() + schedule.triggerValue);
    } else {
      scheduledAt.setDate(scheduledAt.getDate() + schedule.triggerValue * 7);
    }

    // Batas waktu penyelesaian: misal 7 hari sejak jadwal dimulai
    const dueDate = new Date(scheduledAt);
    dueDate.setDate(dueDate.getDate() + 7);

    // Cek Idempotensi: pastikan tugas kuesioner dengan type dan sekuensial yang sama belum pernah dibuat
    const existingAssignment = await prisma.assignment.findFirst({
      where: {
        motherId,
        type: schedule.template.code,
        title, // Pengecekan unik berdasarkan judul/sekuens
      },
    });

    if (existingAssignment) {
      // Sudah ada assignment, lewati (idempotent)
      continue;
    }

    // Buat assignment baru
    await prisma.assignment.create({
      data: {
        motherId,
        type: schedule.template.code,
        title,
        scheduledAt,
        dueDate,
        status: "PENDING",
      },
    });

    // Kirim notifikasi tugas baru ke Ibu
    try {
      await NotificationCenter.send("ASSESSMENT_ASSIGNED", motherId, "MOTHER", {
        motherName: mother.name || "Ibu",
        assessmentName: schedule.template.name,
        dueDate: new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(dueDate),
      });
    } catch (err) {
      console.error("Gagal mengirim notifikasi assignment:", err);
    }

    console.log(`generateAssignmentsForMother: Berhasil membuat assignment "${title}" untuk Ibu ${motherId}.`);
  }
}
