import { Hero } from "@/components/home/hero";
import { MasaNifasSection } from "@/components/home/masa-nifas-section";
import { MentalHealthSection } from "@/components/home/mental-health-section";
import { EPDSSection } from "@/components/home/epds-section";
import { MagnesiumSection } from "@/components/home/magnesium-section";
import { FiturSection } from "@/components/home/fitur-section";
import { ArtikelSection } from "@/components/home/artikel-section";
import { FAQSection } from "@/components/home/faq-section";
import { TentangKamiSection } from "@/components/home/tentang-kami-section";
import { CTASection } from "@/components/ui/cta-section";

export default function Home() {
  return (
    <>
      <Hero />
      <MasaNifasSection />
      <MentalHealthSection />
      <EPDSSection />
      <MagnesiumSection />
      <FiturSection />
      <ArtikelSection />
      <FAQSection />
      <TentangKamiSection />
      <CTASection
        headline="Mulai menjaga kesehatan Anda sejak masa nifas."
        description="Kenali kondisi fisik dan mental Anda lebih awal bersama Nifas Care."
        buttonLabel="Mulai Skrining"
        buttonHref="/skrining"
      />
    </>
  );
}
