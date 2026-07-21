"use client";

import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useActiveSection } from "@/hooks/use-active-section";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { HeartHandshake, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const SECTION_IDS = NAV_LINKS.filter((link) => link.href.startsWith("/#")).map(
  (link) => link.href.slice(2),
);

function isLinkActive(
  href: string,
  pathname: string,
  activeSection: string | null,
) {
  if (href.startsWith("/#")) {
    return pathname === "/" && activeSection === href.slice(2);
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface NavbarProps {
  isLoggedIn: boolean;
  dashboardHref: string;
}

export function Navbar({ isLoggedIn, dashboardHref }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const activeSection = useActiveSection(SECTION_IDS);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/#home"
          className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <HeartHandshake className="size-5" aria-hidden="true" />
          </span>
          Nifas Care
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-1 lg:flex"
        >
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.href, pathname, activeSection);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                  active ? "bg-primary/10 text-primary" : "text-foreground/80",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            variant="ghost"
            render={<Link href={isLoggedIn ? dashboardHref : "/login"} />}
            nativeButton={false}
          >
            {isLoggedIn ? "Dashboard" : "Login"}
          </Button>
          <Button render={<Link href="/skrining" />} nativeButton={false}>
            Mulai Skrining
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Buka menu" />
            }
          >
            <Menu className="size-5" aria-hidden="true" />
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-xs">
            <SheetHeader>
              <SheetTitle>Menu Nifas Care</SheetTitle>
            </SheetHeader>
            <nav
              aria-label="Navigasi mobile"
              className="flex flex-col gap-1 px-4"
            >
              {NAV_LINKS.map((link) => {
                const active = isLinkActive(link.href, pathname, activeSection);
                return (
                  <SheetClose
                    key={link.href}
                    render={
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-foreground/80",
                        )}
                      />
                    }
                  >
                    {link.label}
                  </SheetClose>
                );
              })}
            </nav>
            <div className="mt-auto flex flex-col gap-2 p-4">
              <SheetClose
                render={
                  <Button
                    variant="outline"
                    render={
                      <Link href={isLoggedIn ? dashboardHref : "/login"} />
                    }
                    nativeButton={false}
                    className="w-full"
                  />
                }
              >
                {isLoggedIn ? "Dashboard" : "Login"}
              </SheetClose>
              {isLoggedIn && <LogoutButton className="w-full" />}
              <SheetClose
                render={
                  <Button
                    render={<Link href="/skrining" />}
                    nativeButton={false}
                    className="w-full"
                  />
                }
              >
                Mulai Skrining
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
