"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeClinicalReviewAction, rejectClinicalReviewAction } from "../actions";

export type InterventionType =
  | "COUNSELING"
  | "EDUCATION"
  | "REFERRAL"
  | "HOME_VISIT"
  | "PSYCHOTHERAPY";

interface ClinicalDecisionFormProps {
  assessmentId: string;
  reviewerPath: "doctor" | "nutritionist";
}

export default function ClinicalDecisionForm({ assessmentId, reviewerPath }: ClinicalDecisionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // State Form
  const [decision, setDecision] = useState("");
  const [note, setNote] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");

  // State Intervensi
  const [selectedInterventions, setSelectedInterventions] = useState<{ type: InterventionType; notes: string }[]>([]);

  // Errors & UI states
  const [decisionError, setDecisionError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"complete" | "reject" | null>(null);

  // Daftar Opsi Intervensi
  const interventionOptions = [
    { type: "COUNSELING" as const, label: "Konseling (Counseling)" },
    { type: "EDUCATION" as const, label: "Edukasi (Education)" },
    { type: "REFERRAL" as const, label: "Rujukan Medis (Referral)" },
    { type: "HOME_VISIT" as const, label: "Kunjungan Rumah (Home Visit)" },
    { type: "PSYCHOTHERAPY" as const, label: "Psikoterapi (Psychotherapy)" },
  ];

  const handleToggleIntervention = (type: InterventionType) => {
    setSelectedInterventions((prev) => {
      const exists = prev.find((item) => item.type === type);
      if (exists) {
        return prev.filter((item) => item.type !== type);
      } else {
        return [...prev, { type, notes: "" }];
      }
    });
  };

  const handleInterventionNoteChange = (type: InterventionType, text: string) => {
    setSelectedInterventions((prev) =>
      prev.map((item) => (item.type === type ? { ...item, notes: text } : item))
    );
  };

  const handleCompleteClick = () => {
    if (decision.trim().length < 5) {
      setDecisionError("Kesimpulan klinis wajib diisi minimal 5 karakter.");
      return;
    }
    setDecisionError("");
    setGeneralError("");
    setConfirmAction("complete");
    setShowConfirm(true);
  };

  const handleRejectClick = () => {
    if (note.trim().length < 5) {
      setGeneralError("Harap tuliskan alasan pengembalian pada kolom Catatan Reviewer (minimal 5 karakter).");
      return;
    }
    setDecisionError("");
    setGeneralError("");
    setConfirmAction("reject");
    setShowConfirm(true);
  };

  const handleExecuteAction = () => {
    startTransition(async () => {
      let res;
      if (confirmAction === "complete") {
        res = await completeClinicalReviewAction({
          assessmentId,
          decision: decision.trim(),
          note: note.trim() || undefined,
          interventions: selectedInterventions,
          followUpDate: followUpDate || undefined,
          followUpNote: followUpNote.trim() || undefined,
        });
      } else {
        res = await rejectClinicalReviewAction(assessmentId, note.trim());
      }

      if (res.success) {
        router.push(`/${reviewerPath}/review`);
        router.refresh();
      } else {
        setGeneralError(res.error || "Gagal memproses review");
        setShowConfirm(false);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Clinical Decision Section */}
      <div className="space-y-3">
        <label htmlFor="clinical-decision" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Kesimpulan Klinis (Clinical Decision) <span className="text-destructive">*</span>
        </label>
        <textarea
          id="clinical-decision"
          rows={3}
          value={decision}
          onChange={(e) => {
            setDecision(e.target.value);
            setDecisionError("");
          }}
          disabled={isPending}
          placeholder="Tulis diagnosa atau kesimpulan medis kualitatif dari hasil kuesioner..."
          className="w-full border border-input rounded-xl px-3.5 py-2.5 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring transition"
        />
        {decisionError && <p className="text-destructive text-xs">{decisionError}</p>}
      </div>

      {/* 2. Clinical Intervention Section */}
      <div className="space-y-3 border-t border-border/60 pt-4">
        <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Intervensi Klinis (Clinical Intervention)
        </span>
        <div className="space-y-3">
          {interventionOptions.map((opt) => {
            const isSelected = selectedInterventions.some((item) => item.type === opt.type);
            const activeInt = selectedInterventions.find((item) => item.type === opt.type);

            return (
              <div key={opt.type} className="border border-border/80 rounded-xl p-3 bg-muted/20 space-y-2">
                <label className="flex items-center gap-3 font-semibold text-sm text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleIntervention(opt.type)}
                    disabled={isPending}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  {opt.label}
                </label>
                {isSelected && (
                  <input
                    type="text"
                    value={activeInt?.notes || ""}
                    onChange={(e) => handleInterventionNoteChange(opt.type, e.target.value)}
                    disabled={isPending}
                    placeholder="Tulis catatan atau detail spesifik instruksi intervensi..."
                    className="w-full border border-input rounded-lg px-3 py-1.5 text-xs bg-background focus:outline-none focus:ring-2 focus:ring-ring transition"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Follow Up Section */}
      <div className="space-y-4 border-t border-border/60 pt-4">
        <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Rencana Tindak Lanjut (Follow Up)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="followup-date" className="text-xs font-medium text-foreground">
              Jadwal Tindak Lanjut
            </label>
            <input
              id="followup-date"
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              disabled={isPending}
              className="w-full border border-input rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="followup-note" className="text-xs font-medium text-foreground">
              Catatan Tindak Lanjut
            </label>
            <input
              id="followup-note"
              type="text"
              value={followUpNote}
              onChange={(e) => setFollowUpNote(e.target.value)}
              disabled={isPending}
              placeholder="Instruksi tambahan rencana tindak lanjut..."
              className="w-full border border-input rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* 4. Reviewer Memo */}
      <div className="space-y-2 border-t border-border/60 pt-4">
        <label htmlFor="reviewer-note" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Catatan Reviewer <span className="text-muted-foreground/80 font-normal lowercase">(wajib jika menolak)</span>
        </label>
        <textarea
          id="reviewer-note"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={isPending}
          placeholder="Memo internal review atau alasan penolakan..."
          className="w-full border border-input rounded-xl px-3 py-2 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring transition"
        />
      </div>

      {generalError && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium rounded-xl">
          {generalError}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleCompleteClick}
          disabled={isPending}
          className="flex-1 bg-primary text-primary-foreground font-semibold py-2.5 rounded-xl hover:opacity-90 active:scale-95 text-xs transition disabled:opacity-50"
        >
          Selesaikan (Complete)
        </button>
        <button
          type="button"
          onClick={handleRejectClick}
          disabled={isPending}
          className="flex-1 bg-destructive/10 border border-destructive/20 text-destructive font-semibold py-2.5 rounded-xl hover:bg-destructive/20 active:scale-95 text-xs transition disabled:opacity-50"
        >
          Kembalikan (Reject)
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-3xl shadow-2xl p-6 max-w-sm w-full space-y-4">
            <h4 className="font-bold text-foreground text-base">
              {confirmAction === "complete" ? "Konfirmasi Selesai" : "Konfirmasi Pengembalian"}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {confirmAction === "complete"
                ? "Anda akan merumuskan keputusan medis ini secara final. Status assessment akan menjadi COMPLETED dan tidak dapat diubah kembali."
                : "Anda akan mengembalikan kuesioner ini kepada Ibu untuk direvisi ulang dari awal."}
            </p>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleExecuteAction}
                disabled={isPending}
                className={`flex-1 font-semibold py-2.5 rounded-xl text-xs text-white transition ${
                  confirmAction === "complete" ? "bg-primary hover:opacity-90" : "bg-destructive hover:opacity-90"
                }`}
              >
                {isPending ? "Memproses..." : "Ya, Lanjutkan"}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="flex-1 border border-border text-foreground font-semibold py-2.5 rounded-xl text-xs hover:bg-muted transition"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
