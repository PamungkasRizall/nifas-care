import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: `Disclaimer penggunaan konten edukasi dan alat bantu skrining pada ${SITE_CONFIG.name}.`,
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <AlertTriangle className="size-5" aria-hidden="true" />
          </span>
          <h1 className="font-heading text-3xl font-semibold text-foreground">Disclaimer</h1>
        </div>

        <div className="mt-8 flex flex-col gap-5 text-base leading-relaxed text-foreground/90">
          <p>
            {SITE_CONFIG.name} hanya bertujuan sebagai media edukasi dan alat bantu skrining awal terkait
            kesehatan masa nifas, kesehatan mental ibu, dan pentingnya asupan magnesium.
          </p>
          <p>
            Seluruh konten yang tersedia, termasuk kuesioner EPDS, <strong>bukan merupakan diagnosis medis</strong>.
            Hasil skrining tidak dapat menggantikan pemeriksaan dan penilaian langsung oleh tenaga kesehatan
            profesional.
          </p>
          <p>
            Kami sangat menganjurkan Anda untuk selalu berkonsultasi dengan dokter, bidan, atau tenaga kesehatan
            terpercaya mengenai kondisi kesehatan fisik maupun mental Anda, terutama apabila Anda mengalami gejala
            yang mengkhawatirkan.
          </p>
          <p>
            Jika Anda atau seseorang yang Anda kenal berada dalam kondisi darurat atau memiliki pikiran untuk
            menyakiti diri sendiri, segera hubungi layanan gawat darurat atau tenaga kesehatan terdekat.
          </p>
        </div>
      </Container>
    </div>
  );
}
