"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { submitOnboarding } from "../actions/mother";
import { OnboardingData, OnboardingSchema } from "../lib/validators";

export default function OnboardingForm() {
  const router = useRouter();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(OnboardingSchema) as any,
    defaultValues: {
      hypertension: false,
      diabetes: false,
      preEclampsia: false,
      anxietyDisorder: false,
      depressionHistory: false,
      privacyPolicyConsent: false,
      dataProcessingConsent: false,
      researchParticipationConsent: false,
    },
  });

  const onSubmit = (data: unknown) => {
    startTransition(async () => {
      const result = await submitOnboarding(data as OnboardingData);
      if (result && !result.success) {
        alert(
          result.message ||
            "Gagal mengirimkan data onboarding. Silakan periksa kembali data Anda.",
        );
        console.error(result.errors);
      } else {
        // Update session di sisi client agar status baru terbaca di middleware
        await update({ status: "PENDING_MIDWIFE_REVIEW" });
        router.push("/onboarding/pending");
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Personal Info */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Informasi Pribadi</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nama Lengkap</label>
            <input {...register("fullName")} className="border rounded p-2" />
            {errors.fullName && (
              <span className="text-red-500 text-sm">
                {errors.fullName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nomor Telepon</label>
            <input
              {...register("phoneNumber")}
              className="border rounded p-2"
              placeholder="+62..."
            />
            {errors.phoneNumber && (
              <span className="text-red-500 text-sm">
                {errors.phoneNumber.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tanggal Lahir</label>
            <input
              type="date"
              {...register("dateOfBirth")}
              className="border rounded p-2"
            />
            {errors.dateOfBirth && (
              <span className="text-red-500 text-sm">
                {errors.dateOfBirth.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Pendidikan Terakhir</label>
            <input {...register("education")} className="border rounded p-2" />
            {errors.education && (
              <span className="text-red-500 text-sm">
                {errors.education.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Pekerjaan</label>
            <input {...register("occupation")} className="border rounded p-2" />
            {errors.occupation && (
              <span className="text-red-500 text-sm">
                {errors.occupation.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Alamat Lengkap</label>
          <textarea
            {...register("address")}
            className="border rounded p-2"
            rows={3}
          />
          {errors.address && (
            <span className="text-red-500 text-sm">
              {errors.address.message}
            </span>
          )}
        </div>
      </section>

      {/* Delivery Info */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Informasi Persalinan</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tanggal Persalinan</label>
            <input
              type="date"
              {...register("deliveryDate")}
              className="border rounded p-2"
            />
            {errors.deliveryDate && (
              <span className="text-red-500 text-sm">
                {errors.deliveryDate.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Metode Persalinan</label>
            <select
              {...register("deliveryMethod")}
              className="border rounded p-2"
            >
              <option value="">Pilih Metode</option>
              <option value="Normal">Normal (Spontan)</option>
              <option value="Caesarean Section">Sectio Caesarea (Sesar)</option>
              <option value="Vacuum">Vakum (Vacuum)</option>
              <option value="Forceps">Forsep (Forceps)</option>
            </select>
            {errors.deliveryMethod && (
              <span className="text-red-500 text-sm">
                {errors.deliveryMethod.message}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pregnancy Info */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Riwayat Kehamilan</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Gravida (Kehamilan Ke-)
            </label>
            <input
              type="number"
              {...register("gravida")}
              className="border rounded p-2"
            />
            {errors.gravida && (
              <span className="text-red-500 text-sm">
                {errors.gravida.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Paritas (Jumlah Persalinan)
            </label>
            <input
              type="number"
              {...register("parity")}
              className="border rounded p-2"
            />
            {errors.parity && (
              <span className="text-red-500 text-sm">
                {errors.parity.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Abortus / Keguguran (opsional)
            </label>
            <input
              type="number"
              {...register("abortus")}
              className="border rounded p-2"
            />
            {errors.abortus && (
              <span className="text-red-500 text-sm">
                {errors.abortus.message}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Baby Info */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Informasi Bayi</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nama Bayi (opsional)</label>
            <input {...register("babyName")} className="border rounded p-2" />
            {errors.babyName && (
              <span className="text-red-500 text-sm">
                {errors.babyName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Jenis Kelamin</label>
            <select {...register("babyGender")} className="border rounded p-2">
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Male">Laki-laki</option>
              <option value="Female">Perempuan</option>
            </select>
            {errors.babyGender && (
              <span className="text-red-500 text-sm">
                {errors.babyGender.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Berat Badan Lahir (kg)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("birthWeight")}
              className="border rounded p-2"
            />
            {errors.birthWeight && (
              <span className="text-red-500 text-sm">
                {errors.birthWeight.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Panjang Badan Lahir (cm)
            </label>
            <input
              type="number"
              step="0.1"
              {...register("birthLength")}
              className="border rounded p-2"
            />
            {errors.birthLength && (
              <span className="text-red-500 text-sm">
                {errors.birthLength.message}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Medical History */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Riwayat Medis / Penyakit</h2>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("hypertension")} />
            Hipertensi (Tekanan Darah Tinggi)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("diabetes")} />
            Diabetes (Gula Darah Tinggi)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("preEclampsia")} />
            Pre-eklampsia
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("anxietyDisorder")} />
            Gangguan Kecemasan (Anxiety Disorder)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("depressionHistory")} />
            Riwayat Depresi / Baby Blues
          </label>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Kontak Darurat</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nama Kontak</label>
            <input
              {...register("emergencyContactName")}
              className="border rounded p-2"
            />
            {errors.emergencyContactName && (
              <span className="text-red-500 text-sm">
                {errors.emergencyContactName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Hubungan / Kerabat</label>
            <input
              {...register("emergencyContactRelationship")}
              className="border rounded p-2"
            />
            {errors.emergencyContactRelationship && (
              <span className="text-red-500 text-sm">
                {errors.emergencyContactRelationship.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nomor Telepon</label>
            <input
              {...register("emergencyContactPhone")}
              className="border rounded p-2"
            />
            {errors.emergencyContactPhone && (
              <span className="text-red-500 text-sm">
                {errors.emergencyContactPhone.message}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Consent */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Persetujuan Tindakan</h2>

        <div className="space-y-2">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              {...register("privacyPolicyConsent")}
              className="mt-1"
            />
            <div>
              <span className="text-sm">Saya menyetujui Kebijakan Privasi</span>
              {errors.privacyPolicyConsent && (
                <p className="text-red-500 text-sm">
                  {errors.privacyPolicyConsent.message}
                </p>
              )}
            </div>
          </label>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              {...register("dataProcessingConsent")}
              className="mt-1"
            />
            <div>
              <span className="text-sm">
                Saya menyetujui Pemrosesan Data Medis
              </span>
              {errors.dataProcessingConsent && (
                <p className="text-red-500 text-sm">
                  {errors.dataProcessingConsent.message}
                </p>
              )}
            </div>
          </label>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              {...register("researchParticipationConsent")}
              className="mt-1"
            />
            <div>
              <span className="text-sm">
                Saya menyetujui Partisipasi dalam Penelitian Kesehatan
              </span>
              {errors.researchParticipationConsent && (
                <p className="text-red-500 text-sm">
                  {errors.researchParticipationConsent.message}
                </p>
              )}
            </div>
          </label>
        </div>
      </section>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer"
      >
        {isPending ? "Mengirimkan..." : "Kirim Data Onboarding"}
      </button>
    </form>
  );
}
