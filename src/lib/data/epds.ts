import type { InfoCard } from "@/types";
import { Lock, MousePointerClick, Zap } from "lucide-react";

export const epdsHighlights: InfoCard[] = [
  {
    icon: Zap,
    title: "Cepat",
    description: "Hanya membutuhkan waktu sekitar 5 menit untuk menyelesaikan seluruh pertanyaan.",
  },
  {
    icon: MousePointerClick,
    title: "Mudah",
    description: "Terdiri dari 10 pertanyaan sederhana seputar perasaan Anda selama 14 hari terakhir.",
  },
  {
    icon: Lock,
    title: "Rahasia",
    description: "Jawaban Anda bersifat pribadi dan hanya digunakan untuk membantu proses skrining.",
  },
];

export const epdsInfo = {
  apa: "EPDS (Edinburgh Postnatal Depression Scale) adalah kuesioner skrining yang digunakan secara luas untuk membantu mengenali gejala depresi pada ibu setelah melahirkan.",
  mengapa:
    "Baby blues dan depresi postpartum sering tidak disadari. EPDS membantu ibu dan tenaga kesehatan mengenali tanda-tanda dini agar dukungan dapat diberikan lebih cepat.",
  siapa:
    "Direkomendasikan untuk seluruh ibu nifas, terutama yang merasa cemas, sedih berkepanjangan, atau kesulitan menikmati momen bersama bayi.",
  kapan:
    "Idealnya diisi pada minggu pertama, minggu keenam, dan kapan pun ibu merasa perlu selama masa nifas.",
  lama: "Pengerjaan kuesioner rata-rata hanya membutuhkan waktu 5 menit.",
};
