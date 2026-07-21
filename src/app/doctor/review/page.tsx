import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { getAssessmentManifest } from "@/modules/assessment/registry";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Antrean Review Dokter — Portal Dokter",
  robots: { index: false, follow: false },
};

export default async function DoctorReviewQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; priority?: string; search?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Hanya perbolehkan DOCTOR atau ADMIN
  if (session.user.role !== "DOCTOR" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  const { tab = "pending", priority: priorityFilter, search = "" } = await searchParams;

  // Dapatkan seluruh assessment EPDS berstatus UNDER_REVIEW (menunggu level 2) atau COMPLETED
  const assessments = await prisma.assessment.findMany({
    where: {
      type: "EPDS",
      status: {
        in: ["UNDER_REVIEW", "COMPLETED"],
      },
    },
    include: {
      mother: {
        select: {
          id: true,
          name: true,
          email: true,
          motherProfile: {
            select: {
              fullName: true,
              deliveryDate: true,
            },
          },
        },
      },
      reviews: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  const epdsManifest = getAssessmentManifest("EPDS");

  // Map data & hitung skor secara dinamis
  const mapped = await Promise.all(
    assessments.map(async (a) => {
      const profile = a.mother.motherProfile;
      const motherName = profile?.fullName || a.mother.name || "Ibu";
      const deliveryDate = profile?.deliveryDate ? new Date(profile.deliveryDate) : null;

      // Hitung Hari Nifas
      let daysPostpartum = 0;
      if (deliveryDate) {
        const today = new Date();
        const delivery = new Date(deliveryDate);
        delivery.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        const diffTime = Math.abs(today.getTime() - delivery.getTime());
        daysPostpartum = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      }

      // Parsing answers
      const answers: Record<string, string | number> = {};
      if (a.answers && typeof a.answers === "object") {
        const rawAnswers = a.answers as Record<string, unknown>;
        Object.keys(rawAnswers).forEach((key) => {
          const val = rawAnswers[key];
          if (typeof val === "string" || typeof val === "number") {
            answers[key] = val;
          }
        });
      }

      const score = await epdsManifest.calculateScore(answers);
      const interpretationResult = await epdsManifest.interpretScore(score, answers);
      const priority = interpretationResult.riskStatus; // "LOW" | "HIGH" | "URGENT"

      const midwifeReview = a.reviews.find((r) => r.reviewerRole === "MIDWIFE");
      const doctorReview = a.reviews.find((r) => r.reviewerRole === "DOCTOR");

      return {
        id: a.id,
        motherName,
        deliveryDate,
        daysPostpartum,
        score,
        priority,
        midwifeReviewStatus: midwifeReview ? "Selesai" : "Belum",
        doctorReviewStatus: a.status === "COMPLETED" ? "Selesai" : "Menunggu",
        submittedAt: a.submittedAt,
        rawStatus: a.status,
      };
    })
  );

  // Filter
  let filtered = mapped;

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter((item) => item.motherName.toLowerCase().includes(q));
  }

  if (tab === "pending") {
    filtered = filtered.filter((item) => item.rawStatus === "UNDER_REVIEW");
  } else if (tab === "completed") {
    filtered = filtered.filter((item) => item.rawStatus === "COMPLETED");
  }

  if (priorityFilter === "HIGH") {
    filtered = filtered.filter((item) => item.priority === "HIGH");
  } else if (priorityFilter === "URGENT") {
    filtered = filtered.filter((item) => item.priority === "URGENT");
  }

  // Sort: URGENT > HIGH > LOW, lalu pengisian terbaru
  const priorityWeight = { URGENT: 3, HIGH: 2, LOW: 1 };
  filtered.sort((a, b) => {
    const weightA = priorityWeight[a.priority as keyof typeof priorityWeight] || 0;
    const weightB = priorityWeight[b.priority as keyof typeof priorityWeight] || 0;
    if (weightB !== weightA) {
      return weightB - weightA;
    }
    const timeA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
    const timeB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
    return timeB - timeA;
  });

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Daftar Review EPDS
          </h1>
          <p className="text-muted-foreground mt-1">
            Portal peninjauan klinis level kedua kuesioner EPDS Ibu Nifas.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link
            href="/doctor"
            className="border border-border hover:bg-muted text-foreground text-sm font-semibold px-4 py-2.5 rounded-xl transition"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>
      </div>

      {/* Tabs, Search, & Filters */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex border-b border-border text-sm font-semibold gap-6">
            <Link
              href={`/doctor/review?tab=pending${priorityFilter ? `&priority=${priorityFilter}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
              className={`pb-3 border-b-2 transition-colors ${
                tab === "pending"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Belum Direview ({mapped.filter(m => m.rawStatus === "UNDER_REVIEW").length})
            </Link>
            <Link
              href={`/doctor/review?tab=completed${priorityFilter ? `&priority=${priorityFilter}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
              className={`pb-3 border-b-2 transition-colors ${
                tab === "completed"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Sudah Direview ({mapped.filter(m => m.rawStatus === "COMPLETED").length})
            </Link>
          </div>

          {/* Priority Quick Filter */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-muted-foreground">Prioritas:</span>
            <Link
              href={`/doctor/review?tab=${tab}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
              className={`px-3 py-1.5 rounded-full border transition-all ${
                !priorityFilter
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground bg-muted/40"
              }`}
            >
              Semua
            </Link>
            <Link
              href={`/doctor/review?tab=${tab}&priority=HIGH${search ? `&search=${encodeURIComponent(search)}` : ""}`}
              className={`px-3 py-1.5 rounded-full border transition-all ${
                priorityFilter === "HIGH"
                  ? "bg-blush-50 border-blush-200 text-blush-700 font-bold"
                  : "border-border text-muted-foreground hover:text-foreground bg-muted/40"
              }`}
            >
              HIGH
            </Link>
            <Link
              href={`/doctor/review?tab=${tab}&priority=URGENT${search ? `&search=${encodeURIComponent(search)}` : ""}`}
              className={`px-3 py-1.5 rounded-full border transition-all ${
                priorityFilter === "URGENT"
                  ? "bg-rose-50 border-rose-200 text-rose-700 font-bold"
                  : "border-border text-muted-foreground hover:text-foreground bg-muted/40"
              }`}
            >
              URGENT
            </Link>
          </div>
        </div>

        {/* Search Input (Standard GET form) */}
        <form method="GET" className="flex items-center gap-3">
          <input type="hidden" name="tab" value={tab} />
          {priorityFilter && <input type="hidden" name="priority" value={priorityFilter} />}
          <div className="relative flex-1">
            <input
              type="text"
              name="search"
              placeholder="Cari nama Ibu..."
              defaultValue={search}
              className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition shrink-0"
          >
            Cari
          </button>
          {search && (
            <Link
              href={`/doctor/review?tab=${tab}${priorityFilter ? `&priority=${priorityFilter}` : ""}`}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground border border-border rounded-xl px-4 py-2.5 h-full flex items-center justify-center bg-muted/20"
            >
              Reset
            </Link>
          )}
        </form>
      </div>

      {/* Main Table */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-muted-foreground">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
            </svg>
          </div>
          <p className="font-semibold text-foreground text-sm">Tidak ditemukan hasil review</p>
          <p className="text-xs text-muted-foreground mt-1">
            Coba sesuaikan kata kunci pencarian atau filter prioritas Anda.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Table view */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Nama Ibu</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Tgl Persalinan</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Umur Bayi</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-center">Skor EPDS</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Priority</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-center">Review Bidan</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-center">Review Dokter</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Tgl Pengisian</th>
                  <th className="text-center px-5 py-3.5 font-semibold text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-5 py-4 font-semibold text-foreground">{item.motherName}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {item.deliveryDate
                        ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(item.deliveryDate)
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-foreground font-medium">Hari ke-{item.daysPostpartum}</td>
                    <td className="px-5 py-4 text-center font-bold tabular-nums text-base">{item.score}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.priority === "URGENT"
                            ? "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/30 dark:border-rose-900"
                            : item.priority === "HIGH"
                            ? "bg-blush-50 border-blush-200 text-blush-700 dark:bg-blush-950/30 dark:border-blush-900"
                            : "bg-sage-50 border-sage-200 text-sage-700 dark:bg-sage-950/30 dark:border-sage-900"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                        item.midwifeReviewStatus === "Selesai"
                          ? "bg-sage-50 text-sage-700 border border-sage-200"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}>
                        {item.midwifeReviewStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                        item.doctorReviewStatus === "Selesai"
                          ? "bg-sage-50 text-sage-700 border border-sage-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {item.doctorReviewStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground text-xs">
                      {item.submittedAt
                        ? new Intl.DateTimeFormat("id-ID", { dateStyle: "short", timeStyle: "short" }).format(
                            new Date(item.submittedAt)
                          )
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Link
                        id={`btn-workspace-review-${item.id}`}
                        href={`/doctor/review/${item.id}`}
                        className={`${
                          item.rawStatus === "COMPLETED"
                            ? "border border-border text-muted-foreground hover:bg-muted"
                            : "bg-primary text-primary-foreground hover:opacity-90"
                        } text-xs font-semibold px-4 py-2 rounded-xl transition whitespace-nowrap inline-block`}
                      >
                        {item.rawStatus === "COMPLETED" ? "Lihat Detail" : "Buka Review"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
