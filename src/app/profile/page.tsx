import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { DashboardPlaceholder } from "@/components/auth/dashboard-placeholder";

export const metadata: Metadata = { title: "Lengkapi Profil", robots: { index: false, follow: false } };

export default async function ProfilePage() {
  const session = await auth();

  return (
    <DashboardPlaceholder
      title="Lengkapi Profil Anda"
      description="Formulir onboarding profil akan segera hadir untuk melengkapi data Anda sebagai pengguna Nifas Care."
      userName={session?.user?.name}
    />
  );
}
