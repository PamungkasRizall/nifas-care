import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  getScoringReferenceData,
  computeMotherScoreSummary,
} from "@/modules/midwife/services/scoringAggregator";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();

    if (!session || (session.user.role !== "MIDWIFE" && session.user.role !== "ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Pre-load lookup scoring reference data (batch)
    const scoringRefs = await getScoringReferenceData();

    // Query seluruh data Ibu nifas beserta profil, mood, dan asesmen
    const mothers = await prisma.user.findMany({
      where: { role: "MOTHER" },
      include: {
        motherProfile: true,
        dailyMoods: {
          orderBy: { date: "desc" },
          take: 30,
        },
        assessments: {
          where: {
            status: {
              in: ["SUBMITTED", "UNDER_REVIEW", "COMPLETED", "REJECTED"],
            },
          },
          orderBy: { createdAt: "asc" },
          include: {
            assignment: {
              select: {
                title: true,
              },
            },
            reviews: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Susun kolom header sesuai template Excel "Tambahan FIELD (kuning)"
    const headers: string[] = [
      "Nama lengkap Ibu Nifas",
      "No WA/HP",
      "Email",
      "Tanggal Lahir Ibu Nifas",
      "Usia",
      "Pendidikan",
      "Pekerjaan",
      "Alamat domisili",
      "Tanggal Persalinan",
      "Hari Postpartum",
      "Metode Persalinan",
      "Jenis kelamin bayi",
      "Berat Badan Bayi",
      "Panjang Badan Bayi",
      "Faktor Risiko",
      "Tracker Mood",
      "Skor EPDS 1 (PRE)",
    ];

    // Kolom Mg 1..14
    for (let i = 1; i <= 14; i++) {
      headers.push(`Skor Mg ke-${i}`);
    }

    // Kolom EPDS 2 (POST)
    headers.push("SKOR EPDS-2 (POST)");

    // Kolom Mg 15..28
    for (let i = 15; i <= 28; i++) {
      headers.push(`Skor Mg ke-${i}`);
    }

    // Kolom EPDS 3
    headers.push("SKOR EPDS-3");

    // Kolom Mg 29..42
    for (let i = 29; i <= 42; i++) {
      headers.push(`Skor Mg ke-${i}`);
    }

    // Kolom EPDS 4
    headers.push("SKOR EPDS-4");

    // Kolom Ringkasan Status & Intervensi
    headers.push(
      "Skor EPDS Terakhir",
      "Status EPDS",
      "Skor GAD-7 Terakhir",
      "Status GAD-7",
      "Asupan Magnesium Terakhir (mg)",
      "Catatan Intervensi Terakhir (Bidan/Nakes)",
      "Tanggal Intervensi"
    );

    const escapeCsv = (val: unknown): string => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    let csvContent = headers.map((h) => escapeCsv(h)).join(",") + "\n";

    for (const mother of mothers) {
      const profile = mother.motherProfile;
      if (!profile) continue;

      // 1. Hitung Usia Ibu
      let ageStr = "";
      let dobStr = "";
      if (profile.dateOfBirth) {
        const dob = new Date(profile.dateOfBirth);
        dobStr = dob.toISOString().split("T")[0];
        const diff = Date.now() - dob.getTime();
        ageStr = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)).toString();
      }

      // 2. Hitung Hari Postpartum
      let daysPostpartumStr = "";
      let deliveryDateStr = "";
      if (profile.deliveryDate) {
        const delivery = new Date(profile.deliveryDate);
        deliveryDateStr = delivery.toISOString().split("T")[0];
        const today = new Date();
        delivery.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        daysPostpartumStr = Math.floor(
          Math.abs(today.getTime() - delivery.getTime()) / (1000 * 60 * 60 * 24)
        ).toString();
      }

      // 3. Faktor Risiko
      const risks: string[] = [];
      if (profile.hypertension) risks.push("Hipertensi");
      if (profile.diabetes) risks.push("Diabetes Melitus");
      if (profile.preEclampsia) risks.push("Pre-Eklampsia");
      if (profile.anxietyDisorder) risks.push("Riwayat Gangguan Kecemasan");
      if (profile.depressionHistory) risks.push("Riwayat Depresi");
      const riskStr = risks.length > 0 ? risks.join(", ") : "Tidak Ada";

      // 4. Kalkulasi skor terpadu (EPDS, Mg, GAD7, Mood)
      const scoreSummary = computeMotherScoreSummary(mother, scoringRefs);

      // Mood Terakhir
      let moodStr = "";
      if (scoreSummary.moodList.length > 0) {
        const latestMood = scoreSummary.moodList[0];
        moodStr = `${latestMood.emoji || ""} ${latestMood.label || ""} (${latestMood.score}/5)`.trim();
        if (latestMood.note) {
          moodStr += ` - ${latestMood.note}`;
        }
      }

      // 5. Catatan Intervensi Terakhir
      let latestNote = "";
      let latestNoteDate = "";
      const allReviews = [];
      for (const ass of mother.assessments) {
        if (ass.reviews && ass.reviews.length > 0) {
          allReviews.push(...ass.reviews);
        }
      }
      allReviews.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const lastReviewWithNote = allReviews.find(
        (r) => r.note && r.note.trim().length > 0
      );
      if (lastReviewWithNote) {
        latestNote = lastReviewWithNote.note || "";
        latestNoteDate = new Date(lastReviewWithNote.createdAt)
          .toISOString()
          .split("T")[0];
      } else if (profile.midwifeNotes) {
        latestNote = profile.midwifeNotes;
        latestNoteDate = profile.updatedAt
          ? new Date(profile.updatedAt).toISOString().split("T")[0]
          : "";
      }

      // Buat row data
      const rowValues: string[] = [
        escapeCsv(profile.fullName || mother.name || "Ibu"),
        escapeCsv(profile.phoneNumber || ""),
        escapeCsv(mother.email || ""),
        escapeCsv(dobStr),
        escapeCsv(ageStr),
        escapeCsv(profile.education || ""),
        escapeCsv(profile.occupation || ""),
        escapeCsv(profile.address || ""),
        escapeCsv(deliveryDateStr),
        escapeCsv(daysPostpartumStr),
        escapeCsv(profile.deliveryMethod || ""),
        escapeCsv(profile.babyGender || ""),
        escapeCsv(profile.birthWeight ? `${profile.birthWeight} gram` : ""),
        escapeCsv(profile.birthLength ? `${profile.birthLength} cm` : ""),
        escapeCsv(riskStr),
        escapeCsv(moodStr),
        // EPDS 1 (PRE)
        escapeCsv(
          scoreSummary.epdsSlotMap[1]?.score !== undefined
            ? scoreSummary.epdsSlotMap[1].score
            : ""
        ),
      ];

      // Mg 1..14
      for (let i = 1; i <= 14; i++) {
        const mg = scoreSummary.magnesiumSlotMap[i];
        rowValues.push(escapeCsv(mg ? mg.intakeMg : ""));
      }

      // EPDS 2 (POST)
      rowValues.push(
        escapeCsv(
          scoreSummary.epdsSlotMap[2]?.score !== undefined
            ? scoreSummary.epdsSlotMap[2].score
            : ""
        )
      );

      // Mg 15..28
      for (let i = 15; i <= 28; i++) {
        const mg = scoreSummary.magnesiumSlotMap[i];
        rowValues.push(escapeCsv(mg ? mg.intakeMg : ""));
      }

      // EPDS 3
      rowValues.push(
        escapeCsv(
          scoreSummary.epdsSlotMap[3]?.score !== undefined
            ? scoreSummary.epdsSlotMap[3].score
            : ""
        )
      );

      // Mg 29..42
      for (let i = 29; i <= 42; i++) {
        const mg = scoreSummary.magnesiumSlotMap[i];
        rowValues.push(escapeCsv(mg ? mg.intakeMg : ""));
      }

      // EPDS 4
      rowValues.push(
        escapeCsv(
          scoreSummary.epdsSlotMap[4]?.score !== undefined
            ? scoreSummary.epdsSlotMap[4].score
            : ""
        )
      );

      // Status Terkini & Intervensi
      rowValues.push(
        escapeCsv(
          scoreSummary.latestEpds?.score !== undefined
            ? scoreSummary.latestEpds.score
            : ""
        ),
        escapeCsv(scoreSummary.latestEpds?.riskLabel || ""),
        escapeCsv(
          scoreSummary.latestGad7?.score !== undefined
            ? scoreSummary.latestGad7.score
            : ""
        ),
        escapeCsv(scoreSummary.latestGad7?.riskLabel || ""),
        escapeCsv(
          scoreSummary.latestMagnesium?.intakeMg !== undefined
            ? scoreSummary.latestMagnesium.intakeMg
            : ""
        ),
        escapeCsv(latestNote),
        escapeCsv(latestNoteDate)
      );

      csvContent += rowValues.join(",") + "\n";
    }

    // Gunakan UTF-8 BOM agar Excel dapat membuka file langsung dengan karakter yang rapi
    const bom = "\uFEFF";
    return new NextResponse(bom + csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="laporan_tele_ibu_nifas.csv"',
      },
    });
  } catch (error) {
    console.error("Export Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
