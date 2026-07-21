import { Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionTitle } from "@/components/ui/section-title";
import { FadeIn } from "@/components/motion/fade-in";
import { magnesiumFoods, magnesiumInfo } from "@/lib/data/magnesium";

export function MagnesiumSection() {
  return (
    <section id="magnesium" className="bg-amber-50/60 py-16 sm:py-24">
      <Container className="flex flex-col gap-12">
        <FadeIn>
          <SectionTitle
            eyebrow="Magnesium"
            title="Mengapa Magnesium Penting"
            description="Magnesium berperan besar dalam menjaga suasana hati, kualitas tidur, dan pemulihan fisik ibu setelah melahirkan."
          />
        </FadeIn>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <FadeIn className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground sm:p-8 sm:text-base">
            <p>
              <span className="font-semibold text-foreground">Apa itu magnesium? </span>
              {magnesiumInfo.apa}
            </p>
            <p>
              <span className="font-semibold text-foreground">Mengapa penting? </span>
              {magnesiumInfo.mengapa}
            </p>
            <p>
              <span className="font-semibold text-foreground">Dampak kekurangan. </span>
              {magnesiumInfo.dampak}
            </p>
          </FadeIn>

          <FadeIn delay={0.1} className="flex flex-col gap-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Sparkles className="size-4 text-accent" aria-hidden="true" />
              Sumber Makanan Kaya Magnesium
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {magnesiumFoods.map((food) => (
                <div
                  key={food.name}
                  className="flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-6 text-center shadow-sm transition-transform hover:-translate-y-0.5"
                >
                  <span className="flex size-11 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <food.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{food.name}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
