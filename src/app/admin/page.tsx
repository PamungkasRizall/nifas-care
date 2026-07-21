import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { DashboardPlaceholder } from "@/components/auth/dashboard-placeholder";

export const metadata: Metadata = { title: "Dashboard Admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const session = await auth();

  return (
    <DashboardPlaceholder
      title="Dashboard Admin"
      description="Perangkat pengelolaan pengguna, peran, dan seluruh sistem Nifas Care akan segera hadir di sini."
      userName={session?.user?.name}
    />
  );
}
