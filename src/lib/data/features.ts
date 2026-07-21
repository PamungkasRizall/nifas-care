import {
  GraduationCap,
  ClipboardList,
  LineChart,
  Stethoscope,
  History,
} from "lucide-react";
import type { FeatureItem } from "@/types";

export const platformFeatures: FeatureItem[] = [
  {
    icon: GraduationCap,
    title: "Edukasi",
    description: "Materi edukasi seputar masa nifas, kesehatan mental, dan nutrisi yang mudah dipahami.",
    available: true,
  },
  {
    icon: ClipboardList,
    title: "Skrining EPDS",
    description: "Isi kuesioner EPDS untuk membantu mengenali risiko baby blues dan depresi postpartum.",
    available: false,
  },
  {
    icon: LineChart,
    title: "Monitoring Magnesium",
    description: "Pantau asupan magnesium harian untuk mendukung pemulihan fisik dan mental ibu.",
    available: false,
  },
  {
    icon: Stethoscope,
    title: "Review Dokter",
    description: "Hasil skrining dapat ditinjau oleh tenaga kesehatan untuk rekomendasi lebih lanjut.",
    available: false,
  },
  {
    icon: History,
    title: "Riwayat Pengisian",
    description: "Lihat kembali riwayat pengisian EPDS dan asupan magnesium dari waktu ke waktu.",
    available: false,
  },
];
