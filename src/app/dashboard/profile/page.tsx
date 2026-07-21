import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profil Saya — Nifas Care",
  robots: { index: false, follow: false },
};

async function getMotherDetail(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      motherProfile: true,
    },
  });
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="py-3 grid grid-cols-[180px_1fr] gap-4 border-b border-border last:border-0">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground font-semibold">{value ?? "—"}</dd>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <h2 className="font-semibold text-foreground">{title}</h2>
      </div>
      <dl className="px-6">{children}</dl>
    </div>
  );
}

function BooleanBadge({ value, trueLabel = "Ya", falseLabel = "Tidak" }: { value: boolean; trueLabel?: string; falseLabel?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
        value
          ? "bg-blush-50 border border-blush-200 text-blush-700"
          : "bg-muted text-muted-foreground border border-border"
      }`}
    >
      {value ? "✓" : "✗"} {value ? trueLabel : falseLabel}
    </span>
  );
}

export default async function MotherProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const mother = await getMotherDetail(session.user.id);
  if (!mother || !mother.motherProfile) {
    redirect("/onboarding");
  }

  const p = mother.motherProfile;
  const fmt = (date: Date | null | undefined) =>
    date
      ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(date))
      : "—";

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-primary font-bold text-2xl">
            {(p.fullName ?? mother.name ?? "?").charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-foreground">
            {p.fullName ?? mother.name ?? "—"}
          </h1>
          <p className="text-sm text-muted-foreground">{mother.email}</p>
        </div>
        <div className="ml-auto">
          <span className="inline-flex items-center gap-1.5 bg-sage-50 border border-sage-200 text-sage-700 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-sage-500 animate-pulse" />
            Profil Aktif
          </span>
        </div>
      </div>

      {/* Data Pribadi */}
      <SectionCard title="Data Pribadi">
        <DetailRow label="Nama Lengkap" value={p.fullName} />
        <DetailRow label="Email" value={mother.email} />
        <DetailRow label="Nomor HP" value={p.phoneNumber} />
        <DetailRow label="Tanggal Lahir" value={fmt(p.dateOfBirth)} />
        <DetailRow label="Pendidikan" value={p.education} />
        <DetailRow label="Pekerjaan" value={p.occupation} />
        <DetailRow label="Alamat" value={p.address} />
      </SectionCard>

      {/* Data Persalinan */}
      <SectionCard title="Data Persalinan">
        <DetailRow label="Tanggal Persalinan" value={fmt(p.deliveryDate)} />
        <DetailRow label="Jenis Persalinan" value={p.deliveryMethod} />
        <DetailRow label="Gravida (Kehamilan ke-)" value={p.gravida} />
        <DetailRow label="Paritas" value={p.parity} />
        <DetailRow label="Abortus" value={p.abortus ?? 0} />
      </SectionCard>

      {/* Data Bayi */}
      <SectionCard title="Data Bayi">
        <DetailRow label="Nama Bayi" value={p.babyName} />
        <DetailRow
          label="Jenis Kelamin"
          value={
            p.babyGender === "Male"
              ? "Laki-laki"
              : p.babyGender === "Female"
              ? "Perempuan"
              : "—"
          }
        />
        <DetailRow
          label="Berat Lahir"
          value={p.birthWeight ? `${p.birthWeight} kg` : "—"}
        />
        <DetailRow
          label="Panjang Lahir"
          value={p.birthLength ? `${p.birthLength} cm` : "—"}
        />
      </SectionCard>

      {/* Riwayat Penyakit */}
      <SectionCard title="Riwayat Penyakit">
        <DetailRow label="Hipertensi" value={<BooleanBadge value={p.hypertension} />} />
        <DetailRow label="Diabetes" value={<BooleanBadge value={p.diabetes} />} />
        <DetailRow label="Pre-eklampsia" value={<BooleanBadge value={p.preEclampsia} />} />
        <DetailRow label="Gangguan Kecemasan" value={<BooleanBadge value={p.anxietyDisorder} />} />
        <DetailRow label="Riwayat Depresi" value={<BooleanBadge value={p.depressionHistory} />} />
      </SectionCard>

      {/* Kontak Darurat */}
      <SectionCard title="Kontak Darurat">
        <DetailRow label="Nama" value={p.emergencyContactName} />
        <DetailRow label="Hubungan" value={p.emergencyContactRelationship} />
        <DetailRow label="Nomor HP" value={p.emergencyContactPhone} />
      </SectionCard>

      {/* Persetujuan */}
      <SectionCard title="Persetujuan">
        <DetailRow
          label="Kebijakan Privasi"
          value={<BooleanBadge value={p.privacyPolicyConsent} trueLabel="Disetujui" falseLabel="Belum disetujui" />}
        />
        <DetailRow
          label="Pemrosesan Data"
          value={<BooleanBadge value={p.dataProcessingConsent} trueLabel="Disetujui" falseLabel="Belum disetujui" />}
        />
        <DetailRow
          label="Partisipasi Penelitian"
          value={<BooleanBadge value={p.researchParticipationConsent} trueLabel="Disetujui" falseLabel="Belum disetujui" />}
        />
      </SectionCard>
    </div>
  );
}
