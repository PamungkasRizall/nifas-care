import { Construction } from "lucide-react";
import { Container } from "@/components/layout/container";
import { LogoutButton } from "@/components/auth/logout-button";

interface DashboardPlaceholderProps {
  title: string;
  description: string;
  userName?: string | null;
}

export function DashboardPlaceholder({ title, description, userName }: DashboardPlaceholderProps) {
  return (
    <div className="flex min-h-[70vh] items-center py-16">
      <Container className="flex flex-col items-center gap-6 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Construction className="size-8" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-2">
          {userName && <p className="text-sm text-muted-foreground">Halo, {userName}</p>}
          <h1 className="font-heading text-2xl font-semibold text-balance text-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="max-w-md text-pretty text-muted-foreground">{description}</p>
        </div>
        <LogoutButton />
      </Container>
    </div>
  );
}
