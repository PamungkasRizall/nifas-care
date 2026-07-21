import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  tone?: "sage" | "blush" | "amber";
  className?: string;
}

const toneStyles: Record<NonNullable<FeatureCardProps["tone"]>, string> = {
  sage: "bg-sage-100 text-sage-700",
  blush: "bg-blush-100 text-blush-700",
  amber: "bg-amber-100 text-amber-700",
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  badge,
  tone = "sage",
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            toneStyles[tone]
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        {badge && (
          <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {badge}
          </span>
        )}
      </div>
      <div>
        <h3 className="font-heading text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
