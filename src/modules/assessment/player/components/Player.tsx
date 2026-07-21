"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AssessmentPlayerProps } from "../types";

export default function AssessmentPlayer({
  assignmentId,
  title,
  description,
  questions,
  initialAnswers = {},
  onSubmit,
  readOnly = false,
}: AssessmentPlayerProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string | number>>(initialAnswers);
  
  // Jika readOnly, paksa mulai dari tahap Summary (questions.length)
  const [currentStep, setCurrentStep] = useState(readOnly ? questions.length : 0);
  const [isPending, startTransition] = useTransition();

  const isSummaryStep = currentStep === questions.length;
  const isLastQuestionStep = currentStep === questions.length - 1;
  const currentQuestion = questions[currentStep];

  const handleSelectOption = (questionId: string, value: string | number) => {
    if (readOnly) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (readOnly) return;
    // Validasi input di step aktif saat ini sebelum maju
    if (!isSummaryStep) {
      if (answers[currentQuestion.id] === undefined) {
        alert("Harap jawab pertanyaan ini terlebih dahulu.");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, questions.length));
  };

  const handlePrev = () => {
    if (readOnly) return;
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmitAssessment = () => {
    if (readOnly || !onSubmit) return;
    // Pastikan semua pertanyaan telah dijawab
    const unanswered = questions.filter((q) => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      alert(`Masih ada ${unanswered.length} pertanyaan yang belum Anda jawab.`);
      return;
    }

    startTransition(async () => {
      const res = await onSubmit(answers);
      if (res.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        alert(res.message || "Gagal mengirim assessment.");
      }
    });
  };

  const progressPercent = Math.round((Object.keys(answers).length / questions.length) * 100);

  return (
    <div className="max-w-2xl mx-auto bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">{title}</h1>
        {description && <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>}
      </div>

      {/* Progress Bar (Sembunyikan jika readOnly) */}
      {!readOnly && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress Pengisian</span>
            <span>{Object.keys(answers).length} dari {questions.length} Pertanyaan ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}

      {/* Question Card / Summary */}
      {!isSummaryStep ? (
        <div className="space-y-6 pt-4">
          <div className="bg-muted/30 border border-border/50 rounded-2xl p-5 md:p-6 space-y-2">
            <span className="inline-block text-xs font-bold text-primary uppercase tracking-wider">Pertanyaan {currentStep + 1}</span>
            <p className="text-base md:text-lg font-semibold text-foreground leading-relaxed">{currentQuestion.text}</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = answers[currentQuestion.id] === opt.value;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(currentQuestion.id, opt.value)}
                  disabled={readOnly}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary shadow-sm"
                      : "bg-card border-border hover:bg-muted/40 text-foreground/80"
                  }`}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Summary Step */
        <div className="space-y-6 pt-4">
          <div className="bg-muted/30 border border-border/50 rounded-2xl p-5 text-center space-y-1">
            <h2 className="font-bold text-foreground text-base">
              {readOnly ? "Jawaban Ibu" : "Konfirmasi Jawaban"}
            </h2>
            {!readOnly && <p className="text-xs text-muted-foreground">Silakan periksa kembali jawaban Anda sebelum mengirim.</p>}
          </div>

          <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden bg-card">
            {questions.map((q, idx) => {
              const answerValue = answers[q.id];
              const selectedOption = q.options.find((o) => o.value === answerValue);
              return (
                <div key={q.id} className="p-4 flex flex-col md:flex-row md:items-start justify-between gap-3 text-sm hover:bg-muted/10 transition-colors">
                  <div className="space-y-1 max-w-[85%]">
                    <p className="font-semibold text-foreground">{idx + 1}. {q.text}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-primary font-medium">{selectedOption?.text || "Belum Dijawab"}</p>
                      {readOnly && selectedOption?.score !== undefined && (
                        <span className="inline-flex items-center bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-md border border-primary/20">
                          Skor: {selectedOption.score}
                        </span>
                      )}
                    </div>
                  </div>
                  {!readOnly && (
                    <button
                      onClick={() => setCurrentStep(idx)}
                      className="text-xs text-primary font-bold hover:underline shrink-0 md:mt-0.5"
                    >
                      Ubah
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Buttons (Sembunyikan sepenuhnya jika readOnly) */}
      {!readOnly && (
        <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="border border-border text-foreground font-semibold px-5 py-2.5 rounded-xl hover:bg-muted text-sm disabled:opacity-40 transition"
          >
            Kembali
          </button>

          {!isSummaryStep ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 text-sm transition"
            >
              {isLastQuestionStep ? "Lihat Ringkasan" : "Lanjut"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitAssessment}
              disabled={isPending}
              className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 text-sm transition disabled:opacity-50"
            >
              {isPending ? "Mengirim..." : "Kirim Jawaban"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
