import type { HealthNote } from "@/modules/mother/dashboard/types";

interface ReviewNotesProps {
  notes: HealthNote[];
}

export default function ReviewNotes({ notes }: ReviewNotesProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-6 bg-muted/20 border border-dashed border-border rounded-xl">
        <p className="text-xs text-muted-foreground">Belum ada catatan dari bidan atau dokter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => {
        const roleColors = {
          MIDWIFE: "bg-sage-100 text-sage-800",
          DOCTOR: "bg-primary/10 text-primary",
          NUTRITIONIST: "bg-amber-100 text-amber-800",
          ADMIN: "bg-muted text-foreground",
        };

        const roleColor = roleColors[note.authorRole as keyof typeof roleColors] || "bg-muted text-foreground";
        const roleLabel = note.authorRole === "MIDWIFE" 
          ? "Bidan" 
          : note.authorRole === "DOCTOR" 
            ? "Dokter" 
            : note.authorRole === "NUTRITIONIST" 
              ? "Ahli Gizi" 
              : "Admin";

        return (
          <div key={note.id} className="bg-muted/30 border border-border/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-foreground">{note.authorName}</p>
                <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 ${roleColor}`}>
                  {roleLabel}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                {new Intl.DateTimeFormat("id-ID", { dateStyle: "short" }).format(new Date(note.date))}
              </span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed italic bg-card border border-border/50 rounded-xl px-3.5 py-2.5">
              "{note.note}"
            </p>
          </div>
        );
      })}
    </div>
  );
}
