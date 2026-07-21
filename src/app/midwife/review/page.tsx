import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { getPendingReviews } from "@/modules/assessment/engine/engine";
import { getAllManifests } from "@/modules/assessment/registry";
import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Review Assessment — Portal Bidan",
  robots: { index: false, follow: false },
};

export default async function MidwifeReviewQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; tab?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Hanya perbolehkan MIDWIFE atau ADMIN
  if (session.user.role !== "MIDWIFE" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  const { type: filterType, tab = "pending" } = await searchParams;

  // Dapatkan seluruh assessment berstatus SUBMITTED (menunggu level 1)
  const allPending = await getPendingReviews("MIDWIFE");

  // Dapatkan seluruh assessment yang sudah ditinjau / selesai
  const allCompleted = await prisma.assessment.findMany({
    where: {
      status: {
        in: ["UNDER_REVIEW", "COMPLETED", "REJECTED"],
      },
    },
    include: {
      mother: {
        include: {
          motherProfile: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Dapatkan daftar jenis assessment terdaftar dari Registry secara dinamis untuk filter
  const manifests = getAllManifests();

  // Filter hasil di server-side berdasarkan query searchParams dan tab aktif
  const baseAssessments = tab === "completed" ? allCompleted : allPending;
  const filteredAssessments = filterType
    ? baseAssessments.filter((a) => a.type === filterType)
    : baseAssessments;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {tab === "completed" ? "Riwayat Tinjau Assessment" : "Antrean Review Assessment"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {tab === "completed" 
              ? "Daftar tugas screening kesehatan Ibu yang telah selesai ditinjau." 
              : "Daftar tugas screening kesehatan Ibu yang masuk untuk peninjauan tingkat pertama."}
          </p>
        </div>
        <div className="flex gap-2.5">
          <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 font-medium text-sm px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            {allPending.length} Menunggu
          </span>
          <span className="inline-flex items-center gap-2 bg-sage-50 border border-sage-200 text-sage-700 font-medium text-sm px-4 py-2 rounded-full">
            {allCompleted.length} Selesai
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border flex gap-6 text-sm font-semibold">
        <Link
          href={`/midwife/review?tab=pending${filterType ? `&type=${filterType}` : ""}`}
          className={`pb-3 border-b-2 transition-colors ${
            tab === "pending"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Antrean Review ({allPending.length})
        </Link>
        <Link
          href={`/midwife/review?tab=completed${filterType ? `&type=${filterType}` : ""}`}
          className={`pb-3 border-b-2 transition-colors ${
            tab === "completed"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Riwayat Review ({allCompleted.length})
        </Link>
      </div>

      {/* Filter Dinamis berdasarkan Manifest */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Link
          href={`/midwife/review?tab=${tab}`}
          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
            !filterType
              ? "bg-primary border-primary text-primary-foreground"
              : "bg-card border-border text-foreground hover:bg-muted"
          }`}
        >
          Semua
        </Link>
        {manifests.map((manifest) => (
          <Link
            key={manifest.type}
            href={`/midwife/review?tab=${tab}&type=${manifest.type}`}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition whitespace-nowrap ${
              filterType === manifest.type
                ? "bg-primary border-primary text-primary-foreground"
                : "bg-card border-border text-foreground hover:bg-muted"
            }`}
          >
            {manifest.title.split(" (")[0]}
          </Link>
        ))}
      </div>

      {/* Queue Table */}
      {filteredAssessments.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-muted-foreground"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <p className="font-semibold text-foreground">Tidak ada tugas dalam daftar</p>
          <p className="text-sm text-muted-foreground mt-1">
            {filterType
              ? `Tidak ada assessment ${filterType} yang sesuai.`
              : "Belum ada riwayat review yang terdaftar."}
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Nama Ibu</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Jenis Screening</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">
                    {tab === "completed" ? "Terakhir Diupdate" : "Tanggal Kirim"}
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAssessments.map((a) => {
                  const motherName = a.mother.motherProfile?.fullName || a.mother.name || "Ibu";
                  const displayDate = tab === "completed" ? a.updatedAt : (a.submittedAt || a.createdAt);
                  
                  return (
                    <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-4 font-semibold text-foreground">
                        {motherName}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-medium text-foreground">{a.type}</span>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(
                          new Date(displayDate)
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {a.status === "SUBMITTED" ? (
                          <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Menunggu Review
                          </span>
                        ) : a.status === "UNDER_REVIEW" ? (
                          <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            Review Level 2
                          </span>
                        ) : a.status === "REJECTED" ? (
                          <span className="inline-flex items-center gap-1.5 bg-blush-50 border border-blush-200 text-blush-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-blush-500" />
                            Dikembalikan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-sage-50 border border-sage-200 text-sage-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-sage-500" />
                            Selesai
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          id={`btn-review-${a.id}`}
                          href={`/midwife/review/${a.id}`}
                          className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition whitespace-nowrap inline-block"
                        >
                          {tab === "completed" ? "Lihat Detail" : "Tinjau →"}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-border">
            {filteredAssessments.map((a) => {
              const motherName = a.mother.motherProfile?.fullName || a.mother.name || "Ibu";
              const displayDate = tab === "completed" ? a.updatedAt : (a.submittedAt || a.createdAt);
              
              return (
                <div key={a.id} className="p-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-foreground">{motherName}</p>
                      <p className="text-xs text-muted-foreground">Screening: {a.type}</p>
                    </div>
                    {a.status === "SUBMITTED" ? (
                      <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        Menunggu
                      </span>
                    ) : a.status === "UNDER_REVIEW" ? (
                      <span className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        Level 2
                      </span>
                    ) : a.status === "REJECTED" ? (
                      <span className="inline-flex items-center gap-1 bg-blush-50 border border-blush-200 text-blush-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        Return
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-sage-50 border border-sage-200 text-sage-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        Selesai
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">
                      {tab === "completed" ? "Diupdate pada:" : "Dikirim pada:"}
                    </p>
                    <p className="mt-0.5">
                      {new Intl.DateTimeFormat("id-ID", { dateStyle: "short", timeStyle: "short" }).format(
                        new Date(displayDate)
                      )}
                    </p>
                  </div>
                  <Link
                    id={`btn-mobile-review-${a.id}`}
                    href={`/midwife/review/${a.id}`}
                    className="block w-full text-center bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition mt-1"
                  >
                    {tab === "completed" ? "Lihat Detail" : "Mulai Tinjau"}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
