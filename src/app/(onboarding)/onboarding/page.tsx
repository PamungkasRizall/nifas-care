import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import OnboardingForm from "./components/OnboardingForm";
import { prisma } from "@/lib/prisma";

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { status: true },
  });

  const currentStatus = dbUser?.status || session.user.status;

  if (currentStatus !== "PENDING_ONBOARDING") {
    if (currentStatus === "PENDING_MIDWIFE_REVIEW") {
      redirect("/onboarding/pending");
    } else {
      redirect("/dashboard");
    }
  }

  return (
    <main className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Selamat Datang, {session.user.name || "Ibu"}!</h1>
        <p className="text-gray-600 mt-2">
          Silakan lengkapi profil nifas Anda sebelum mengakses halaman dashboard.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border">
        <OnboardingForm />
      </div>
    </main>
  );
}
