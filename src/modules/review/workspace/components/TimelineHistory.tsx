interface TimelineItem {
  id: string;
  reviewerName: string;
  reviewerRole: string;
  status: string;
  note: string | null;
  decision: string | null;
  reviewedAt: Date;
  followUpDate: Date | null;
  followUpNote: string | null;
  interventions?: { id: string; type: string; notes: string | null }[];
}

interface TimelineHistoryProps {
  reviews: TimelineItem[];
  submittedAt: Date | null;
  motherName: string;
}

export default function TimelineHistory({ reviews, submittedAt, motherName }: TimelineHistoryProps) {
  return (
    <div className="relative pl-6 border-l border-border/80 space-y-6 ml-2 py-2">
      {/* 1. Log Pengiriman Ibu */}
      {submittedAt && (
        <div className="relative">
          <span className="absolute -left-[30px] top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-bold text-foreground">{motherName} (Ibu)</span>
              <span className="text-muted-foreground">
                {new Intl.DateTimeFormat("id-ID", { dateStyle: "short", timeStyle: "short" }).format(new Date(submittedAt))}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">Mengirimkan respons jawaban screening.</p>
          </div>
        </div>
      )}

      {/* 2. Log Riwayat Review */}
      {reviews.map((rev) => {
        const isApproved = rev.status === "APPROVED";
        const roleLabel = rev.reviewerRole === "MIDWIFE" 
          ? "Bidan" 
          : rev.reviewerRole === "DOCTOR" 
            ? "Dokter" 
            : rev.reviewerRole === "NUTRITIONIST" 
              ? "Ahli Gizi" 
              : "Admin";

        return (
          <div key={rev.id} className="relative">
            {/* Titik Alur */}
            <span className={`absolute -left-[30px] top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full border ${
              isApproved ? "border-sage-300 bg-sage-50" : "border-blush-300 bg-blush-50"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isApproved ? "bg-sage-600" : "bg-blush-600"}`} />
            </span>

            {/* Konten */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-foreground">{rev.reviewerName}</span>
                  <span className="ml-1.5 text-[10px] font-bold px-1 py-0.2 bg-muted text-muted-foreground rounded">
                    {roleLabel}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {new Intl.DateTimeFormat("id-ID", { dateStyle: "short", timeStyle: "short" }).format(new Date(rev.reviewedAt))}
                </span>
              </div>
              <p className="text-xs font-semibold text-foreground">
                {isApproved ? "Menyetujui (Approved)" : "Mengembalikan (Returned)"}
              </p>

              {rev.note && (
                <p className="text-xs text-muted-foreground italic bg-muted/40 rounded px-2 py-1">
                  Memo: "{rev.note}"
                </p>
              )}

              {/* Tampilkan Keputusan Medis tingkat 2 */}
              {rev.decision && (
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-2.5 space-y-1 text-xs">
                  <span className="font-semibold text-primary block">Keputusan Klinis:</span>
                  <p className="text-foreground/80">"{rev.decision}"</p>
                </div>
              )}

              {/* Tampilkan intervensi tingkat 2 jika ada */}
              {rev.interventions && rev.interventions.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Intervensi Medis:</span>
                  <div className="flex flex-col gap-1">
                    {rev.interventions.map((int) => (
                      <div key={int.id} className="text-xs bg-muted/30 border border-border/50 rounded-lg p-1.5">
                        <span className="font-semibold text-foreground block">{int.type}</span>
                        {int.notes && <p className="text-muted-foreground mt-0.5">Note: {int.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tampilkan follow up tingkat 2 jika ada */}
              {rev.followUpDate && (
                <div className="text-xs bg-amber-50/50 border border-amber-200/50 rounded-xl p-2 text-foreground/80 flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-amber-600 mt-0.5 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <div>
                    <span className="font-semibold text-amber-800">Tindak Lanjut:</span>{" "}
                    {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(rev.followUpDate))}
                    {rev.followUpNote && <p className="text-muted-foreground text-[11px] mt-0.5">{rev.followUpNote}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
