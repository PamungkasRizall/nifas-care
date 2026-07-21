import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import AssessmentPlayer from "@/modules/assessment/player/components/Player";
import {
  getAssessmentManifest,
  getAssessmentQuestions,
} from "@/modules/assessment/registry";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { submitAssessmentPlayerAction } from "../../actions";
import MagnesiumDiaryForm from "./components/MagnesiumDiaryForm";

export const metadata: Metadata = {
  title: "Pengisian Assessment — Nifas Care",
  robots: { index: false, follow: false },
};

export default async function AssessmentFillPage({
  params,
}: {
  params: Promise<{ assignmentId: string }>;
}) {
  const { assignmentId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Ambil data assignment
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
  });

  if (!assignment || assignment.motherId !== session.user.id) {
    notFound();
  }

  const isReadOnly =
    assignment.status === "SUBMITTED" || assignment.status === "COMPLETED";

  // Ambil manifest skrining yang terdaftar di Registry secara dinamis sesuai tipe assignment
  const manifest = getAssessmentManifest(assignment.type);

  // Konversi format pertanyaan manifest ke format generik Player
  const dbQuestions = await getAssessmentQuestions(assignment.type);
  const genericQuestions = dbQuestions.map((q) => ({
    id: q.id,
    text: q.text,
    options: q.options.map((opt, idx) => ({
      text: opt.text,
      value: idx, // Gunakan index sebagai value string/number
      score: opt.score, // Include score for readOnly view
    })),
  }));

  let initialAnswers: Record<string, string | number> = {};
  let score = 0;
  let interpretationResult: any = null;
  let reviews: any[] = [];

  if (isReadOnly) {
    const dbAssessment = await prisma.assessment.findFirst({
      where: { assignmentId },
      orderBy: { createdAt: "desc" },
      include: {
        reviews: {
          include: {
            reviewer: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (dbAssessment) {
      initialAnswers =
        (dbAssessment.answers as Record<string, string | number>) || {};
      score = await manifest.calculateScore(initialAnswers);
      interpretationResult = await manifest.interpretScore(
        score,
        initialAnswers,
      );
      reviews = dbAssessment.reviews;
    }
  }

  // Load food categories if type is MAGNESIUM
  let categories: any[] = [];
  let magnesiumTarget = 320;
  if (assignment.type === "MAGNESIUM") {
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

  const handleSubmit = async (answers: Record<string, string | number>) => {
    "use server";
    const res = await submitAssessmentPlayerAction(assignmentId, answers);
    return { success: res.success, message: res.error };
  };

  // Wrapper for Magnesium form submit
  const handleMagnesiumSubmit = async (answers: {
    items: Array<{ foodId: string; servingId: string; qty: number }>;
  }) => {
    "use server";
    // Convert to the standard Record<string, any> for answers JSON column
    const res = await submitAssessmentPlayerAction(
      assignmentId,
      answers as any,
    );
    return { success: res.success, message: res.error };
  };

  if (isReadOnly) {
    const priorityLabel =
      interpretationResult?.riskStatus === "URGENT"
        ? "URGENT"
        : interpretationResult?.riskStatus === "HIGH"
          ? "RISIKO TINGGI"
          : "RISIKO RENDAH";

    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 pb-16">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {assignment.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tugas pemantauan nifas telah diselesaikan. Berikut adalah ringkasan
            hasil dan riwayat peninjauan oleh tenaga kesehatan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kiri: Read Only player atau Magnesium log */}
          <div className="lg:col-span-2">
            {assignment.type === "MAGNESIUM" ? (
              <MagnesiumDiaryForm
                assignmentId={assignmentId}
                categories={categories}
                target={magnesiumTarget}
                initialItems={initialAnswers?.items as any}
                readOnly={true}
                onSubmit={handleMagnesiumSubmit}
              />
            ) : (
              <AssessmentPlayer
                assignmentId={assignmentId}
                title={assignment.title}
                questions={genericQuestions}
                initialAnswers={initialAnswers}
                readOnly={true}
              />
            )}
          </div>

          {/* Kanan: Skor & Review dari nakes */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
              <h2 className="font-bold text-foreground text-sm uppercase tracking-wider text-muted-foreground">
                Hasil Analisis
              </h2>

              <div className="bg-muted/40 border border-border rounded-xl p-4 text-center">
                <span className="text-xs text-muted-foreground block font-medium">
                  Total Skor
                </span>
                <span className="text-4xl font-extrabold text-foreground mt-1 block">
                  {assignment.type === "MAGNESIUM" ? `${score} mg` : score}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-medium text-muted-foreground">
                    Status Risiko:
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold border text-xs ${
                      interpretationResult?.riskStatus === "URGENT"
                        ? "bg-blush-50 border-blush-200 text-blush-700 animate-pulse"
                        : interpretationResult?.riskStatus === "HIGH"
                          ? "bg-amber-50 border-amber-200 text-amber-700"
                          : "bg-sage-50 border-sage-200 text-sage-700"
                    }`}
                  >
                    {priorityLabel}
                  </span>
                </div>
                {interpretationResult?.interpretation && (
                  <div className="bg-muted/20 border border-border/50 rounded-xl p-3.5 text-xs text-foreground/80 leading-relaxed italic">
                    "{interpretationResult.interpretation}"
                  </div>
                )}
              </div>
            </div>

            {/* Healthcare Reviews */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider text-muted-foreground">
                Review Tenaga Kesehatan
              </h3>
              {reviews.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  Menunggu peninjauan oleh Bidan...
                </p>
              ) : (
                <div className="space-y-3.5">
                  {reviews.map((rev) => (
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
                          {rev.status === "APPROVED"
                            ? "Disetujui"
                            : "Perlu Perbaikan"}
                        </span>
                      </div>
                      {rev.note && (
                        <p className="text-muted-foreground mt-1.5 italic bg-muted/30 rounded px-2.5 py-1.5">
                          "{rev.note}"
                        </p>
                      )}
                      {rev.decision && (
                        <div className="mt-2 bg-primary/5 border border-primary/10 rounded p-2 text-[11px]">
                          <span className="font-semibold text-primary block">
                            Rekomendasi Klinis:
                          </span>
                          <span className="text-foreground/90 mt-0.5 block">
                            {rev.decision}
                          </span>
                        </div>
                      )}
                      <span className="text-[10px] text-muted-foreground/80 mt-1.5 block">
                        {new Intl.DateTimeFormat("id-ID", {
                          dateStyle: "short",
                          timeStyle: "short",
                        }).format(new Date(rev.reviewedAt))}
                      </span>
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

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {assignment.type === "MAGNESIUM" ? (
        <MagnesiumDiaryForm
          assignmentId={assignmentId}
          categories={categories}
          target={magnesiumTarget}
          onSubmit={handleMagnesiumSubmit}
        />
      ) : (
        <AssessmentPlayer
          assignmentId={assignmentId}
          title={assignment.title}
          description="Harap pilih jawaban yang paling sesuai dengan kondisi Anda dalam 14 hari terakhir."
          questions={genericQuestions}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
