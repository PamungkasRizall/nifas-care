import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { getDashboardData } from "@/modules/mother/dashboard/services";
import { redirect } from "next/navigation";
import ActivityTimeline from "@/app/dashboard/components/ActivityTimeline";

export const metadata: Metadata = {
  title: "Riwayat Aktivitas Pemantauan — Nifas Care",
  robots: { index: false, follow: false },
};

export default async function MotherHistoryPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const data = await getDashboardData(session.user.id);

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Riwayat Aktivitas</h1>
        <p className="text-muted-foreground mt-1">
          Daftar seluruh aktivitas medis dan pengisian assessment Anda.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
        <ActivityTimeline activities={data.activities} />
      </div>
    </div>
  );
}
