# AGENT 01

# Identity & Access Management

Project:
Monitoring Ibu Nifas

---

# Objective

Bangun pondasi autentikasi, otorisasi, session management, dan role management untuk seluruh aplikasi Monitoring Ibu Nifas.

Tahap ini belum membangun fitur klinis seperti EPDS, Magnesium, Dashboard Dokter, Dashboard Bidan, maupun Dashboard Ahli Gizi.

Authentication harus dapat mendukung seluruh role yang akan digunakan pada fase berikutnya.

---

# Technology

- Next.js App Router
- Auth.js
- Prisma ORM
- PostgreSQL
- TypeScript
- Tailwind CSS

---

# Authentication

Gunakan Google OAuth.

Tidak menggunakan email/password.

Semua user dibuat otomatis ketika pertama kali login menggunakan Google.

---

# User Flow

Homepage

↓

Login Google

↓

Auth.js

↓

Check User

↓

User belum ada

↓

Create User

↓

Role = MOTHER

↓

Redirect ke Profile Onboarding

---

Jika user sudah ada

↓

Load Session

↓

Redirect berdasarkan Role

---

# Roles

Gunakan enum Prisma.

enum Role {

ADMIN

DOCTOR

MIDWIFE

NUTRITIONIST

MOTHER

RESEARCHER

}

---

# Role Description

ADMIN

Mengelola seluruh sistem.

DOCTOR

Review assessment klinis yang membutuhkan evaluasi dokter.

MIDWIFE

Reviewer pertama seluruh assessment yang dikirim oleh ibu.

NUTRITIONIST

Reviewer assessment nutrisi.

MOTHER

Mengisi assessment.

RESEARCHER

Melihat data penelitian sesuai hak akses.

Tidak dapat mengubah data pasien.

---

# Future Clinical Workflow

Authentication harus dipersiapkan untuk workflow berikut.

Mother

↓

Submit Assessment

↓

Reviewer Level 1

↓

Reviewer Level 2

↓

Completed

Contoh implementasi:

EPDS

Level 1

MIDWIFE

↓

Level 2

DOCTOR

Magnesium

Level 1

MIDWIFE

↓

Level 2

NUTRITIONIST

Workflow ini BELUM diimplementasikan pada Agent ini.

Hanya menjadi dasar desain.

---

# Default Role

Semua user baru memiliki role

MOTHER

Role lain hanya dapat diberikan oleh ADMIN.

---

# Session

Gunakan Auth.js Session.

Session harus tersedia pada Server Component.

---

# Route Protection

Public

/

/about

/articles

/faq

/login

Protected

/profile

/dashboard

/admin

/doctor

/midwife

/nutritionist

/research

---

# Authorization

ADMIN

Full Access.

DOCTOR

Dashboard Dokter.

MIDWIFE

Dashboard Bidan.

NUTRITIONIST

Dashboard Ahli Gizi.

MOTHER

Dashboard Ibu.

RESEARCHER

Dashboard Penelitian.

---

# User Model

Minimal memiliki:

id

name

email

image

role

createdAt

updatedAt

Belum membuat tabel profil.

---

# Middleware

Middleware bertugas:

Authentication

Role Checking

Redirect

---

# Login Page

Halaman sederhana.

Logo aplikasi.

Button

Login with Google

---

# Logout

Logout

↓

Homepage

---

# Folder

app/

(auth)/

login/

dashboard/

components/

lib/

auth/

middleware.ts

---

# Coding Rules

- Server Components First
- TypeScript Strict
- Prisma ORM
- Auth.js
- Zod
- Tanpa REST API
- Gunakan Server Actions bila diperlukan

---

# Out of Scope

Jangan membuat:

Profile

Enrollment

EPDS

Magnesium

Dashboard

Notification

Reporting

Clinical Workflow

---

# Acceptance Criteria

✓ Google Login berhasil

✓ Session aktif

✓ User otomatis dibuat

✓ Default role = MOTHER

✓ Middleware berjalan

✓ Protected Route berjalan

✓ Redirect berdasarkan role berjalan

✓ Struktur aplikasi siap untuk pengembangan modul klinis berikutnya.
