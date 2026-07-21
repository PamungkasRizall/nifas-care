# AGENT 07

# Sprint 8 — Review Assessment Level 1 oleh Bidan

## Project

Monitoring Ibu Nifas

---

# Tujuan

Membangun workflow Review Level 1 oleh Bidan.

Workflow ini bersifat generic dan digunakan oleh seluruh assessment pada sistem.

Sprint ini tidak dibuat khusus untuk EPDS.

EPDS hanya menjadi assessment pertama yang menggunakan workflow ini.

Assessment lain seperti Magnesium, PSQI, GAD-7, dan assessment berikutnya harus dapat menggunakan workflow yang sama tanpa perubahan struktur aplikasi.

---

# Prasyarat

Sprint sebelumnya telah selesai.

- Authentication
- Mother Onboarding
- Verifikasi Bidan
- Assessment Engine
- Dashboard Mother
- Assessment Player
- Modul EPDS

---

# Business Flow

Mother

↓

Submit Assessment

↓

Assessment Status

SUBMITTED

↓

Masuk Queue Bidan

↓

Review Bidan

↓

APPROVED

↓

Assessment Status

UNDER_REVIEW

↓

Diteruskan ke Reviewer Level 2

atau

↓

REJECTED

↓

Mother memperbaiki jawaban

↓

Submit ulang

---

# Scope Sprint

Sprint ini hanya mengimplementasikan.

- Dashboard Bidan
- Queue Review
- Detail Assessment
- Review Assessment
- Approve
- Reject

Belum mengimplementasikan.

- Dashboard Dokter
- Dashboard Ahli Gizi
- Reminder
- Reporting

---

# Dashboard Bidan

Dashboard Bidan berfungsi sebagai halaman kerja (work queue).

Bukan dashboard statistik.

Prioritaskan daftar assessment yang membutuhkan tindakan.

---

# Sidebar

- Dashboard
- Review Assessment
- Profil

---

# Dashboard

Tampilkan informasi sederhana.

- Jumlah Assessment Menunggu Review
- Jumlah Assessment Direview Hari Ini
- Jumlah Assessment Selesai Hari Ini

Tidak perlu grafik.

---

# Queue Assessment

Tampilkan seluruh assessment yang:

Status

SUBMITTED

Minimal informasi.

- Nama Mother
- Hari Nifas
- Jenis Assessment
- Tanggal Submit
- Status
- Tombol Review

Queue tidak boleh dibatasi hanya EPDS.

Queue harus mendukung seluruh jenis assessment.

---

# Filtering

Minimal.

- Semua
- EPDS
- Magnesium

Filter harus berdasarkan Assessment Manifest.

Jangan menggunakan hardcode.

---

# Detail Assessment

Saat Bidan membuka assessment.

Tampilkan.

- Informasi Mother
- Informasi Assessment
- Jawaban Assessment
- Skor Assessment
- Interpretasi
- Riwayat Review
- Catatan

Assessment ditampilkan menggunakan Assessment Player dalam mode Read Only.

Jangan membuat tampilan baru khusus Bidan.

---

# Review

Bidan dapat memberikan.

- Catatan
- Keputusan

Keputusan.

- APPROVED
- REJECTED

Catatan wajib diisi apabila memilih REJECTED.

---

# Approve

Jika Bidan memilih.

APPROVED

Maka.

Assessment Status

↓

UNDER_REVIEW

Assessment diteruskan ke Reviewer Level 2.

Reviewer Level 2 diperoleh dari Assessment Manifest.

Contoh.

EPDS

↓

DOCTOR

Magnesium

↓

NUTRITIONIST

Workflow tidak boleh di-hardcode.

---

# Reject

Jika Bidan memilih.

REJECTED

Maka.

Assessment Status

↓

REJECTED

Mother dapat membuka kembali Assessment dan memperbaiki jawaban.

Assessment tetap menggunakan Assignment yang sama.

Tidak membuat Assignment baru.

---

# Review History

Setiap review harus disimpan.

Minimal.

- Reviewer
- Role
- Decision
- Note
- Reviewed At

History digunakan pada seluruh assessment.

---

# Authorization

Hanya user dengan Role.

MIDWIFE

yang dapat mengakses halaman review level 1.

Mother tidak dapat mengakses halaman ini.

---

# Assessment Manifest

Workflow reviewer tidak boleh di-hardcode.

Assessment Player dan Review Engine harus membaca reviewer berikutnya dari Manifest.

Contoh.

EPDS

Level 1

MIDWIFE

Level 2

DOCTOR

Magnesium

Level 1

MIDWIFE

Level 2

NUTRITIONIST

---

# Folder Structure

src/

modules/

midwife/

dashboard/

review/

components/

actions/

services/

types/

Assessment Engine

Review/

Workflow/

History/

---

# UI Guidelines

Gunakan tampilan sederhana.

Prioritaskan kecepatan review.

Gunakan.

- Table
- Badge
- Card
- Read Only Assessment
- Modal Konfirmasi Approve
- Modal Konfirmasi Reject

Tidak perlu chart.

---

# Coding Rules

- Next.js App Router
- TypeScript Strict
- Server Components First
- Server Actions
- Prisma ORM
- Auth.js
- PostgreSQL
- Zod Validation
- Tailwind CSS
- Domain Driven Structure
- SOLID Principle
- DRY Principle

Jangan menggunakan REST API.

---

# Yang Tidak Dikerjakan

Jangan membuat.

- Dashboard Dokter
- Dashboard Ahli Gizi
- Reminder
- Reporting
- Statistik Lanjutan
- Export Data

---

# Acceptance Criteria

✓ Bidan dapat melihat Dashboard Review.

✓ Bidan dapat melihat seluruh assessment yang menunggu review.

✓ Queue mendukung seluruh jenis assessment.

✓ Bidan dapat membuka detail assessment.

✓ Assessment ditampilkan menggunakan Assessment Player dalam mode Read Only.

✓ Skor dan interpretasi assessment ditampilkan.

✓ Bidan dapat memberikan catatan.

✓ Bidan dapat melakukan APPROVED.

✓ Bidan dapat melakukan REJECTED.

✓ Catatan wajib diisi saat REJECTED.

✓ Status assessment berubah sesuai keputusan.

✓ Assessment yang APPROVED diteruskan ke Reviewer Level 2 berdasarkan Manifest.

✓ Riwayat review tersimpan.

✓ Workflow dapat digunakan kembali oleh seluruh assessment tanpa perubahan struktur aplikasi.

---

# Definition of Done (DoD)

Sprint dianggap selesai apabila.

- Seluruh Acceptance Criteria terpenuhi.
- Tidak ada error TypeScript.
- Tidak ada error Prisma Migration.
- Tidak ada warning ESLint yang kritis.
- Seluruh Server Action tervalidasi menggunakan Zod.
- UI responsif pada desktop dan mobile.
- Workflow review tidak menggunakan hardcode jenis assessment.
- Review Level 1 dapat digunakan oleh assessment lain tanpa perubahan kode.
