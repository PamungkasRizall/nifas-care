import { Container } from "@/components/layout/container";
import { SectionTitle } from "@/components/ui/section-title";
import { FeatureCard } from "@/components/ui/feature-card";
import { FadeIn } from "@/components/motion/fade-in";
import { nifasCards } from "@/lib/data/nifas";

export function MasaNifasSection() {
  return (
    <section id="masa-nifas" className="py-16 sm:py-24">
      <Container className="flex flex-col gap-12">
        <FadeIn>
          <SectionTitle
            eyebrow="Masa Nifas"
            title="Mengenal Masa Nifas Lebih Dekat"
            description="Masa nifas adalah periode penting yang sering terlewat perhatiannya. Kenali perubahan tubuh dan hal-hal yang perlu diwaspadai."
          />
        </FadeIn>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {nifasCards.map((card, index) => (
            <FadeIn key={card.title} delay={index * 0.05}>
              <FeatureCard
                icon={card.icon}
                title={card.title}
                description={card.description}
                tone={index % 3 === 0 ? "sage" : index % 3 === 1 ? "blush" : "amber"}
              />
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
