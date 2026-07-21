import type { Metadata } from "next";
import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { Container } from "@/components/layout/container";
import { LoginButton } from "@/components/auth/login-button";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Masuk ke Nifas Care menggunakan akun Anda.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="flex min-h-[85vh] items-center justify-center py-12">
      <Container className="flex max-w-sm flex-col items-center gap-6 text-center">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <HeartHandshake className="size-6" aria-hidden="true" />
          </span>
        </Link>
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-2xl font-semibold text-foreground">Masuk ke Nifas Care</h1>
          <p className="text-sm text-pretty text-muted-foreground">
            Masuk untuk mengakses layanan skrining dan pemantauan kesehatan nifas Anda.
          </p>
        </div>

        {/* Credentials Form */}
        <LoginForm callbackUrl={callbackUrl} />

        {/* Divider */}
        <div className="w-full flex items-center gap-3 my-1">
          <hr className="flex-1 border-border" />
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">atau</span>
          <hr className="flex-1 border-border" />
        </div>

        {/* Google Authentication */}
        <LoginButton callbackUrl={callbackUrl} />

        <p className="text-xs text-pretty text-muted-foreground">
          Dengan masuk, Anda menyetujui{" "}
          <Link href="/privacy-policy" className="font-medium text-primary hover:underline">
            Privacy Policy
          </Link>{" "}
          dan{" "}
          <Link href="/disclaimer" className="font-medium text-primary hover:underline">
            Disclaimer
          </Link>{" "}
          kami.
        </p>
      </Container>
    </div>
  );
}
