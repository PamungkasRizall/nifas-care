import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { ArticleCard } from "@/components/ui/article-card";
import { articles, getArticleBySlug } from "@/lib/data/articles";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Artikel Tidak Ditemukan" };
  }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/artikel/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = articles.filter((item) => item.slug !== article.slug).slice(0, 2);
  const formattedDate = new Date(article.date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <Link
          href="/artikel"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Kembali ke Artikel
        </Link>

        <div className="mt-6 flex flex-col gap-4">
          <Badge variant="secondary" className="w-fit">
            {article.category}
          </Badge>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden="true" />
              <time dateTime={article.date}>{formattedDate}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden="true" />
              {article.readTime}
            </span>
          </div>
        </div>

        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
          <Image src={article.image} alt={article.title} fill className="object-cover" priority />
        </div>

        <div className="mt-10 flex flex-col gap-5">
          {article.content.map((paragraph, index) => (
            <p key={index} className="text-base leading-relaxed text-pretty text-foreground/90">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-muted/60 p-5 text-sm text-muted-foreground">
          Informasi ini bersifat edukatif dan bukan pengganti diagnosis medis. Selalu konsultasikan kondisi
          kesehatan Anda kepada dokter atau tenaga kesehatan.
        </div>

        {relatedArticles.length > 0 && (
          <div className="mt-16 flex flex-col gap-6">
            <h2 className="font-heading text-xl font-semibold text-foreground">Artikel Lainnya</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.slug} article={related} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </article>
  );
}
