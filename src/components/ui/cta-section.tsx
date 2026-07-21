import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

interface CTASectionProps {
  headline: string;
  description?: string;
  buttonLabel: string;
  buttonHref: string;
  id?: string;
}

export function CTASection({
  headline,
  description,
  buttonLabel,
  buttonHref,
  id,
}: CTASectionProps) {
  return (
    <section id={id} className="py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-white/10" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-white/10" aria-hidden="true" />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
            <h2 className="font-heading text-2xl font-semibold text-balance text-primary-foreground sm:text-3xl">
              {headline}
            </h2>
            {description && (
              <p className="text-pretty text-primary-foreground/85">{description}</p>
            )}
            <Button
              size="lg"
              variant="secondary"
              render={<Link href={buttonHref} />}
              className="h-11 px-6 text-base"
            >
              {buttonLabel}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
