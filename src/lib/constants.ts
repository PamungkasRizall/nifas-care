import type { NavLink } from "@/types";

export const SITE_CONFIG = {
  name: "Nifas Care",
  title: "Nifas Care — Platform Edukasi & Pemantauan Ibu Nifas",
  description:
    "Platform edukasi dan pemantauan ibu nifas untuk membantu menjaga kesehatan fisik dan mental setelah persalinan. Kenali masa nifas, skrining EPDS, dan pentingnya magnesium.",
  url: "https://nifas.care",
  keywords: [
    "nifas",
    "ibu nifas",
    "masa nifas",
    "EPDS",
    "depresi postpartum",
    "baby blues",
    "magnesium ibu menyusui",
    "kesehatan ibu setelah melahirkan",
    "skrining postpartum",
  ],
};

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/#home" },
  { label: "Masa Nifas", href: "/#masa-nifas" },
  { label: "EPDS", href: "/#epds" },
  { label: "Magnesium", href: "/#magnesium" },
  { label: "Artikel", href: "/artikel" },
  { label: "FAQ", href: "/#faq" },
  { label: "Tentang Kami", href: "/#tentang-kami" },
];

export const FOOTER_LINKS: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export const CONTACT_EMAIL = "halo@nifas.care";
