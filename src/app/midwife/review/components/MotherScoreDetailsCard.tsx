"use client";

import React from "react";
import type { MotherScoreSummary } from "@/modules/midwife/services/scoringAggregator";

interface MotherScoreDetailsCardProps {
  motherName: string;
  scoreSummary?: MotherScoreSummary;
  formatDateShort?: (dateStr: string) => string;
}

export default function MotherScoreDetailsCard({
  motherName,
  scoreSummary,
  formatDateShort = (d) => d,
}: MotherScoreDetailsCardProps) {
  const epdsSlotMap = scoreSummary?.epdsSlotMap || {};
  const magSlotMap = scoreSummary?.magnesiumSlotMap || {};
  const gad7List = scoreSummary?.gad7List || [];
  const moodList = scoreSummary?.moodList || [];

  const getRiskBadge = (
    status: "LOW" | "HIGH" | "URGENT",
    label: string,
    defaultText: string = "—"
  ) => {
    if (!label) return <span className="text-muted-foreground">{defaultText}</span>;
    if (status === "URGENT") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800">
          {label}
        </span>
      );
    }
    if (status === "HIGH") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
          {label}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
        {label}
      </span>
    );
  };

  const getMagRiskBadge = (status: "LOW" | "HIGH" | "URGENT", label: string) => {
    if (status === "URGENT" || label === "Sangat Kurang") {
      return (
        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300">
          {label}
        </span>
      );
    }
    if (status === "HIGH" || label === "Kurang") {
      return (
        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300">
          {label}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300">
        {label}
      </span>
    );
  };

  // Helper render col for Magnesium
  const renderMagnesiumColumn = (startDay: number, endDay: number, title: string) => {
    const days: number[] = [];
    for (let i = startDay; i <= endDay; i++) {
      days.push(i);
    }

    return (
      <div className="bg-card border border-border rounded-xl p-3 flex-1 flex flex-col space-y-2 shadow-xs">
        <div className="pb-1.5 border-b border-border flex items-center justify-between">
          <span className="text-[11px] font-bold text-foreground uppercase tracking-wide">
            {title}
          </span>
          <span className="text-[10px] text-muted-foreground">Hari {startDay}–{endDay}</span>
        </div>

        <div className="divide-y divide-border/60 text-xs flex-1">
          {days.map((day) => {
            const item = magSlotMap[day];
            return (
              <div
                key={`mg-day-${day}`}
                className={`py-1.5 px-1 flex items-center justify-between gap-1 transition-colors ${
                  item ? "hover:bg-muted/40" : "opacity-60"
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-semibold text-foreground text-[11px] whitespace-nowrap">
                    Mg-{day}
                  </span>
                  <span className="text-muted-foreground text-[10px]">SKOR:</span>
                  <span
                    className={`font-mono text-xs font-bold ${
                      item ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item ? `${item.intakeMg} mg` : "—"}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {item ? (
                    getMagRiskBadge(item.riskStatus, item.riskLabel)
                  ) : (
                    <span className="text-[10px] text-muted-foreground/70">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      {/* Patient header strip */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-3.5 py-2.5 bg-muted/40 rounded-xl border border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm">👤</span>
          <span className="text-xs text-muted-foreground">Nama Lengkap Pasien:</span>
          <span className="text-xs font-bold text-foreground">{motherName}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            EPDS:{" "}
            <strong className="text-foreground font-mono">
              {scoreSummary?.epdsList.length || 0}
            </strong>{" "}
            skrining
          </span>
          <span>•</span>
          <span>
            Magnesium:{" "}
            <strong className="text-foreground font-mono">
              {scoreSummary?.magnesiumList.length || 0}
            </strong>{" "}
            hari
          </span>
          <span>•</span>
          <span>
            GAD-7:{" "}
            <strong className="text-foreground font-mono">
              {scoreSummary?.gad7List.length || 0}
            </strong>{" "}
            skrining
          </span>
        </div>
      </div>

      {/* Row 1: EPDS & Magnesium Intake */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* KARTU 1: HASIL SKOR EPDS (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-base text-primary">🧠</span>
              <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">
                HASIL SKOR EPDS
              </h4>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">
              (Pre/Post 14 Hari)
            </span>
          </div>

          <div className="divide-y divide-border/60 text-xs flex-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((seq) => {
              const item = epdsSlotMap[seq];
              const isPre = seq % 2 === 1;

              return (
                <div
                  key={`epds-slot-${seq}`}
                  className={`py-2 px-1 flex flex-col gap-1 transition-colors ${
                    item ? "hover:bg-muted/30" : "opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground text-xs">
                        EPDS-{seq}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {isPre ? "(Pre)" : "(Post)"}
                      </span>
                      <span className="text-muted-foreground text-xs">SKOR :</span>
                      <span
                        className={`font-mono text-sm font-bold ${
                          item ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {item ? item.score : "—"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item ? (
                        getRiskBadge(item.riskStatus, item.riskLabel)
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">
                          Belum ada data
                        </span>
                      )}
                    </div>
                  </div>

                  {item && (
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pl-1">
                      <span>
                        Skor EPDS-3A (Kecemasan):{" "}
                        <strong
                          className={`font-mono ${
                            item.score3A >= 5
                              ? "text-rose-600 dark:text-rose-400 font-bold"
                              : "text-foreground"
                          }`}
                        >
                          {item.score3A}
                        </strong>
                        {item.score3A >= 5 && (
                          <span className="text-[10px] text-rose-500 ml-1 font-semibold">
                            (Cut-off ≥ 5)
                          </span>
                        )}
                      </span>
                      {item.completedAt && (
                        <span className="text-[10px]">
                          {formatDateShort(item.completedAt)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-2.5 bg-muted/30 rounded-xl text-[11px] text-muted-foreground leading-relaxed">
            💡 <strong>Keterangan:</strong> EPDS-1 adalah tes awal (Pre). EPDS-2 adalah evaluasi (Post) setelah menyelesaikan kuis magnesium selama 14 hari berturut-turut.
          </div>
        </div>

        {/* KARTU 2: HASIL SKOR INTAKE MAGNESIUM (7 cols) */}
        <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-base text-primary">🌿</span>
              <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">
                HASIL SKOR INTAKE MAGNESIUM (Mg)
              </h4>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">
              Masa Nifas s/d Hari ke-42
            </span>
          </div>

          {/* 3 Columns Grid for 42 days */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 flex-1">
            {renderMagnesiumColumn(1, 14, "Siklus 1")}
            {renderMagnesiumColumn(15, 28, "Siklus 2")}
            {renderMagnesiumColumn(29, 42, "Siklus 3")}
          </div>

          <div className="p-2.5 bg-muted/30 rounded-xl text-[11px] text-muted-foreground flex items-center justify-between flex-wrap gap-2">
            <span>
              Target AKG Nifas: <strong>320 mg/hari</strong>
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>Cukup (≥100%)</span>
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 ml-1" />
              <span>Kurang</span>
              <span className="inline-block w-2 h-2 rounded-full bg-rose-500 ml-1" />
              <span>Sangat Kurang</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: GAD-7 & Mood Harian */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* KARTU 3: HASIL SKOR GAD-7 */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-base text-primary">🩺</span>
              <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">
                HASIL SKOR GAD-7 (KECEMASAN)
              </h4>
            </div>
            <span className="text-[11px] text-muted-foreground">
              Skor Rentang 0–21
            </span>
          </div>

          {gad7List.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground italic bg-muted/20 rounded-xl border border-dashed border-border">
              Belum ada skrining GAD-7 yang diisi oleh pasien
            </div>
          ) : (
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {gad7List.map((item) => (
                <div
                  key={`gad7-${item.assessmentId}`}
                  className="p-3 bg-muted/20 hover:bg-muted/40 rounded-xl border border-border flex items-center justify-between gap-2 text-xs transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-foreground text-xs">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Tanggal: {item.completedAt ? formatDateShort(item.completedAt) : "—"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground block">
                        TOTAL SKOR
                      </span>
                      <span className="font-mono font-bold text-sm text-primary">
                        {item.score}
                      </span>
                    </div>
                    {getRiskBadge(item.riskStatus, item.riskLabel)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* KARTU 4: MOOD HARIAN IBU NIFAS */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-base text-primary">🌤️</span>
              <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">
                MOOD HARIAN IBU NIFAS
              </h4>
            </div>
            <span className="text-[11px] text-muted-foreground">
              Catatan Emosional Terakhir
            </span>
          </div>

          {moodList.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground italic bg-muted/20 rounded-xl border border-dashed border-border">
              Belum ada riwayat catatan mood harian dari ibu
            </div>
          ) : (
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {moodList.slice(0, 10).map((mood) => (
                <div
                  key={`mood-${mood.id}`}
                  className="p-2.5 bg-muted/20 hover:bg-muted/40 rounded-xl border border-border flex items-center justify-between gap-3 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xl shrink-0">{mood.emoji || "😊"}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-xs truncate">
                        {mood.label || `Mood Skor ${mood.score}`}
                      </p>
                      {mood.note && (
                        <p className="text-[11px] text-muted-foreground truncate italic">
                          &quot;{mood.note}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-bold text-primary block">
                      {mood.score}/5
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDateShort(mood.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

