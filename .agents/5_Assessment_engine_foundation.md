# AGENT 04

# Sprint 5 — Assessment Engine Foundation

## Project

Monitoring Ibu Nifas

---

# Tujuan

Membangun pondasi (engine) untuk seluruh assessment pada aplikasi.

Engine ini bertanggung jawab mengelola:

- Assignment assessment
- Status assessment
- Workflow review
- Riwayat review
- Catatan reviewer

Engine ini **tidak menghitung skor EPDS** dan **tidak menghitung asupan Magnesium**.

Perhitungan setiap assessment akan dibuat pada sprint masing-masing.

---

# Konsep

Assessment Engine adalah fondasi bersama.

Semua assessment menggunakan alur yang sama.

Contoh:

EPDS

Mother

↓

Submit

↓

Review Bidan

↓

Review Dokter

↓

Selesai

---

Magnesium

Mother

↓

Submit

↓

Review Bidan

↓

Review Ahli Gizi

↓

Selesai

---

Perbedaan hanya pada:

- pertanyaan
- jawaban
- algoritma penilaian
- reviewer level 2

---

# Business Flow

Mother

↓

Mengisi Assessment

↓

Submit

↓

Status

SUBMITTED

↓

Review Bidan

↓

UNDER_REVIEW

↓

Review Lanjutan

↓

COMPLETED

---

# Scope Sprint

Sprint ini hanya membangun pondasi.

Belum membuat:

- Form EPDS
- Form Magnesium
- Dashboard
- Perhitungan skor

---

# Assessment Type

Gunakan enum.

enum AssessmentType {

EPDS

MAGNESIUM

}

Assessment lain dapat ditambahkan pada masa mendatang.

---

# Assessment Status

Gunakan enum.

enum AssessmentStatus {

DRAFT

SUBMITTED

UNDER_REVIEW

REJECTED

COMPLETED

}

---

# Reviewer Level

Level 1

MIDWIFE

Level 2

Tergantung jenis assessment.

EPDS

↓

DOCTOR

Magnesium

↓

NUTRITIONIST

---

# Workflow

Assessment dibuat oleh Mother.

↓

Mother Submit.

↓

Status

SUBMITTED

↓

Midwife Review.

↓

Jika disetujui.

↓

UNDER_REVIEW

↓

Reviewer Level 2.

↓

COMPLETED

Jika ditolak.

↓

REJECTED

↓

Mother memperbaiki.

↓

Submit ulang.

---

# Database

Buat struktur yang reusable.

## assessments

Menyimpan informasi utama assessment.

Minimal:

- id
- motherId
- type
- status
- submittedAt
- completedAt
- createdAt
- updatedAt

---

## assessment_reviews

Menyimpan proses review.

Minimal:

- id
- assessmentId
- reviewerId
- reviewerRole
- status
- note
- reviewedAt

Satu assessment dapat memiliki banyak review.

---

# Business Rules

Assessment hanya dapat dibuat oleh:

MOTHER

---

Mother hanya dapat melihat assessment miliknya sendiri.

---

Reviewer hanya dapat melihat assessment yang sesuai dengan role.

Contoh:

DOCTOR

Hanya melihat EPDS.

---

NUTRITIONIST

Hanya melihat Magnesium.

---

MIDWIFE

Melihat seluruh assessment yang menunggu review level pertama.

---

# Assignment

Engine harus mendukung satu Mother memiliki banyak assessment.

Contoh.

EPDS Minggu Pertama

EPDS Minggu Kedua

Magnesium Minggu Pertama

Magnesium Minggu Kedua

---

# Riwayat

Assessment harus memiliki riwayat review.

Contoh.

Submit

↓

Review Bidan

↓

Review Dokter

↓

Completed

Semua aktivitas harus dapat ditelusuri.

---

# Server Actions

Gunakan Server Actions.

Jangan menggunakan REST API.

---

# Route

Belum membuat halaman Dashboard.

Sprint ini hanya menyiapkan struktur data.

---

# Folder Structure

lib/

assessment/

├── engine.ts

├── workflow.ts

├── status.ts

├── permission.ts

actions/

assessment/

types/

assessment/

---

# Coding Rules

- TypeScript Strict
- Prisma ORM
- Auth.js
- Server Components
- Server Actions
- Zod Validation
- Reusable Code
- SOLID Principle
- Hindari hardcode workflow

---

# Yang Tidak Dikerjakan

Jangan membuat:

- Form EPDS
- Form Magnesium
- Dashboard Mother
- Dashboard Bidan
- Dashboard Dokter
- Dashboard Ahli Gizi
- Reminder
- Reporting

---

# Acceptance Criteria

✓ Struktur Assessment siap digunakan.

✓ Assessment memiliki status.

✓ Assessment memiliki riwayat review.

✓ Assessment dapat memiliki lebih dari satu reviewer.

✓ Workflow dapat digunakan ulang oleh EPDS maupun Magnesium.

✓ Tidak ada logika khusus EPDS maupun Magnesium pada sprint ini.

✓ Pondasi siap digunakan untuk Sprint berikutnya.
