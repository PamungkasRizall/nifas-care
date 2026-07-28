"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { midwifeApproveAction, midwifeRejectAction } from "@/modules/midwife/actions";

interface ReviewActionsFormProps {
  assessmentId: string;
}

export default function ReviewActionsForm({ assessmentId }: ReviewActionsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleApproveClick = () => {
    setAction("approve");
    setNoteError("");
    setGeneralError("");
    setShowConfirm(true);
  };

  const handleRejectClick = () => {
    if (note.trim().length < 5) {
      setNoteError("Catatan penolakan wajib diisi minimal 5 karakter.");
      return;
    }
    setAction("reject");
    setNoteError("");
    setGeneralError("");
    setShowConfirm(true);
  };

  const handleConfirmAction = () => {
    startTransition(async () => {
      let result;
      if (action === "approve") {
        result = await midwifeApproveAction(assessmentId, note.trim() || undefined);
      } else {
        result = await midwifeRejectAction(assessmentId, note.trim());
      }

      if (result.success) {
        router.push("/midwife/review");
        router.refresh();
      } else {
        setGeneralError(result.error || "Gagal memproses review");
        setShowConfirm(false);
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Input Catatan */}
      <div>
        <label htmlFor="review-note" className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
          Catatan Reviewer
          <span className="font-normal text-muted-foreground/80 lowercase ml-1">(wajib saat menolak)</span>
        </label>
        <textarea
          id="review-note"
          rows={3}
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setNoteError("");
          }}
          disabled={isPending}
          placeholder="Tulis instruksi tambahan atau alasan pengembalian kuesioner..."
          className="w-full border border-input rounded-xl px-3 py-2 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring transition"
        />
        {noteError && <p className="text-destructive text-xs mt-1">{noteError}</p>}
      </div>

      {generalError && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium rounded-xl">
          {generalError}
        </div>
      )}

      {/* Button Decisions */}
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={handleApproveClick}
          disabled={isPending}
          className="flex-1 bg-primary text-primary-foreground font-semibold py-2.5 rounded-xl hover:opacity-90 active:scale-95 text-xs transition disabled:opacity-50"
        >
          Setujui (Approve)
        </button>
        <button
          type="button"
          onClick={handleRejectClick}
          disabled={isPending}
          className="hidden flex-1 bg-destructive/10 border border-destructive/20 text-destructive font-semibold py-2.5 rounded-xl hover:bg-destructive/20 active:scale-95 text-xs transition disabled:opacity-50"
        >
          Tolak (Reject)
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-3xl shadow-2xl p-6 max-w-sm w-full space-y-4">
            <h4 className="font-bold text-foreground text-base">
              {action === "approve" ? "Konfirmasi Persetujuan" : "Konfirmasi Penolakan"}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {action === "approve"
                ? "Anda akan menyetujui assessment ini dan melanjutkannya ke review tingkat kedua (Dokter/Ahli Gizi)."
                : "Anda akan mengembalikan kuesioner ini ke Ibu untuk diisi ulang dengan catatan koreksi."}
            </p>
            {note.trim() && (
              <div className="bg-muted/40 rounded-xl p-3 text-xs">
                <span className="block font-semibold text-muted-foreground mb-1">Catatan Anda:</span>
                <p className="text-foreground italic">"{note}"</p>
              </div>
            )}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={isPending}
                className={`flex-1 font-semibold py-2.5 rounded-xl text-xs text-white transition ${
                  action === "approve" ? "bg-primary hover:opacity-90" : "bg-destructive hover:opacity-90"
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
