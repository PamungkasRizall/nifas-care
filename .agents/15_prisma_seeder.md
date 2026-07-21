# 7. Prisma Seeder

## Tujuan

Mengisi seluruh Master Data EPDS secara otomatis ke database menggunakan Prisma Seeder.

Seeder harus bersifat idempotent, sehingga dapat dijalankan berkali-kali tanpa menghasilkan data duplikat.

---

## Seeder Structure

prisma/

seed/

epds/

├── assessment.seed.ts
├── questions.seed.ts
├── options.seed.ts
├── interpretation.seed.ts
├── priority.seed.ts
├── red-flag.seed.ts
├── clinical-decision.seed.ts
├── intervention.seed.ts
├── follow-up.seed.ts
└── index.ts

---

## Seeder Execution Order

1. Assessment
2. Questions
3. Options
4. Interpretation Rules
5. Priority Rules
6. Red Flag Rules
7. Clinical Decision Rules
8. Intervention Rules
9. Follow Up Rules

Urutan tidak boleh diubah.

---

## Assessment Seeder

Membuat Assessment Template EPDS.

Data minimal:

- Code
- Name
- Description
- Version
- Reviewer Level 1
- Reviewer Level 2
- Active

---

## Questions Seeder

Mengisi 10 pertanyaan EPDS.

Setiap pertanyaan memiliki:

- Code
- Order
- Question
- Required
- Active

---

## Options Seeder

Mengisi seluruh pilihan jawaban.

Setiap Option memiliki:

- Question
- Label
- Order
- Score

Score mengikuti aturan resmi EPDS.

---

## Interpretation Seeder

Mengisi seluruh rentang interpretasi.

Minimal:

- Minimum Score
- Maximum Score
- Label
- Description

---

## Priority Seeder

Mengisi relasi.

Interpretation

↓

Priority

Contoh.

Normal

↓

LOW

Risiko Depresi

↓

HIGH

Probable Depression

↓

URGENT

---

## Red Flag Seeder

Mengisi Rule khusus.

Question 10

↓

Override Priority menjadi URGENT apabila memenuhi kondisi yang ditentukan.

---

## Clinical Decision Seeder

Mengisi rekomendasi berdasarkan Priority.

Contoh.

LOW

↓

Observasi

HIGH

↓

Konseling Bidan

↓

Review Dokter

URGENT

↓

Review Dokter Segera

↓

Pertimbangkan Rujukan

---

## Intervention Seeder

Mengisi jenis Intervention.

Minimal.

- Education
- Counseling
- Home Visit
- Referral
- Psychotherapy

Beserta relasinya terhadap Clinical Decision.

---

## Follow Up Seeder

Mengisi aturan Follow Up.

Contoh.

LOW

↓

14 Hari

HIGH

↓

7 Hari

URGENT

↓

1 Hari

---

## Seed Command

Seeder dapat dijalankan melalui.

npm run db:seed

atau

npx prisma db seed

---

## Validation

Setelah Seeder berhasil dijalankan harus tersedia.

✓ 1 Assessment EPDS

✓ 10 Questions

✓ 40 Question Options

✓ Interpretation Rules

✓ Priority Rules

✓ Red Flag Rules

✓ Clinical Decision Rules

✓ Intervention Rules

✓ Follow Up Rules

Tidak boleh ada data duplikat apabila Seeder dijalankan kembali.
