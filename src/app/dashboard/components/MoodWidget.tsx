"use client";

import React, { useState, useTransition } from "react";
import { saveDailyMoodAction } from "@/modules/mood/actions";

const MOODS = [
  { score: 5, emoji: "😄", label: "Sangat Bahagia" },
  { score: 4, emoji: "🙂", label: "Bahagia" },
  { score: 3, emoji: "😐", label: "Biasa Saja" },
  { score: 2, emoji: "😔", label: "Sedih" },
  { score: 1, emoji: "😭", label: "Sangat Sedih" },
];

interface MoodWidgetProps {
  initialMood?: {
    score: number;
    emoji: string;
    label: string;
    note: string | null;
  } | null;
  streak: number;
  averageThisWeek: number;
}

export default function MoodWidget({ initialMood, streak, averageThisWeek }: MoodWidgetProps) {
  const [selectedScore, setSelectedScore] = useState<number | null>(initialMood?.score ?? null);
  const [note, setNote] = useState<string>(initialMood?.note ?? "");
  const [isEditing, setIsEditing] = useState<boolean>(!initialMood);
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSave = () => {
    if (selectedScore === null) return;
    startTransition(async () => {
      try {
        await saveDailyMoodAction(selectedScore, note);
        setSuccessMsg("Catatan mood berhasil disimpan!");
        setIsEditing(false);
        setTimeout(() => setSuccessMsg(null), 3000);
      } catch (err) {
        console.error(err);
        alert("Gagal menyimpan mood. Silakan coba lagi.");
      }
    });
  };

  const activeMoodDetail = MOODS.find((m) => m.score === selectedScore);

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Mood Tracker Harian</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Catat dan pantau kondisi emosional Ibu pasca melahirkan.
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4 items-center text-xs">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl px-3 py-1.5 text-center">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Streak</span>
            <span className="font-extrabold text-amber-700 dark:text-amber-400 tabular-nums">🔥 {streak} Hari</span>
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded-xl px-3 py-1.5 text-center">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Rata-rata</span>
            <span className="font-extrabold text-primary tabular-nums">⭐ {averageThisWeek}</span>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-5">
          <p className="text-sm font-bold text-foreground text-center">
            Bagaimana perasaan Ibu hari ini?
          </p>
          
          {/* Emoji List Selection */}
          <div className="flex justify-around items-center gap-2 max-w-md mx-auto py-2">
            {MOODS.map((m) => {
              const isSelected = selectedScore === m.score;
              return (
                <button
                  key={m.score}
                  type="button"
                  onClick={() => setSelectedScore(m.score)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-300 ${
                    isSelected
                      ? "bg-primary/15 border-2 border-primary scale-110 shadow-sm"
                      : "hover:bg-muted hover:scale-105 border border-transparent"
                  }`}
                >
                  <span className="text-4xl" role="img" aria-label={m.label}>
                    {m.emoji}
                  </span>
                  <span className={`text-[10px] font-bold ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                    {m.label.split(" ")[0]} {/* Shorten label for layout */}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Optional Note textarea */}
          <div className="space-y-1.5 max-w-md mx-auto">
            <label htmlFor="mood-note" className="text-xs font-bold text-muted-foreground">
              Catatan Hari Ini (Opsional)
            </label>
            <textarea
              id="mood-note"
              placeholder="Tuliskan keluhan, perasaan, atau catatan harian Ibu di sini..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px] resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 max-w-md mx-auto">
            {!isEditing && initialMood && (
              <button
                type="button"
                onClick={() => {
                  setSelectedScore(initialMood.score);
                  setNote(initialMood.note ?? "");
                  setIsEditing(false);
                }}
                className="px-4 py-2 border border-border text-xs font-semibold rounded-xl hover:bg-muted transition"
              >
                Batal
              </button>
            )}
            <button
              type="button"
              disabled={selectedScore === null || isPending}
              onClick={handleSave}
              className="bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground text-xs font-semibold px-5 py-2 rounded-xl transition"
            >
              {isPending ? "Menyimpan..." : "Simpan Mood"}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-muted/30 border border-border/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-5xl" role="img" aria-label={activeMoodDetail?.label}>
              {activeMoodDetail?.emoji}
            </span>
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Mood Ibu Hari Ini</p>
              <p className="text-base font-bold text-foreground mt-0.5">
                {activeMoodDetail?.label}
              </p>
              {note && (
                <p className="text-xs text-muted-foreground mt-1 italic">
                  &ldquo;{note}&rdquo;
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="border border-border hover:bg-muted text-foreground text-xs font-semibold px-4 py-2 rounded-xl transition whitespace-nowrap shrink-0"
          >
            Ubah Catatan
          </button>
        </div>
      )}

      {successMsg && (
        <div className="bg-sage-50 border border-sage-200 text-sage-800 text-xs px-4 py-2.5 rounded-xl text-center font-bold">
          {successMsg}
        </div>
      )}
    </div>
  );
}
