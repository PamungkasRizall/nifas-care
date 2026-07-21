import {
  HeartPulse,
  CalendarClock,
  Activity,
  Brain,
  Stethoscope,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import type { InfoCard } from "@/types";

export const nifasCards: InfoCard[] = [
  {
    icon: HeartPulse,
    title: "Apa Itu Masa Nifas",
    description:
      "Masa nifas adalah periode pemulihan setelah melahirkan, saat tubuh ibu berangsur kembali ke kondisi sebelum hamil.",
  },
  {
    icon: CalendarClock,
    title: "Lama Masa Nifas",
    description:
      "Umumnya berlangsung sekitar 6 minggu (40 hari) sejak hari persalinan hingga organ reproduksi pulih sepenuhnya.",
  },
  {
    icon: Activity,
    title: "Perubahan Tubuh",
    description:
      "Rahim mengecil, muncul lokia (perdarahan nifas), payudara mulai memproduksi ASI, dan luka persalinan berangsur pulih.",
  },
  {
    icon: Brain,
    title: "Perubahan Hormon",
    description:
      "Kadar hormon estrogen dan progesteron turun drastis, memengaruhi suasana hati, energi, dan kualitas tidur ibu.",
  },
  {
    icon: Stethoscope,
    title: "Jadwal Kontrol",
    description:
      "Kunjungan pemeriksaan nifas disarankan pada 6 jam, 6 hari, dan 6 minggu pertama untuk memantau pemulihan ibu.",
  },
  {
    icon: ShieldCheck,
    title: "Hal yang Normal",
    description:
      "Rasa lelah, sedikit murung (baby blues), nyeri ringan, dan perubahan emosi umumnya wajar pada minggu pertama.",
  },
  {
    icon: AlertTriangle,
    title: "Tanda Bahaya",
    description:
      "Demam tinggi, perdarahan hebat, nyeri kepala berat, atau pikiran menyakiti diri perlu penanganan medis segera.",
  },
];
