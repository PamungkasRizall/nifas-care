# AGENT 06

# Sprint 7 — Assessment Player & EPDS Module

## Project

Monitoring Ibu Nifas

---

# Tujuan

Membangun halaman Assessment Player yang digunakan oleh seluruh assessment pada aplikasi.

Assessment Player adalah antarmuka (UI) generik yang bertugas menampilkan informasi assessment, pertanyaan, navigasi, validasi, serta proses submit.

Sprint ini juga mengimplementasikan assessment pertama, yaitu EPDS, menggunakan Assessment Player.

Assessment berikutnya seperti Magnesium, PSQI, GAD-7, dan lainnya harus dapat menggunakan Assessment Player yang sama tanpa membuat ulang UI.

---

# Prasyarat

Sprint sebelumnya telah selesai.

- Authentication
- Mother Onboarding
- Midwife Verification
- Assessment Engine
- Dashboard Mother

---

# Konsep

Dashboard

↓

Assignment

↓

Assessment Player

↓

Assessment Module

↓

Submit

↓

Assessment Engine

↓

Workflow Review

Assessment Player tidak mengetahui cara menghitung skor.

Assessment Player hanya mengetahui cara menampilkan assessment.

Perhitungan dilakukan oleh Assessment Module.

---

# Business Flow

Mother Login

↓

Dashboard

↓

Pilih Assignment

↓

Assessment Player

↓

Isi Jawaban

↓

Submit

↓

Assessment Engine

↓

Review Bidan

---

# Assessment Player

Assessment Player bersifat reusable.

Komponen ini harus dapat digunakan oleh seluruh assessment.

Tanggung jawab:

- Menampilkan judul assessment
- Menampilkan deskripsi
- Menampilkan progress
- Menampilkan pertanyaan
- Validasi input
- Navigasi pertanyaan
- Ringkasan jawaban
- Submit assessment

Assessment Player tidak boleh mengetahui algoritma EPDS.

---

# EPDS Module

Sprint ini hanya mengimplementasikan assessment:

EPDS

Gunakan Assessment Player.

Jangan membuat halaman khusus EPDS di luar Assessment Player.

---

# EPDS Information

Assessment Name

Edinburgh Postnatal Depression Scale (EPDS)

Jumlah Pertanyaan

10

Jawaban setiap pertanyaan mengikuti standar EPDS.

Gunakan pilihan jawaban resmi.

Jangan mengubah isi maupun urutan pertanyaan.

---

# Navigation

Assessment Player mendukung.

- Next
- Previous
- Save Draft
- Submit

Mother dapat kembali ke pertanyaan sebelumnya sebelum submit.

---

# Validation

Semua pertanyaan wajib dijawab sebelum submit.

Tidak boleh ada jawaban kosong.

Tampilkan pesan validasi yang jelas.

---

# Save Draft

Mother dapat menyimpan draft.

Status Assessment:

DRAFT

Saat dibuka kembali.

Jawaban sebelumnya harus tetap tersedia.

---

# Submit

Saat submit.

Status berubah menjadi:

SUBMITTED

Selanjutnya Assessment Engine akan meneruskan workflow review.

Assessment Player tidak menangani proses review.

---

# Review

Sprint ini belum membuat halaman review.

Setelah submit.

Mother hanya melihat status.

Menunggu Review Bidan

---

# Scoring

Perhitungan skor dibuat pada:

modules/epds/score.ts

Assessment Player tidak boleh melakukan perhitungan skor.

---

# Interpretation

Interpretasi hasil EPDS dibuat pada:

modules/epds/interpreter.ts

Contoh.

Skor rendah

↓

Risiko rendah

Skor tinggi

↓

Perlu perhatian

Interpretasi belum ditampilkan kepada Mother.

Sprint ini hanya menyiapkan modul.

---

# Folder Structure

src/

modules/

assessment/

player/

├── components/
├── actions/
├── hooks/
├── types/

epds/

├── questions.ts
├── score.ts
├── interpreter.ts
├── service.ts
├── validator.ts
└── types.ts

Assessment Player harus dapat menggunakan module EPDS tanpa hardcode.

---

# UI

Assessment Player terdiri dari.

Header

↓

Progress Bar

↓

Question Card

↓

Answer Options

↓

Navigation

↓

Submit

Gunakan tampilan sederhana.

Fokus pada keterbacaan.

Target pengguna adalah ibu nifas.

---

# Progress

Progress dihitung berdasarkan jumlah pertanyaan yang telah dijawab.

Contoh.

4 dari 10 pertanyaan.

---

# Review Summary

Sebelum submit.

Tampilkan ringkasan jawaban.

Mother dapat kembali memperbaiki jawaban.

---

# Business Rules

Mother hanya dapat membuka Assignment miliknya sendiri.

Assessment yang sudah:

COMPLETED

Tidak dapat diedit.

Assessment yang:

DRAFT

Dapat dilanjutkan.

Assessment yang:

REJECTED

Dapat diperbaiki dan dikirim ulang.

---

# Coding Rules

- TypeScript Strict
- Server Components
- Server Actions
- Prisma ORM
- Auth.js
- Zod
- Domain Driven Structure
- Reusable Components
- Jangan menggunakan REST API

---

# Yang Tidak Dikerjakan

Jangan membuat.

- Dashboard Bidan
- Dashboard Dokter
- Dashboard Ahli Gizi
- Reminder
- Reporting
- Assessment Magnesium

---

# Acceptance Criteria

✓ Mother dapat membuka Assignment EPDS.

✓ Assessment Player digunakan sebagai UI.

✓ Seluruh pertanyaan EPDS tampil.

✓ Progress berjalan dengan benar.

✓ Draft dapat disimpan.

✓ Validasi berjalan.

✓ Ringkasan jawaban tampil sebelum submit.

✓ Assessment dapat dikirim.

✓ Status berubah menjadi SUBMITTED.

✓ Assessment Player dapat digunakan kembali oleh assessment lain tanpa perubahan struktur.
