"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-14 pb-20 sm:pt-20 sm:pb-28">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,var(--color-sage-100),transparent_55%),radial-gradient(circle_at_bottom_left,var(--color-blush-100),transparent_45%)]"
        aria-hidden="true"
      />
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-start gap-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
            Aman, nyaman, dan terpercaya
          </span>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            Ibu Sehat, <span className="text-primary">Bayi Bahagia</span>
          </h1>
          <p className="max-w-lg text-pretty text-base text-muted-foreground sm:text-lg">
            Platform edukasi dan pemantauan ibu nifas untuk membantu menjaga
            kesehatan fisik dan mental setelah persalinan.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" render={<Link href="/skrining" />} nativeButton={false} className="h-11 gap-2 px-6 text-base">
              Mulai Skrining
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="#masa-nifas" />}
              className="h-11 px-6 text-base"
            >
              Pelajari Masa Nifas
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <Image
            src="/images/hero-illustration.svg"
            alt="Ilustrasi ibu menggendong bayi dengan tenang"
            width={640}
            height={560}
            priority
            className="h-auto w-full"
          />
        </motion.div>
      </Container>
    </section>
  );
}
