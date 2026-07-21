import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AssignmentCard from "@/app/dashboard/components/AssignmentCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Daftar Tugas Assessment — Nifas Care",
  robots: { index: false, follow: false },
};

async function getAssignments(motherId: string) {
  return prisma.assignment.findMany({
    where: { motherId },
    orderBy: { dueDate: "asc" },
  });
}

export default async function MotherAssessmentPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const assignments = await getAssignments(session.user.id);

  const pending = assignments.filter((a) => a.status === "PENDING" || a.status === "IN_PROGRESS" || a.status === "OVERDUE");
  const completed = assignments.filter((a) => a.status === "COMPLETED" || a.status === "SUBMITTED");

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Daftar Assessment</h1>
        <p className="text-muted-foreground mt-1">
          Daftar seluruh tugas pemantauan nifas yang ditugaskan kepada Anda.
        </p>
      </div>

      {assignments.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-muted-foreground">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <p className="font-semibold text-foreground">Belum ada assessment yang tersedia</p>
          <p className="text-sm text-muted-foreground mt-1">
            Silakan menunggu jadwal pemantauan berikutnya dari Bidan.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section Tugas Aktif */}
          {pending.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span>Tugas Aktif</span>
                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  {pending.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {pending.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            </div>
          )}

          {/* Section Tugas Selesai */}
          {completed.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Riwayat Selesai</h2>
              <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
                {completed.map((a) => {
                  const formattedCompletedDate = new Intl.DateTimeFormat("id-ID", {
                    dateStyle: "medium",
                  }).format(new Date(a.updatedAt));

                  return (
                    <Link
                      key={a.id}
                      href={`/dashboard/assessment/fill/${a.id}`}
                      className="p-5 flex items-center justify-between gap-4 hover:bg-muted/10 transition-colors group"
                    >
                      <div>
                        <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{a.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Selesai pada: {formattedCompletedDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center bg-sage-50 border border-sage-200 text-sage-700 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                          Selesai
                        </span>
                        <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Detail →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
