import Link from "next/link";
import { HeartHandshake, Mail } from "lucide-react";
import { Container } from "@/components/layout/container";
import { NAV_LINKS, FOOTER_LINKS, CONTACT_EMAIL, SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-sage-50/60">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/#home" className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <HeartHandshake className="size-5" aria-hidden="true" />
              </span>
              {SITE_CONFIG.name}
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Platform edukasi dan pemantauan ibu nifas untuk membantu menjaga kesehatan fisik dan mental setelah persalinan.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <Mail className="size-4" aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground">Menu</h3>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground">Legal</h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {SITE_CONFIG.name}. Seluruh hak cipta dilindungi.</p>
          <p className="max-w-xl">
            Website ini hanya bertujuan sebagai media edukasi dan alat bantu skrining. Hasil skrining bukan diagnosis medis.
          </p>
        </div>
      </Container>
    </footer>
  );
}
