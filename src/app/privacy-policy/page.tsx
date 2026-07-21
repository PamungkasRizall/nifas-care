import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SITE_CONFIG, CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Kebijakan privasi ${SITE_CONFIG.name} mengenai bagaimana data pengguna dikumpulkan, digunakan, dan dilindungi.`,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <h1 className="font-heading text-3xl font-semibold text-foreground">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Terakhir diperbarui: 11 Juli 2026</p>

        <div className="mt-8 flex flex-col gap-6 text-base leading-relaxed text-foreground/90">
          <p>
            {SITE_CONFIG.name} menghargai privasi Anda. Halaman ini menjelaskan bagaimana kami memperlakukan
            informasi yang Anda berikan saat menggunakan website edukasi ini.
          </p>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">Data yang Dikumpulkan</h2>
            <p className="mt-2 text-muted-foreground">
              Pada fase saat ini, website hanya menyediakan konten edukasi publik. Kami tidak mengumpulkan data
              pribadi seperti nama, alamat, atau riwayat kesehatan melalui website ini.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">Penggunaan Data</h2>
            <p className="mt-2 text-muted-foreground">
              Apabila di kemudian hari fitur skrining EPDS dan pemantauan magnesium diaktifkan, data yang Anda
              masukkan akan digunakan semata-mata untuk membantu proses skrining dan pemantauan kesehatan Anda,
              serta dapat ditinjau oleh tenaga kesehatan yang berkolaborasi dengan kami.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">Keamanan Data</h2>
            <p className="mt-2 text-muted-foreground">
              Kami berkomitmen untuk melindungi data pengguna dengan praktik keamanan yang wajar dan tidak akan
              membagikan data pribadi kepada pihak ketiga tanpa persetujuan Anda, kecuali diwajibkan oleh hukum.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">Hubungi Kami</h2>
            <p className="mt-2 text-muted-foreground">
              Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini, silakan hubungi kami melalui{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-primary hover:underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
