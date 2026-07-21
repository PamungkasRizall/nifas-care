import Link from "next/link";
import { ClipboardCheck, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { FeatureCard } from "@/components/ui/feature-card";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { epdsHighlights, epdsInfo } from "@/lib/data/epds";

export function EPDSSection() {
  return (
    <section id="epds" className="py-16 sm:py-24">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
        <FadeIn className="flex flex-col gap-6">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ClipboardCheck className="size-6" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-3">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase w-fit">
              EPDS
            </span>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
              Skrining EPDS untuk Kesehatan Mental Ibu
            </h2>
          </div>
          <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              <span className="font-semibold text-foreground">Apa itu EPDS? </span>
              {epdsInfo.apa}
            </p>
            <p>
              <span className="font-semibold text-foreground">Mengapa digunakan? </span>
              {epdsInfo.mengapa}
            </p>
            <p>
              <span className="font-semibold text-foreground">Siapa yang perlu mengisi? </span>
              {epdsInfo.siapa}
            </p>
            <p>
              <span className="font-semibold text-foreground">Kapan diisi? </span>
              {epdsInfo.kapan}
            </p>
          </div>
          <Button render={<Link href="/skrining" />} nativeButton={false} className="w-fit gap-2">
            Mulai Skrining EPDS
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </FadeIn>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-1">
          {epdsHighlights.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.08}>
              <FeatureCard
                icon={item.icon}
                title={item.title}
                description={item.description}
                tone={index === 0 ? "sage" : index === 1 ? "amber" : "blush"}
              />
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
