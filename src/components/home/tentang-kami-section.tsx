import { Eye, Target, FlaskConical, HandHeart } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionTitle } from "@/components/ui/section-title";
import { FeatureCard } from "@/components/ui/feature-card";
import { FadeIn } from "@/components/motion/fade-in";

const aboutPoints = [
  {
    icon: Eye,
    title: "Visi",
    description:
      "Menjadi platform edukasi dan pemantauan ibu nifas yang terpercaya untuk mendukung kesehatan fisik dan mental ibu di Indonesia.",
    tone: "sage" as const,
  },
  {
    icon: Target,
    title: "Misi",
    description:
      "Menyediakan edukasi yang mudah dipahami serta alat bantu skrining dini agar ibu nifas mendapatkan dukungan yang tepat waktu.",
    tone: "blush" as const,
  },
  {
    icon: FlaskConical,
    title: "Tujuan Penelitian",
    description:
      "Mengembangkan pendekatan berbasis bukti dalam memantau kesehatan mental dan asupan nutrisi ibu selama masa nifas.",
    tone: "amber" as const,
  },
  {
    icon: HandHeart,
    title: "Kolaborasi Tenaga Kesehatan",
    description:
      "Dikembangkan bersama bidan, dokter, dan mahasiswa kesehatan untuk memastikan konten yang akurat dan relevan.",
    tone: "sage" as const,
  },
];

export function TentangKamiSection() {
  return (
    <section id="tentang-kami" className="py-16 sm:py-24">
      <Container className="flex flex-col gap-12">
        <FadeIn>
          <SectionTitle
            eyebrow="Tentang Kami"
            title="Mengapa Nifas Care Hadir"
            description="Nifas Care hadir sebagai wujud kepedulian terhadap kesehatan ibu setelah persalinan, dikembangkan bersama tenaga kesehatan profesional."
          />
        </FadeIn>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {aboutPoints.map((point, index) => (
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
