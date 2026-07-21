import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import NotificationBell from "@/modules/notification/components/NotificationBell";
import { logoutAction } from "@/lib/auth/actions";

export const metadata: Metadata = {
  title: "Dashboard Ibu — Nifas Care",
  robots: { index: false, follow: false },
};

const sidebarLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: "Assessment",
    href: "/dashboard/assessment",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    label: "Riwayat",
    href: "/dashboard/history",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "Profil",
    href: "/dashboard/profile",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default async function MotherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "MOTHER" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { status: true },
  });

  const currentStatus = dbUser?.status || session.user.status;

  // Hanya perbolehkan jika ACTIVE
  if (currentStatus !== "ACTIVE" && session.user.role !== "ADMIN") {
    if (currentStatus === "PENDING_ONBOARDING") {
      redirect("/onboarding");
    } else if (currentStatus === "PENDING_MIDWIFE_REVIEW") {
      redirect("/onboarding/pending");
    }
  }

  const userName = session.user.name ?? "Ibu";

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-foreground">{userName}</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-2">Portal Ibu</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                link.placeholder
                  ? "text-muted-foreground/50 cursor-not-allowed pointer-events-none"
                  : "text-foreground hover:bg-muted hover:text-primary"
              }`}
            >
              <span className={link.placeholder ? "opacity-50" : "text-muted-foreground"}>
                {link.icon}
              </span>
              {link.label}
              {link.placeholder && (
                <span className="ml-auto text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                  Soon
                </span>
              )}
            </Link>
          ))}
          {/* Logout Button */}
          <form action={logoutAction} className="pt-2 border-t border-border mt-2">
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </form>
        </nav>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xs">N</span>
          </div>
          <span className="font-bold text-foreground text-sm">Nifas Care</span>
        </Link>
        <div className="flex items-center gap-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`p-2 rounded-lg transition-colors ${
                link.placeholder
                  ? "text-muted-foreground/30 cursor-not-allowed pointer-events-none"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
              title={link.label}
            >
              {link.icon}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0 md:pt-0 pt-16 flex flex-col">
        {/* Top Header Controls */}
        <header className="bg-card border-b border-border px-6 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <NotificationBell />
          </div>
        </header>
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
