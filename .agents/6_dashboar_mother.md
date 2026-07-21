# AGENT 05

# Sprint 6 — Dashboard Ibu

## Project

Monitoring Ibu Nifas

---

# Tujuan

Membangun Dashboard utama bagi Mother.

Dashboard berfungsi sebagai pusat aktivitas Mother.

Dashboard **bukan tempat mengisi assessment**, tetapi menjadi halaman yang menampilkan seluruh tugas, status, dan perkembangan Mother selama mengikuti program monitoring.

Dashboard harus sederhana, mudah dipahami, dan ramah bagi pengguna yang tidak memiliki latar belakang teknologi.

---

# Prasyarat

Sprint berikut telah selesai.

- Authentication
- Mother Onboarding
- Midwife Verification
- Assessment Engine Foundation

Mother harus memiliki status:

ACTIVE

---

# Konsep Dashboard

Dashboard menggunakan pendekatan:

Task Dashboard

Bukan

Information Dashboard

Tujuan Dashboard adalah membantu Mother mengetahui:

- Apa yang harus dilakukan hari ini
- Assessment apa yang tersedia
- Progress yang telah dicapai
- Review dari tenaga kesehatan

---

# Business Flow

Mother Login

↓

Dashboard

↓

Melihat Assignment

↓

Memilih Assignment

↓

Mulai Assessment

↓

Submit

↓

Kembali ke Dashboard

↓

Melihat Status Review

---

# Menu Sidebar

- Dashboard
- Assessment
- Riwayat
- Profil

Belum menampilkan menu lain.

---

# Dashboard Sections

## Greeting

Tampilkan sapaan.

Contoh.

Selamat Pagi, Ibu Anita.

---

## Hari Nifas

Hitung otomatis berdasarkan:

Tanggal Persalinan

Contoh.

Hari ke-12 Masa Nifas

---

## Tugas Hari Ini

Section paling penting.

Menampilkan seluruh Assignment yang dapat dikerjakan.

Contoh.

EPDS

Belum Dikerjakan

↓

Mulai

---

Magnesium

Belum Dikerjakan

↓

Mulai

---

Jika tidak ada Assignment.

Tampilkan Empty State.

Belum ada tugas hari ini.

---

# Assignment Card

Minimal menampilkan.

- Nama Assessment
- Status
- Jadwal
- Due Date
- Tombol

Status Assignment.

- Belum Dimulai
- Sedang Dikerjakan
- Menunggu Review
- Selesai
- Terlambat

---

# Status Assessment

Setelah Mother Submit.

Status berubah menjadi.

Menunggu Review Bidan

atau

Sedang Direview

atau

Selesai

Dashboard harus mengambil informasi dari Assessment Engine.

Jangan membuat status baru.

---

# Progress Program

Tampilkan progress sederhana.

Contoh.

Progress Monitoring

70%

Perhitungan berdasarkan jumlah Assignment yang telah selesai dibandingkan total Assignment yang diberikan.

---

# Timeline Aktivitas

Urutkan aktivitas terbaru.

Contoh.

Onboarding Disetujui

↓

EPDS Dikirim

↓

Direview Bidan

↓

Direview Dokter

↓

Selesai

---

# Catatan Terbaru

Tampilkan maksimal 3 catatan terbaru.

Sumber catatan dapat berasal dari.

- Bidan
- Dokter
- Ahli Gizi

Belum perlu fitur balasan.

Mother hanya membaca.

---

# Assessment

Halaman Assessment hanya menampilkan daftar Assignment.

Mother tidak dapat membuat Assessment baru.

Mother hanya dapat membuka Assignment yang diberikan sistem.

---

# Empty State

Jika belum ada Assignment.

Tampilkan ilustrasi sederhana.

Pesan.

Belum ada assessment yang tersedia.

Silakan menunggu jadwal berikutnya.

---

# Route

/dashboard

/assessment

/history

/profile

---

# Authorization

Mother hanya dapat melihat data miliknya sendiri.

Tidak dapat mengakses Assignment Mother lain.

---

# Assignment Rules

Assignment dibuat oleh sistem.

Mother tidak dapat.

- membuat Assignment
- menghapus Assignment
- mengubah jadwal Assignment

Mother hanya dapat.

- membuka Assignment
- mengisi Assessment
- melihat status
- melihat riwayat

---

# UI Guidelines

Gunakan tampilan yang sederhana.

Prioritaskan keterbacaan.

Gunakan card.

Gunakan badge untuk status.

Gunakan timeline vertikal untuk aktivitas.

Gunakan progress bar sederhana.

Hindari dashboard yang penuh grafik.

Target pengguna adalah ibu nifas.

---

# Folder Structure

modules/

mother/

├── dashboard/
│   ├── components/
│   ├── actions/
│   ├── services/
│   └── types/
│
├── assessment/
│
└── profile/

Dashboard harus menggunakan Assessment Engine.

Jangan membuat workflow baru.

---

# Integration

Dashboard mengambil data dari.

Assessment Engine

↓

Assignment

↓

Assessment

↓

Review

↓

Timeline

Semua status harus berasal dari Assessment Engine.

---

# Coding Rules

- TypeScript Strict
- Server Components
- Server Actions
- Prisma ORM
- Auth.js
- Zod
- Reusable Components
- Domain Driven Structure
- Jangan menggunakan REST API

---

# Yang Tidak Dikerjakan

Jangan membuat.

- Form EPDS
- Form Magnesium
- Reminder
- Dashboard Bidan
- Dashboard Dokter
- Dashboard Ahli Gizi
- Reporting

---

# Acceptance Criteria

✓ Mother dapat melihat Dashboard.

✓ Hari nifas dihitung otomatis.

✓ Assignment ditampilkan dengan benar.

✓ Mother dapat membuka Assignment.

✓ Progress monitoring tampil.

✓ Timeline aktivitas tampil.

✓ Catatan tenaga kesehatan tampil.

✓ Dashboard hanya menggunakan data dari Assessment Engine.

✓ Mother tidak dapat membuat Assignment sendiri.

✓ Dashboard siap digunakan untuk Sprint berikutnya, yaitu Modul EPDS.
