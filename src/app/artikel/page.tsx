import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SectionTitle } from "@/components/ui/section-title";
import { ArticleCard } from "@/components/ui/article-card";
import { articles } from "@/lib/data/articles";

export const metadata: Metadata = {
  title: "Artikel Edukasi",
  description:
    "Kumpulan artikel edukasi seputar masa nifas, kesehatan mental ibu, dan pentingnya magnesium setelah melahirkan.",
  alternates: { canonical: "/artikel" },
};

export default function ArtikelPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="flex flex-col gap-12">
        <SectionTitle
          eyebrow="Artikel Edukasi"
          title="Semua Artikel"
          description="Bacaan seputar masa nifas, kesehatan mental, dan nutrisi untuk membantu Anda menjalani masa pemulihan dengan lebih tenang."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </Container>
    </div>
  );
}
