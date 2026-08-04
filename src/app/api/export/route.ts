import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAssessmentManifest } from "@/modules/assessment/registry";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();

    if (!session || (session.user.role !== "MIDWIFE" && session.user.role !== "ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ambil data semua ibu nifas beserta profilnya
    const mothers = await prisma.user.findMany({
      where: { role: "MOTHER" },
      include: {
        motherProfile: true,
        assessments: {
          where: { status: "COMPLETED" },
          orderBy: { completedAt: "desc" },
          include: {
            reviews: {
              orderBy: { createdAt: "desc" },
              take: 1, // Ambil catatan review terbaru per assessment
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const epdsManifest = getAssessmentManifest("EPDS");
    const gad7Manifest = getAssessmentManifest("GAD7");
    const magnesiumManifest = getAssessmentManifest("MAGNESIUM");

    // Persiapkan string CSV
    // Kolom: Nama Ibu, Usia, Tgl Persalinan, Hari Postpartum, Skor EPDS Terakhir, Interp EPDS, Skor GAD7, Interp GAD7, Asupan Mg Terakhir, Catatan Bidan Terbaru
    const headers = [
      "Nama Ibu",
      "Email",
      "Usia",
      "Tanggal Persalinan",
      "Hari Postpartum",
      "Faktor Risiko",
      "Skor EPDS Terakhir",
      "Status EPDS",
      "Skor GAD-7 Terakhir",
      "Status GAD-7",
      "Asupan Magnesium Terakhir (mg)",
      "Catatan Intervensi Terakhir (Bidan/Nakes)",
      "Tanggal Intervensi",
    ];

    let csvContent = headers.map(h => `"${h}"`).join(",") + "\n";

    for (const mother of mothers) {
      const profile = mother.motherProfile;
      if (!profile) continue;

      // Usia Ibu
      let age = "";
      if (profile.dateOfBirth) {
        const diff = Date.now() - new Date(profile.dateOfBirth).getTime();
        age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)).toString();
      }

      // Hari Postpartum
      let daysPostpartum = "";
      let deliveryDateStr = "";
      if (profile.deliveryDate) {
        const delivery = new Date(profile.deliveryDate);
        deliveryDateStr = delivery.toISOString().split("T")[0];
        const today = new Date();
        delivery.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        daysPostpartum = Math.floor(Math.abs(today.getTime() - delivery.getTime()) / (1000 * 60 * 60 * 24)).toString();
      }

      // Faktor Risiko
      const risks = [];
      if (profile.hypertension) risks.push("Hipertensi");
      if (profile.diabetes) risks.push("Diabetes");
      if (profile.preEclampsia) risks.push("Pre-Eklampsia");
      const riskStr = risks.length > 0 ? risks.join(", ") : "Tidak Ada";

      // EPDS Terakhir
      const latestEpds = mother.assessments.find((a) => a.type === "EPDS");
      let epdsScoreStr = "";
      let epdsStatusStr = "";
      if (latestEpds && latestEpds.answers) {
        const parsed = latestEpds.answers as any;
        const score = await epdsManifest.calculateScore(parsed);
        const interp = await epdsManifest.interpretScore(score, parsed);
        epdsScoreStr = score.toString();
        epdsStatusStr = interp.riskStatus;
      }

      // GAD7 Terakhir
      const latestGad7 = mother.assessments.find((a) => a.type === "GAD7");
      let gad7ScoreStr = "";
      let gad7StatusStr = "";
      if (latestGad7 && latestGad7.answers) {
        const parsed = latestGad7.answers as any;
        const score = await gad7Manifest.calculateScore(parsed);
        const interp = await gad7Manifest.interpretScore(score, parsed);
        gad7ScoreStr = score.toString();
        if (interp && "riskStatus" in interp) {
          gad7StatusStr = interp.riskStatus as string;
        }
      }

      // Magnesium Terakhir
      const latestMg = mother.assessments.find((a) => a.type === "MAGNESIUM");
      let mgScoreStr = "";
      if (latestMg && latestMg.answers) {
        const score = await magnesiumManifest.calculateScore(latestMg.answers as any);
        mgScoreStr = score.toString();
      }

      // Catatan Intervensi Terakhir
      let latestNote = "";
      let latestNoteDate = "";
      
      // Kumpulkan semua review dari semua assessment untuk ibu ini
      let allReviews = [];
      for (const ass of mother.assessments) {
        if (ass.reviews && ass.reviews.length > 0) {
          allReviews.push(...ass.reviews);
        }
      }
      
      // Urutkan review berdasarkan tanggal terbaru
      allReviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      const lastReviewWithNote = allReviews.find(r => r.note && r.note.trim().length > 0);
      if (lastReviewWithNote) {
        latestNote = lastReviewWithNote.note || "";
        latestNoteDate = lastReviewWithNote.createdAt.toISOString().split("T")[0];
      } else if (profile.midwifeNotes) {
        // Fallback ke catatan onboarding bidan
        latestNote = profile.midwifeNotes;
        latestNoteDate = profile.updatedAt ? profile.updatedAt.toISOString().split("T")[0] : "";
      }

      // Escape quotes for CSV
      const escapeCsv = (str: string) => {
        if (!str) return "";
        return `"${str.replace(/"/g, '""')}"`;
      };

      const row = [
        escapeCsv(profile.fullName || mother.name || "Ibu"),
        escapeCsv(mother.email || ""),
        escapeCsv(age),
        escapeCsv(deliveryDateStr),
        escapeCsv(daysPostpartum),
        escapeCsv(riskStr),
        escapeCsv(epdsScoreStr),
        escapeCsv(epdsStatusStr),
        escapeCsv(gad7ScoreStr),
        escapeCsv(gad7StatusStr),
        escapeCsv(mgScoreStr),
        escapeCsv(latestNote),
        escapeCsv(latestNoteDate),
      ];

      csvContent += row.join(",") + "\n";
    }

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="laporan_nifas.csv"',
      },
    });
  } catch (error) {
    console.error("Export Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
