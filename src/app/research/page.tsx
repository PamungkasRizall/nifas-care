import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { DashboardPlaceholder } from "@/components/auth/dashboard-placeholder";

export const metadata: Metadata = { title: "Dashboard Penelitian", robots: { index: false, follow: false } };

export default async function ResearchPage() {
  const session = await auth();

  return (
    <DashboardPlaceholder
      title="Dashboard Penelitian"
      description="Akses data penelitian sesuai hak akses akan segera hadir di sini. Data pasien tidak dapat diubah dari peran ini."
      userName={session?.user?.name}
    />
  );
}
