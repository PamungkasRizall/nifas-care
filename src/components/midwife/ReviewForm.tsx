"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveMother, returnMother } from "@/app/midwife/actions";

interface ReviewFormProps {
  motherUserId: string;
  motherName: string;
}

export default function ReviewForm({ motherUserId, motherName }: ReviewFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [action, setAction] = useState<"approve" | "return" | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleApprove = () => {
    setAction("approve");
    setNoteError("");
    setGeneralError("");
    setShowConfirm(true);
  };

  const handleReturn = () => {
    if (note.trim().length < 5) {
      setNoteError("Catatan wajib diisi minimal 5 karakter");
      return;
    }
    setAction("return");
    setNoteError("");
    setGeneralError("");
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    startTransition(async () => {
      let result;
      if (action === "approve") {
        result = await approveMother(motherUserId, note.trim() || undefined);
      } else {
        result = await returnMother(motherUserId, note.trim());
      }

      if (result.success) {
        router.push("/midwife/verifikasi");
        router.refresh();
      } else {
        setGeneralError(result.error);
        setShowConfirm(false);
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Catatan Bidan */}
      <div>
        <label
          htmlFor="midwife-note"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          Catatan Bidan
          <span className="text-muted-foreground ml-1 font-normal">
            (wajib saat mengembalikan)
          </span>
        </label>
        <textarea
          id="midwife-note"
          rows={4}
          className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring transition"
          placeholder="Contoh: Nomor telepon belum lengkap. Tanggal persalinan belum sesuai."
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setNoteError("");
          }}
          disabled={isPending}
        />
        {noteError && (
          <p className="text-destructive text-xs mt-1">{noteError}</p>
        )}
      </div>

      {generalError && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-4 py-3 text-sm">
          {generalError}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          id="btn-approve"
          type="button"
          onClick={handleApprove}
          disabled={isPending}
          className="flex-1 min-w-[140px] bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-xl hover:opacity-90 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✓ Setujui Data
        </button>
        <button
          id="btn-return"
          type="button"
          onClick={handleReturn}
          disabled={isPending}
          className="flex-1 min-w-[140px] bg-destructive/10 border border-destructive/30 text-destructive font-semibold py-3 px-6 rounded-xl hover:bg-destructive/20 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ↩ Kembalikan
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl shadow-2xl p-6 max-w-md w-full space-y-4 border border-border">
            <h2 className="text-lg font-bold text-foreground">
              {action === "approve" ? "Konfirmasi Persetujuan" : "Konfirmasi Pengembalian"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {action === "approve"
                ? `Anda akan menyetujui data ${motherName}. Status akan berubah menjadi ACTIVE dan Ibu dapat mengakses seluruh fitur aplikasi.`
                : `Anda akan mengembalikan data ${motherName} untuk diperbaiki. Ibu akan diminta mengisi ulang data onboarding.`}
            </p>
            {note.trim() && (
              <div className="bg-muted rounded-xl px-4 py-3 text-sm">
                <p className="text-xs font-medium text-muted-foreground mb-1">Catatan:</p>
                <p className="text-foreground">{note}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                id="btn-confirm-action"
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className={`flex-1 font-semibold py-2.5 px-4 rounded-xl transition disabled:opacity-50 ${
                  action === "approve"
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-destructive text-white hover:opacity-90"
                }`}
              >
                {isPending ? "Memproses..." : "Ya, Konfirmasi"}
              </button>
              <button
                id="btn-cancel-confirm"
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="flex-1 border border-border text-foreground font-semibold py-2.5 px-4 rounded-xl hover:bg-muted transition disabled:opacity-50"
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
