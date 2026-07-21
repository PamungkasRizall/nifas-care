import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { getAssessmentManifest, getAssessmentQuestions } from "@/modules/assessment/registry";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import AssessmentPlayer from "@/modules/assessment/player/components/Player";
import MagnesiumDiaryForm from "@/app/dashboard/assessment/fill/[assignmentId]/components/MagnesiumDiaryForm";
import ClinicalDecisionForm from "@/modules/review/workspace/components/ClinicalDecisionForm";
import TimelineHistory from "@/modules/review/workspace/components/TimelineHistory";

export const metadata: Metadata = {
  title: "Tinjauan Medis Ibu — Clinical Workspace",
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
          interventions: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export default async function DoctorAssessmentDetailPage({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
}) {
  const { assessmentId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Hanya perbolehkan DOCTOR atau ADMIN
  if (session.user.role !== "DOCTOR" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  const assessment = await getAssessmentDetail(assessmentId);

  if (!assessment) {
    notFound();
  }

  // Hanya boleh melihat jika status sudah disubmit atau selesai ditinjau
  if (assessment.status === "DRAFT" || assessment.status === "SUBMITTED") {
    redirect("/doctor/review");
  }

  const canReview = assessment.status === "UNDER_REVIEW";

  // Ambil manifest secara dinamis
  const manifest = getAssessmentManifest(assessment.type);

  // Pastikan reviewer level 2 sesuai manifest
  if (manifest.level2Reviewer !== "DOCTOR" && session.user.role !== "ADMIN") {
    redirect("/doctor/review");
  }

  const p = assessment.mother.motherProfile;
  const motherName = p?.fullName || assessment.mother.name || "Ibu";

  // Hitung Hari Nifas (postpartum)
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

  // Parsing answers
  const answers: Record<string, any> = {};
  if (assessment.answers && typeof assessment.answers === "object") {
    const rawAnswers = assessment.answers as Record<string, unknown>;
    Object.keys(rawAnswers).forEach((key) => {
      answers[key] = rawAnswers[key];
    });
  }

  // Hitung skor & interpretasi klinis
  const score = await manifest.calculateScore(answers);
  const interpretationResult = await manifest.interpretScore(score, answers);

  // Prioritas peninjauan: jika skor tinggi (HIGH) atau URGENT
  const priorityLabel =
    interpretationResult.riskStatus === "URGENT"
      ? "URGENT"
      : interpretationResult.riskStatus === "HIGH"
      ? "TINGGI"
      : "NORMAL";

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

  // Map timeline reviews
  const reviewsTimeline = assessment.reviews.map((rev) => ({
    id: rev.id,
    reviewerName: rev.reviewer.name || rev.reviewerRole,
    reviewerRole: rev.reviewerRole,
    status: rev.status,
    note: rev.note,
    decision: rev.decision,
    reviewedAt: rev.reviewedAt,
    followUpDate: rev.followUpDate,
    followUpNote: rev.followUpNote,
    interventions: rev.interventions,
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
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 pb-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/doctor/review" className="hover:text-primary transition-colors">
          Antrean Review
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Tinjau {assessment.type}</span>
      </nav>

      {/* Header Info Ibu */}
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-xl">
              {motherName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">{motherName}</h1>
            <p className="text-xs text-muted-foreground">{assessment.mother.email}</p>
          </div>
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <span className="inline-flex items-center bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-xl border border-primary/20">
            Hari ke-{daysPostpartum} Masa Nifas
          </span>
          <span className="inline-flex items-center bg-muted border border-border text-foreground text-xs font-semibold px-3 py-1.5 rounded-xl">
            {assessment.type}
          </span>
          <span
            className={`inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-xl border ${
              priorityLabel === "TINGGI"
                ? "bg-blush-50 border-blush-200 text-blush-700"
                : "bg-sage-50 border-sage-200 text-sage-700"
            }`}
          >
            Prioritas: {priorityLabel}
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

        {/* Kanan: Clinical Decision & Actions Panel (Span 1) */}
        <div className="space-y-6">
          {/* Hasil Assessment Card */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
            <h2 className="font-bold text-foreground text-sm uppercase tracking-wider text-muted-foreground">Analisis Kuesioner</h2>

            <div className="bg-muted/40 border border-border rounded-xl p-4 text-center">
              <span className="text-xs text-muted-foreground block font-medium">Total Skor</span>
              <span className="text-4xl font-extrabold text-foreground mt-1 block tabular-nums">
                {assessment.type === "MAGNESIUM" ? `${score} mg` : score}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-muted-foreground">Interpretasi:</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold border ${
                    interpretationResult.riskStatus === "HIGH"
                      ? "bg-blush-50 border-blush-200 text-blush-700"
                      : "bg-sage-50 border-sage-200 text-sage-700"
                  }`}
                >
                  {interpretationResult.riskStatus === "HIGH" ? "RISIKO TINGGI" : "RISIKO RENDAH"}
                </span>
              </div>
              <div className="bg-muted/20 border border-border/50 rounded-xl p-3.5 text-xs text-foreground/80 leading-relaxed italic">
                "{interpretationResult.interpretation}"
              </div>
            </div>
          </div>

          {/* Form Keputusan & Intervensi */}
          {canReview && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider text-muted-foreground">Tindakan Klinis</h3>
              <ClinicalDecisionForm assessmentId={assessment.id} reviewerPath="doctor" />
            </div>
          )}

          {/* Riwayat Alur Peninjauan */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider text-muted-foreground">Riwayat Alur</h3>
            <TimelineHistory
              reviews={reviewsTimeline}
              submittedAt={assessment.submittedAt}
              motherName={motherName}
            />
          </div>

          {/* Riwayat Mood Harian Ibu */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
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
