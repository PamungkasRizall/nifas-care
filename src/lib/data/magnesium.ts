import { Leaf, CircleDot, Square, Banana, Wheat, Nut, Fish } from "lucide-react";
import type { MagnesiumFood } from "@/types";

export const magnesiumFoods: MagnesiumFood[] = [
  { icon: Leaf, name: "Bayam" },
  { icon: CircleDot, name: "Tempe" },
  { icon: Square, name: "Tahu" },
  { icon: Banana, name: "Pisang" },
  { icon: Wheat, name: "Oatmeal" },
  { icon: Nut, name: "Almond" },
  { icon: Fish, name: "Ikan" },
];

export const magnesiumInfo = {
  apa: "Magnesium adalah mineral penting yang berperan dalam ratusan fungsi tubuh, termasuk kerja otot, saraf, dan produksi energi.",
  mengapa:
    "Bagi ibu nifas, magnesium membantu menjaga kestabilan suasana hati, kualitas tidur, serta mendukung pemulihan fisik dan produksi ASI.",
  dampak:
    "Kekurangan magnesium dapat memicu kram otot, kelelahan berlebih, gangguan tidur, serta memperberat kecemasan dan suasana hati yang tidak stabil.",
};
