export interface TemplateVariables {
  motherName?: string;
  assessmentName?: string;
  doctorName?: string;
  midwifeName?: string;
  dueDate?: string;
  rejectReason?: string;
  interventionType?: string;
  decisionNote?: string;
}

export function formatNotificationMessage(
  event: string,
  variables: TemplateVariables
): { title: string; message: string } {
  let title = "Notifikasi Nifas Care";
  let message = "Ada pembaruan informasi pada portal kesehatan Anda.";

  const mName = variables.motherName || "Ibu";
  const aName = variables.assessmentName || "Skrining";

  switch (event) {
    case "MOTHER_ACTIVATED":
      title = "Selamat Datang di Nifas Care!";
      message = `Halo ${mName}, akun Anda telah berhasil diverifikasi oleh Bidan. Anda kini dapat mulai mengisi instrumen pemantauan kesehatan postpartum secara berkala pada aplikasi.`;
      break;

    case "ASSESSMENT_ASSIGNED":
      title = "Tugas Skrining Baru Tersedia";
      const dueStr = variables.dueDate ? ` sebelum tanggal ${variables.dueDate}` : "";
      message = `Halo ${mName}, Anda mendapatkan tugas pengisian skrining baru "${aName}". Harap segera mengisi lembar instrumen${dueStr} demi menjaga kesehatan masa nifas Anda.`;
      break;

    case "ASSESSMENT_SUBMITTED":
      title = "Respons Skrining Baru Dikirimkan";
      message = `Respons jawaban skrining "${aName}" milik Ibu ${mName} telah sukses disubmit dan kini menunggu verifikasi (Level 1) Anda.`;
      break;

    case "ASSESSMENT_REJECTED":
      title = "Revisi Pengisian Skrining Diperlukan";
      const reasonStr = variables.rejectReason ? ` dengan catatan: "${variables.rejectReason}"` : "";
      message = `Halo ${mName}, pengisian kuesioner "${aName}" Anda dikembalikan oleh penilai${reasonStr}. Harap buka kembali portal dan lakukan perbaikan jawaban.`;
      break;

    case "ASSESSMENT_COMPLETED":
      title = "Skrining Selesai Diverifikasi";
      message = `Halo ${mName}, proses verifikasi skrining "${aName}" Anda telah selesai secara final. Hasil kesimpulan klinis dan interpretasi sudah dapat dilihat pada dashboard.`;
      break;

    case "CLINICAL_INTERVENTION_CREATED":
      title = "Instruksi Intervensi Medis Baru";
      const intType = variables.interventionType || "Tindakan Medis";
      const decNote = variables.decisionNote ? ` (${variables.decisionNote})` : "";
      message = `Halo ${mName}, tim medis kami memberikan rekomendasi tindakan "${intType}"${decNote} berdasarkan hasil analisis skrining terakhir Anda. Mohon dibaca dan dijalankan dengan baik.`;
      break;
  }

  return { title, message };
}
