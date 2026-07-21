import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verifikasi Data Ibu — Nifas Care",
  robots: { index: false, follow: false },
};

async function getPendingMothers() {
  return prisma.user.findMany({
    where: {
      role: "MOTHER",
      status: "PENDING_MIDWIFE_REVIEW",
    },
    include: {
      motherProfile: {
        select: {
          fullName: true,
          phoneNumber: true,
          deliveryDate: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export default async function VerificationListPage() {
  const mothers = await getPendingMothers();

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Verifikasi Data Ibu
          </h1>
          <p className="text-muted-foreground mt-1">
            Daftar Ibu yang menunggu verifikasi onboarding
          </p>
        </div>
        <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 font-medium text-sm px-4 py-2 rounded-full">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          {mothers.length} Menunggu
        </span>
      </div>

      {mothers.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-muted-foreground"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <p className="font-semibold text-foreground">
            Tidak ada data yang menunggu
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Semua data onboarding sudah diverifikasi.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">
                    Nama
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">
                    Email
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">
                    Nomor HP
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">
                    Tgl Persalinan
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">
                    Tgl Submit
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mothers.map((mother) => (
                  <tr
                    key={mother.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-4 font-medium text-foreground">
                      {mother.motherProfile?.fullName ?? mother.name ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {mother.email ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {mother.motherProfile?.phoneNumber ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {mother.motherProfile?.deliveryDate
                        ? new Intl.DateTimeFormat("id-ID", {
                            dateStyle: "medium",
                          }).format(new Date(mother.motherProfile.deliveryDate))
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {mother.motherProfile?.createdAt
                        ? new Intl.DateTimeFormat("id-ID", {
                            dateStyle: "medium",
                          }).format(new Date(mother.motherProfile.createdAt))
                        : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Menunggu Verifikasi
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        id={`btn-detail-${mother.id}`}
                        href={`/midwife/verifikasi/${mother.id}`}
                        className="bg-primary text-primary-foreground text-xs font-semibold px-3.5 py-2 rounded-lg hover:opacity-90 transition whitespace-nowrap"
                      >
                        Review →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-border">
            {mothers.map((mother) => (
              /* 1. Mengubah space-y-3 menjadi flex flex-col gap-4 agar pengaturan jarak vertikal stabil */
              <div key={mother.id} className="p-5 flex flex-col gap-4">
                {/* Baris 1: Nama, Email, & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">
                      {mother.motherProfile?.fullName ?? mother.name ?? "—"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {mother.email}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Menunggu
                  </span>
                </div>

                {/* Baris 2: Detail Info (Grid) */}
                {/* 2. Mengubah gap-2 menjadi gap-3 untuk memberi ruang ekstra bernafas bagi teks data */}
                <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      Nomor HP
                    </p>
                    {/* 3. Menambahkan break-all agar jika nomor HP terlalu panjang tidak merusak baris ke bawah */}
                    <p className="break-all mt-0.5">
                      {mother.motherProfile?.phoneNumber ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      Tgl Persalinan
                    </p>
                    <p className="mt-0.5">
                      {mother.motherProfile?.deliveryDate
                        ? new Intl.DateTimeFormat("id-ID", {
                            dateStyle: "short",
                          }).format(new Date(mother.motherProfile.deliveryDate))
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* Baris 3: Tombol Aksi */}
                {/* 4. Menambahkan mt-1 sebagai bantalan tambahan khusus untuk komponen Link */}
                <Link
                  id={`btn-mobile-detail-${mother.id}`}
                  href={`/midwife/verifikasi/${mother.id}`}
                  className="block w-full text-center bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition mt-1"
                >
                  Buka Detail & Review
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
