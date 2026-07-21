import { Smile, HeartCrack, Users, LifeBuoy } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionTitle } from "@/components/ui/section-title";
import { FeatureCard } from "@/components/ui/feature-card";
import { FadeIn } from "@/components/motion/fade-in";

const mentalHealthPoints = [
  {
    icon: Smile,
    title: "Baby Blues Itu Umum",
    description:
      "Hingga 80% ibu baru mengalami baby blues, perasaan sedih atau cemas ringan pada minggu pertama setelah melahirkan.",
    tone: "sage" as const,
  },
  {
    icon: HeartCrack,
    title: "Depresi Postpartum Perlu Perhatian",
    description:
      "Berbeda dari baby blues, depresi postpartum berlangsung lebih lama dan membutuhkan penanganan tenaga kesehatan.",
    tone: "blush" as const,
  },
  {
    icon: Users,
    title: "Dukungan Keluarga Penting",
    description:
      "Kehadiran pasangan dan keluarga membantu ibu merasa lebih tenang dan tidak sendirian menghadapi perubahan ini.",
    tone: "amber" as const,
  },
  {
    icon: LifeBuoy,
    title: "Jangan Ragu Mencari Bantuan",
    description:
      "Mengenali perasaan sendiri dan berkonsultasi lebih awal dapat mencegah kondisi yang lebih berat di kemudian hari.",
    tone: "sage" as const,
  },
];

export function MentalHealthSection() {
  return (
    <section id="kesehatan-mental" className="bg-sage-50/50 py-16 sm:py-24">
      <Container className="flex flex-col gap-12">
        <FadeIn>
          <SectionTitle
            eyebrow="Kesehatan Mental"
            title="Mengapa Kesehatan Mental Penting"
            description="Kesehatan mental ibu sama pentingnya dengan kesehatan fisik. Mengenali perubahan emosi sejak dini membantu ibu melalui masa nifas dengan lebih baik."
          />
        </FadeIn>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {mentalHealthPoints.map((point, index) => (
            <FadeIn key={point.title} delay={index * 0.05}>
              <FeatureCard
                icon={point.icon}
                title={point.title}
                description={point.description}
                tone={point.tone}
              />
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
