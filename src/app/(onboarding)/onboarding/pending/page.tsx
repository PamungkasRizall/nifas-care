import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Data Sedang Diverifikasi — Nifas Care",
  robots: { index: false, follow: false },
};

export default async function PendingReviewPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { status: true },
  });

  const currentStatus = dbUser?.status || session.user.status;

  if (currentStatus === "ACTIVE") {
    redirect("/dashboard");
  }

  if (currentStatus === "PENDING_ONBOARDING") {
    redirect("/onboarding");
  }

  // Ambil catatan dari bidan jika ada
  const motherProfile = await prisma.motherProfile.findUnique({
    where: { userId: session.user.id },
    select: { midwifeNotes: true },
  });

  const midwifeNotes = motherProfile?.midwifeNotes;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sage-50 via-background to-blush-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6">
        {/* Main Card */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-lg space-y-6 text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto bg-amber-50 border-2 border-amber-200 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10 text-amber-600"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-foreground">
              Data Sedang Diverifikasi
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Terima kasih telah melengkapi data Anda.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Saat ini data Anda sedang diverifikasi oleh Bidan. Silakan menunggu
              proses verifikasi selesai.
            </p>
            <p className="text-sm text-muted-foreground/75">
              Jika ada data yang perlu diperbaiki, Anda akan menerima pemberitahuan.
            </p>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Menunggu Verifikasi Bidan
          </div>
        </div>

        {/* Catatan dari Bidan */}
        {midwifeNotes && (
          <div className="bg-blush-50 border border-blush-200 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blush-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5 text-blush-600"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h2 className="font-semibold text-blush-700 text-sm">
                Catatan dari Bidan
              </h2>
            </div>
            <p className="text-sm text-blush-700 leading-relaxed">{midwifeNotes}</p>
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground/60 px-4">
          Hubungi Bidan Anda jika membutuhkan bantuan lebih lanjut.
        </p>
      </div>
    </main>
  );
}
