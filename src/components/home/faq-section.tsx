import { Container } from "@/components/layout/container";
import { SectionTitle } from "@/components/ui/section-title";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { FadeIn } from "@/components/motion/fade-in";
import { faqItems } from "@/lib/data/faq";

export function FAQSection() {
  return (
    <section id="faq" className="bg-sage-50/50 py-16 sm:py-24">
      <Container className="flex flex-col gap-12">
        <FadeIn>
          <SectionTitle
            eyebrow="FAQ"
            title="Pertanyaan yang Sering Diajukan"
            description="Temukan jawaban atas pertanyaan umum seputar masa nifas, kesehatan mental, dan skrining EPDS."
          />
        </FadeIn>
        <FadeIn delay={0.1} className="mx-auto w-full max-w-2xl">
          <FAQAccordion items={faqItems} />
        </FadeIn>
      </Container>
    </section>
  );
}
