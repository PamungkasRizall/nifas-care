import type { Metadata } from "next";
import Link from "next/link";
import { Construction, ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Mulai Skrining",
  description: "Fitur skrining EPDS sedang dalam tahap pengembangan dan akan segera hadir.",
  alternates: { canonical: "/skrining" },
  robots: { index: false, follow: true },
};

export default function SkriningPage() {
  return (
    <div className="flex min-h-[70vh] items-center py-16 sm:py-24">
      <Container className="flex flex-col items-center gap-6 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Construction className="size-8" aria-hidden="true" />
        </span>
        <h1 className="font-heading text-2xl font-semibold text-balance text-foreground sm:text-3xl">
          Fitur Skrining EPDS Segera Hadir
        </h1>
        <p className="max-w-md text-pretty text-muted-foreground">
          Kami sedang menyiapkan pengalaman skrining EPDS yang aman dan mudah digunakan. Nantikan
          peluncurannya di tahap berikutnya.
        </p>
        <Button render={<Link href="/" />} nativeButton={false} variant="outline" className="gap-2">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Kembali ke Beranda
        </Button>
      </Container>
    </div>
  );
}
