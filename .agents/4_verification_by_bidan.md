# AGENT 03

# Sprint 4 — Verifikasi Data Ibu oleh Bidan

## Project

Monitoring Ibu Nifas

---

# Tujuan

Membangun proses verifikasi data onboarding oleh Bidan sebelum Ibu dapat menggunakan seluruh fitur aplikasi.

Setelah Ibu menyelesaikan proses onboarding, data tidak langsung aktif.

Seluruh data harus diverifikasi terlebih dahulu oleh Bidan.

Bidan dapat:

- Melihat daftar Ibu yang menunggu verifikasi
- Melihat detail data onboarding
- Menyetujui data
- Mengembalikan data untuk diperbaiki
- Memberikan catatan kepada Ibu

Sprint ini hanya fokus pada proses verifikasi onboarding.

Belum membahas EPDS maupun Magnesium.

---

# Prasyarat

Sprint sebelumnya telah selesai.

- Login Google
- Role
- Session
- Onboarding
- Status User

---

# Business Flow

Ibu Login

↓

Mengisi Onboarding

↓

Submit

↓

Status User

PENDING_MIDWIFE_REVIEW

↓

Dashboard Bidan

↓

Review Data

↓

Approve

↓

Status User

ACTIVE

↓

Ibu dapat mengakses Dashboard

atau

Reject

↓

Status User

PENDING_ONBOARDING

↓

Ibu memperbaiki data

↓

Submit kembali

---

# Hak Akses

Role:

MIDWIFE

Memiliki akses ke:

- Dashboard Bidan
- Daftar Verifikasi
- Detail Data Ibu
- Approve
- Reject

Tidak memiliki akses:

- Dashboard Admin
- Dashboard Dokter
- Dashboard Ahli Gizi

---

# Menu Dashboard Bidan

Sidebar

- Dashboard
- Verifikasi Data Ibu
- Profil
- Pengaturan

Sprint ini hanya mengimplementasikan menu:

Verifikasi Data Ibu

Menu lain dapat berupa placeholder.

---

# Dashboard Bidan

Tampilkan ringkasan.

Contoh

Total Menunggu Verifikasi

Total Disetujui Hari Ini

Total Dikembalikan

Gunakan card sederhana.

---

# Daftar Verifikasi

Tampilkan tabel.

Kolom:

- Nama
- Email
- Nomor HP
- Tanggal Persalinan
- Tanggal Submit
- Status
- Aksi

Status hanya:

Menunggu Verifikasi

---

# Halaman Detail

Tampilkan seluruh data onboarding.

Kelompokkan berdasarkan section.

## Data Pribadi

- Nama
- Email
- Nomor HP
- Tanggal Lahir
- Pendidikan
- Pekerjaan
- Alamat

---

## Data Persalinan

- Tanggal Persalinan
- Jenis Persalinan
- Gravida
- Paritas
- Abortus

---

## Data Bayi

- Nama Bayi
- Jenis Kelamin
- Berat Lahir
- Panjang Lahir

---

## Riwayat Penyakit

Checklist yang dipilih oleh Ibu.

---

## Kontak Darurat

- Nama
- Hubungan
- Nomor HP

---

## Persetujuan

Tampilkan seluruh consent yang telah disetujui.

---

# Review

Bidan dapat memilih:

## Setujui

Saat disetujui.

Status User berubah menjadi:

ACTIVE

Tanggal verifikasi disimpan.

ID Bidan yang melakukan verifikasi disimpan.

Catatan bersifat opsional.

---

## Kembalikan untuk Perbaikan

Jika data belum sesuai.

Status User berubah menjadi:

PENDING_ONBOARDING

Catatan wajib diisi.

Contoh:

- Nomor telepon belum lengkap.
- Tanggal persalinan belum sesuai.
- Berat lahir belum diisi.

Ibu dapat memperbaiki data dan mengirim ulang.

---

# Riwayat Verifikasi

Simpan informasi berikut.

- Status
- Diverifikasi Oleh
- Tanggal
- Catatan

Belum perlu membuat halaman riwayat.

Cukup siapkan struktur database.

---

# Tampilan untuk Ibu

Jika status:

PENDING_MIDWIFE_REVIEW

Tampilkan halaman:

## Data Sedang Diverifikasi

Isi:

Terima kasih telah melengkapi data Anda.

Saat ini data sedang diverifikasi oleh Bidan.

Silakan menunggu proses verifikasi.

Jika ada data yang perlu diperbaiki, Anda akan menerima pemberitahuan.

Jika terdapat catatan dari Bidan.

Tampilkan pada halaman ini.

---

# Middleware

Mother yang statusnya:

PENDING_MIDWIFE_REVIEW

Tidak boleh mengakses:

- Dashboard
- EPDS
- Magnesium
- Riwayat

Selalu diarahkan ke halaman:

/menunggu-verifikasi

---

# Database

Tambahkan informasi verifikasi onboarding.

Minimal menyimpan:

- status
- verifiedBy
- verifiedAt
- reviewNote

Jangan mengubah struktur User yang sudah ada jika tidak diperlukan.

---

# Validasi

Pastikan:

- User yang melakukan review adalah MIDWIFE
- User hanya dapat mereview Mother
- Data yang sudah ACTIVE tidak dapat diverifikasi ulang melalui alur onboarding
- Catatan wajib diisi saat mengembalikan data

---

# Coding Rules

- TypeScript Strict
- Server Components
- Server Actions
- Prisma ORM
- Auth.js
- Zod
- Tidak menggunakan REST API
- Gunakan reusable components

---

# Yang Tidak Dikerjakan

Jangan membuat:

- Dashboard Mother
- Dashboard Dokter
- Dashboard Ahli Gizi
- EPDS
- Magnesium
- Reminder
- Reporting

---

# Acceptance Criteria

✓ Bidan dapat melihat daftar Ibu yang menunggu verifikasi.

✓ Bidan dapat membuka detail onboarding.

✓ Bidan dapat menyetujui data.

✓ Bidan dapat mengembalikan data untuk diperbaiki.

✓ Catatan Bidan tersimpan.

✓ Status User berubah sesuai proses review.

✓ Ibu tidak dapat mengakses Dashboard sebelum status ACTIVE.

✓ Struktur aplikasi siap untuk Sprint berikutnya, yaitu Dashboard Ibu.
