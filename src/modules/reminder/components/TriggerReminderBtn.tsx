"use client";

import { useState, useTransition } from "react";
import { triggerReminderEngineAction } from "../actions";

export default function TriggerReminderBtn() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  const handleTrigger = () => {
    setResult(null);
    startTransition(async () => {
      const res = await triggerReminderEngineAction();
      if (res.success) {
        setResult(`Sukses: ${res.count} notifikasi baru dipicu.`);
      } else {
        setResult(`Gagal: ${res.error}`);
      }
    });
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
      <div>
        <h4 className="text-sm font-bold text-foreground">Simulasi Reminder Engine</h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          Jalankan pemindaian status tugas & batas waktu kuesioner saat ini secara instan.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          id="btn-trigger-reminder"
          type="button"
          onClick={handleTrigger}
          disabled={isPending}
          className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition disabled:opacity-50"
        >
          {isPending ? "Memindai..." : "Jalankan Simulasi"}
        </button>

        {result && (
          <span className="text-xs font-medium text-foreground bg-muted px-2.5 py-1.5 rounded-lg border border-border">
            {result}
          </span>
        )}
      </div>
    </div>
  );
}
