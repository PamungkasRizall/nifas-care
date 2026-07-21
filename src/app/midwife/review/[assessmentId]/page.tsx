import MagnesiumDiaryForm from "@/app/dashboard/assessment/fill/[assignmentId]/components/MagnesiumDiaryForm";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import AssessmentPlayer from "@/modules/assessment/player/components/Player";
import {
  getAssessmentManifest,
  getAssessmentQuestions,
} from "@/modules/assessment/registry";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ReviewActionsForm from "./ReviewActionsForm";

export const metadata: Metadata = {
  title: "Tinjau Assessment Ibu — Portal Bidan",
  robots: { index: false, follow: false },
};

async function getAssessmentDetail(assessmentId: string) {
  return prisma.assessment.findUnique({
    where: { id: assessmentId },
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

export default async function MidwifeAssessmentDetailPage({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
}) {
  const { assessmentId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Hanya perbolehkan MIDWIFE atau ADMIN
  if (session.user.role !== "MIDWIFE" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  const assessment = await getAssessmentDetail(assessmentId);
  console.log(assessment);
  if (!assessment) {
    notFound();
  }

  // Bidan hanya boleh melihat detail jika status sudah disubmit atau selesai ditinjau
  if (assessment.status === "DRAFT") {
    redirect("/midwife/review");
  }

  const canReview = assessment.status === "SUBMITTED";

  const p = assessment.mother.motherProfile;
  const motherName = p?.fullName || assessment.mother.name || "Ibu";

  // Hitung Hari Nifas (Hari postpartum)
  let daysPostpartum = 0;
  if (p?.deliveryDate) {
    const delivery = new Date(p.deliveryDate);
    const today = new Date();
    delivery.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(today.getTime() - delivery.getTime());
    daysPostpartum = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  // Fetch daily mood history
  const moods = await prisma.dailyMood.findMany({
    where: { motherId: assessment.motherId },
    orderBy: { date: "desc" },
    take: 7,
  });

  // Ambil data manifest secara dinamis dari Registry sesuai type assessment
  const manifest = getAssessmentManifest(assessment.type);

  // Parsing answers JSON ke tipe data record answers
  const answers: Record<string, any> = {};
  if (assessment.answers && typeof assessment.answers === "object") {
    const rawAnswers = assessment.answers as Record<string, unknown>;
    Object.keys(rawAnswers).forEach((key) => {
      answers[key] = rawAnswers[key];
    });
  }

  // Hitung skor & interpretasi menggunakan logic manifest secara dinamis
  const score = await manifest.calculateScore(answers);
  const interpretationResult = await manifest.interpretScore(score, answers);

  // Konversi format pertanyaan manifest ke format generik Player
  const dbQuestions = await getAssessmentQuestions(assessment.type);
  const genericQuestions = dbQuestions.map((q) => ({
    id: q.id,
    text: q.text,
    options: q.options.map((opt, idx) => ({
      text: opt.text,
      value: idx,
      score: opt.score,
    })),
  }));

  // Load food categories if type is MAGNESIUM
  let categories: any[] = [];
  let magnesiumTarget = 320;
  if (assessment.type === "MAGNESIUM") {
    categories = await prisma.foodCategory.findMany({
      include: {
        foods: {
          where: { isActive: true },
          include: {
            servings: true,
          },
        },
      },
    });

    const targetObj = await prisma.magnesiumTarget.findFirst({
      where: { isActive: true },
    });
    if (targetObj) {
      magnesiumTarget = targetObj.target;
    }
  }

  // Wrapper for Magnesium form submit (unused in readOnly mode, but required by type contract)
  const handleMagnesiumSubmit = async () => {
    "use server";
    return { success: true };
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 pb-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/midwife/review"
          className="hover:text-primary transition-colors"
        >
          Antrean Review
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">
          Tinjau {assessment.type}
        </span>
      </nav>

      {/* Header Info Ibu */}
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-xl">
              {motherName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">{motherName}</h1>
            <p className="text-xs text-muted-foreground">
              {assessment.mother.email}
            </p>
          </div>
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <span className="inline-flex items-center bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-xl border border-primary/20">
            Hari ke-{daysPostpartum} Masa Nifas
          </span>
          <span className="inline-flex items-center bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-xl">
            {assessment.type}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kiri: Read Only Player (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {assessment.type === "MAGNESIUM" ? (
            <MagnesiumDiaryForm
              assignmentId={assessment.id}
              categories={categories}
              target={magnesiumTarget}
              initialItems={answers?.items as any}
              readOnly={true}
              onSubmit={handleMagnesiumSubmit}
            />
          ) : (
            <AssessmentPlayer
              assignmentId={assessment.id}
              title={manifest.title}
              questions={genericQuestions}
              initialAnswers={answers}
              readOnly={true}
            />
          )}
        </div>

        {/* Kanan: Hasil Kalkulasi & Form Keputusan Review (Span 1) */}
        <div className="space-y-6">
          {/* Skor & Interpretasi Card */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-foreground text-sm uppercase tracking-wider text-muted-foreground">
              Hasil Assessment
            </h2>

            <div className="bg-muted/40 border border-border rounded-xl p-4 text-center">
              <span className="text-xs text-muted-foreground block font-medium">
                Total Skor
              </span>
              <span className="text-4xl font-extrabold text-foreground mt-1 block tabular-nums">
                {assessment.type === "MAGNESIUM" ? `${score} mg` : score}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-muted-foreground">
                  Status Risiko:
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-xs border ${
                    interpretationResult.riskStatus === "URGENT"
                      ? "bg-red-100 border-red-300 text-red-800 animate-pulse shadow-sm" // Merah pekat & kontras tinggi
                      : interpretationResult.riskStatus === "HIGH"
                        ? "bg-amber-50 border-amber-200 text-amber-700"
                        : "bg-emerald-50 border-emerald-200 text-emerald-700" // Pengganti sage agar hijau terdeteksi
                  }`}
                >
                  {interpretationResult.riskStatus === "URGENT"
                    ? "URGENT/SEGERA"
                    : interpretationResult.riskStatus === "HIGH"
                      ? "RISIKO TINGGI"
                      : "RISIKO RENDAH"}
                </span>
              </div>
              <div className="bg-muted/20 border border-border/50 rounded-xl p-3.5 text-xs text-foreground/80 leading-relaxed italic">
                "{interpretationResult.interpretation}"
              </div>
            </div>
          </div>

          {/* Form Keputusan Review */}
          {canReview && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider text-muted-foreground">
                Tindakan Review
              </h3>
              <ReviewActionsForm assessmentId={assessment.id} />
            </div>
          )}

          {/* Riwayat Review */}
          {assessment.reviews.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider text-muted-foreground">
                Riwayat Review
              </h3>
              <div className="space-y-3.5">
                {assessment.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="text-xs border-b border-border last:border-0 pb-3 last:pb-0"
                  >
                    <div className="flex items-center justify-between gap-2 font-semibold">
                      <span className="text-foreground">
                        {rev.reviewer.name || rev.reviewerRole}
                      </span>
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded ${
                          rev.status === "APPROVED"
                            ? "bg-sage-100 text-sage-800"
                            : "bg-blush-100 text-blush-800"
                        }`}
                      >
                        {rev.status === "APPROVED" ? "Approved" : "Returned"}
                      </span>
                    </div>
                    {rev.note && (
                      <p className="text-muted-foreground mt-1.5 italic bg-muted/30 rounded px-2.5 py-1.5">
                        "{rev.note}"
                      </p>
                    )}
                    <span className="text-[10px] text-muted-foreground/80 mt-1 block">
                      {new Intl.DateTimeFormat("id-ID", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(new Date(rev.reviewedAt))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Riwayat Mood Harian Ibu */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider text-muted-foreground">
              Mood Harian Ibu (7 Hari Terakhir)
            </h3>
            {moods.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Belum ada catatan mood harian.</p>
            ) : (
              <div className="space-y-3">
                {moods.map((m) => (
                  <div key={m.id} className="flex items-start gap-2.5 text-xs border-b border-border/50 pb-2.5 last:border-0 last:pb-0">
                    <span className="text-2xl shrink-0" role="img" aria-label={m.label}>{m.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-foreground">{m.label}</span>
                        <span className="text-[10px] text-muted-foreground tabular-nums">
                          {new Intl.DateTimeFormat("id-ID", { dateStyle: "short" }).format(new Date(m.date))}
                        </span>
                      </div>
                      {m.note && <p className="text-muted-foreground mt-0.5 italic">&ldquo;{m.note}&rdquo;</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
