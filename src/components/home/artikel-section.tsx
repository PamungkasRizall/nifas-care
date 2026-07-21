import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionTitle } from "@/components/ui/section-title";
import { ArticleCard } from "@/components/ui/article-card";
import { FadeIn } from "@/components/motion/fade-in";
import { articles } from "@/lib/data/articles";

export function ArtikelSection() {
  const latestArticles = articles.slice(0, 3);

  return (
    <section id="artikel" className="py-16 sm:py-24">
      <Container className="flex flex-col gap-12">
        <FadeIn className="flex flex-col items-center gap-6 text-center">
          <SectionTitle
            eyebrow="Artikel Edukasi"
            title="Bacaan Terbaru untuk Ibu Nifas"
            description="Kumpulan artikel edukasi seputar masa nifas, kesehatan mental, dan nutrisi yang disusun untuk membantu Anda menjalani masa pemulihan."
          />
          <Link
            href="/artikel"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Lihat Semua Artikel
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </FadeIn>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestArticles.map((article, index) => (
            <FadeIn key={article.slug} delay={index * 0.08}>
              <ArticleCard article={article} />
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
