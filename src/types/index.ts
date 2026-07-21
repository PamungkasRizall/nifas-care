import type { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
}

export interface InfoCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  available: boolean;
}

export interface MagnesiumFood {
  icon: LucideIcon;
  name: string;
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  date: string;
  readTime: string;
  image: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
