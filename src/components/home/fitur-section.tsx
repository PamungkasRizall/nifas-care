import { Check, Clock } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionTitle } from "@/components/ui/section-title";
import { FadeIn } from "@/components/motion/fade-in";
import { platformFeatures } from "@/lib/data/features";

export function FiturSection() {
  return (
    <section id="fitur" className="py-16 sm:py-24">
      <Container className="flex flex-col gap-12">
        <FadeIn>
          <SectionTitle
            eyebrow="Fitur Platform"
            title="Fitur yang Akan Anda Dapatkan"
            description="Nifas Care sedang dikembangkan menjadi platform pemantauan lengkap. Berikut fitur yang akan hadir untuk mendukung perjalanan Anda."
          />
        </FadeIn>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {platformFeatures.map((feature, index) => (
            <FadeIn key={feature.title} delay={index * 0.05}>
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sage-100 text-sage-700">
                    <feature.icon className="size-5" aria-hidden="true" />
                  </span>
                  {feature.available ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sage-100 px-2.5 py-1 text-xs font-medium text-sage-700">
                      <Check className="size-3.5" aria-hidden="true" />
                      Tersedia
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      <Clock className="size-3.5" aria-hidden="true" />
                      Segera Hadir
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
