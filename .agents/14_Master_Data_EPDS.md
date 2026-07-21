# AGENT

# Clinical Content — EPDS Clinical Rules & Implementation

## Project

Monitoring Ibu Nifas

---

# Tujuan

Menyelesaikan seluruh aturan klinis EPDS hingga siap digunakan oleh aplikasi.

Dokumen ini menjadi acuan implementasi Assessment Engine, Prisma Seeder, dan seluruh workflow klinis EPDS.

---

# Prasyarat

Telah tersedia:

- Assessment Template EPDS
- 10 Pertanyaan EPDS
- Pilihan Jawaban
- Skor setiap pilihan jawaban

---

# Scope

Dokumen ini mencakup:

- Interpretation Rules
- Priority Rules
- Red Flag Rules
- Clinical Decision Rules
- Intervention Rules
- Follow Up Rules
- Prisma Seeder
- Implementasi Modul EPDS

---

# 1. Interpretation Rules

## Tujuan

Menentukan hasil interpretasi berdasarkan Total Score EPDS.

---

## Requirement

Interpretasi berasal dari Master Data.

Tidak boleh di-hardcode pada source code.

Setiap rule memiliki:

- Minimum Score
- Maximum Score
- Label
- Deskripsi
- Active

---

## Default Rule

| Min | Max | Interpretation |
|-----|-----|----------------|
| 0 | 9 | Normal |
| 10 | 12 | Risiko Depresi |
| 13 | 30 | Probable Depression |

Nilai cut-off harus dapat diubah tanpa mengubah kode aplikasi.

---

# 2. Priority Rules

Priority berasal dari Interpretation.

Priority tersedia:

- LOW
- HIGH
- URGENT

Contoh:

| Interpretation | Priority |
|---------------|----------|
| Normal | LOW |
| Risiko Depresi | HIGH |
| Probable Depression | URGENT |

Priority dapat diubah oleh Red Flag Rule.

---

# 3. Red Flag Rules

Rule khusus untuk Question 10.

Apabila jawaban menunjukkan adanya indikasi pikiran menyakiti diri sendiri, maka Priority dapat berubah menjadi URGENT walaupun Total Score rendah.

Rule dievaluasi setelah Calculator selesai.

Urutan proses:

Calculator

↓

Interpretation

↓

Red Flag Rule

↓

Priority

---

# 4. Clinical Decision Rules

Clinical Decision berasal dari Priority.

Contoh:

## LOW

- Observasi
- Edukasi

---

## HIGH

- Review Bidan
- Konseling
- Review Dokter

---

## URGENT

- Review Bidan
- Review Dokter segera
- Evaluasi Risiko
- Pertimbangkan Rujukan

Seluruh rule berasal dari Master Data.

---

# 5. Intervention Rules

Intervention berasal dari Clinical Decision.

Minimal jenis Intervention:

- Education
- Counseling
- Home Visit
- Referral
- Psychotherapy

Satu Clinical Decision dapat memiliki lebih dari satu Intervention.

---

# 6. Follow Up Rules

Follow Up berasal dari Priority.

Contoh:

| Priority | Jadwal |
|----------|---------|
| LOW | 14 Hari |
| HIGH | 7 Hari |
| URGENT | 1 Hari |

Follow Up digunakan oleh Assessment Schedule Engine dan Reminder Engine.

---

# 7. Prisma Seeder

Buat Prisma Seeder untuk seluruh Master Data EPDS.

Seeder minimal mengisi:

- Assessment Template
- Questions
- Question Options
- Interpretation Rules
- Priority Rules
- Red Flag Rules
- Clinical Decision Rules
- Intervention Rules
- Follow Up Rules

Seeder harus dapat dijalankan berulang kali tanpa menghasilkan data duplikat (idempotent).

---

# 8. Implementasi Modul EPDS

## Assessment Player

Mother mengisi 10 pertanyaan EPDS.

---

## Assessment Engine

Assessment Engine bertugas:

- Menghitung Total Score
- Menentukan Interpretation
- Menjalankan Red Flag Rule
- Menentukan Priority
- Menentukan Clinical Decision
- Menentukan Intervention
- Menentukan Follow Up

Assessment Engine tidak mengandung aturan klinis yang di-hardcode.

Seluruh aturan dibaca dari Master Data.

---

## Workflow

Mother

↓

Mengisi EPDS

↓

Assessment Engine

↓

Interpretation

↓

Priority

↓

Review Bidan

↓

Review Dokter (jika diperlukan)

↓

Clinical Decision

↓

Intervention

↓

Follow Up

↓

Reminder

---

# Output Assessment

Minimal menghasilkan:

- Total Score
- Interpretation
- Priority
- Red Flag (Ya/Tidak)
- Clinical Decision
- Intervention
- Follow Up Date
- Review Status

---

# Business Rules

- Calculator hanya menjumlahkan skor.
- Score berasal dari Option.
- Interpretation berasal dari Master Data.
- Priority berasal dari Interpretation.
- Red Flag dapat mengubah Priority.
- Clinical Decision berasal dari Priority.
- Intervention berasal dari Clinical Decision.
- Follow Up berasal dari Priority.
- Reminder berasal dari Follow Up.
- Assessment Engine tidak boleh memiliki aturan klinis yang di-hardcode.

---

# Acceptance Criteria

- Interpretation Rules lengkap.
- Priority Rules lengkap.
- Red Flag Rules lengkap.
- Clinical Decision Rules lengkap.
- Intervention Rules lengkap.
- Follow Up Rules lengkap.
- Prisma Seeder berhasil dibuat.
- Assessment Engine membaca seluruh Master Data.
- Workflow EPDS berjalan sesuai rancangan.

---

# Definition of Done

Sprint/Agent ini dianggap selesai apabila:

- Seluruh aturan klinis EPDS telah terdokumentasi.
- Seluruh Master Data siap di-seed ke database.
- Assessment Engine dapat bekerja tanpa aturan klinis yang di-hardcode.
- Modul EPDS siap diimplementasikan pada aplikasi.
