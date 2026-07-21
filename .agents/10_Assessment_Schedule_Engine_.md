# AGENT 10

# Sprint 10 — Assessment Schedule Engine

## Project

Monitoring Ibu Nifas

---

# Tujuan

Membangun Assessment Schedule Engine sebagai domain yang bertanggung jawab menghasilkan Assignment Assessment secara otomatis berdasarkan jadwal penelitian atau SOP.

Mother tidak pernah membuat Assignment.

Assignment hanya dapat dibuat oleh Assessment Schedule Engine.

Engine harus reusable untuk seluruh jenis assessment.

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
- Review Assessment Level 1
- Clinical Management Workspace

---

# Business Flow

Mother

↓

Onboarding

↓

Review Bidan

↓

Status Mother = ACTIVE

↓

Assessment Schedule Engine

↓

Generate Assignment

↓

Dashboard Mother

↓

Assessment

---

# Scope Sprint

Sprint ini hanya mengimplementasikan.

- Assessment Template
- Assessment Schedule
- Assessment Schedule Engine
- Assignment Generator

Belum mengimplementasikan.

- Cron Job
- Reminder
- Notifikasi
- Dashboard Admin
- Dashboard Peneliti

---

# Domain

Pisahkan domain berikut.

Assessment Template

↓

Assessment Schedule

↓

Assessment Assignment

Masing-masing domain memiliki tanggung jawab sendiri.

---

# Assessment Template

Assessment Template merupakan definisi assessment.

Contoh.

- EPDS
- Magnesium

Template tidak memiliki informasi jadwal.

Minimal.

- Code
- Name
- Description
- Version
- Is Active

Template bersifat statis.

---

# Assessment Schedule

Assessment Schedule menentukan kapan Assessment dijalankan.

Schedule disimpan di database.

Bukan pada source code.

Schedule dapat berubah tanpa melakukan deploy aplikasi.

Minimal.

- Assessment Template
- Trigger Type
- Trigger Value
- Sequence
- Is Active

---

# Trigger Type

Gunakan enum.

POSTPARTUM_DAY

POSTPARTUM_WEEK

CUSTOM

Engine harus mudah diperluas.

---

# Trigger Value

Contoh.

POSTPARTUM_DAY

14

28

42

atau.

POSTPARTUM_WEEK

2

4

6

---

# Assessment Schedule Engine

Assessment Schedule Engine bertugas.

- membaca seluruh Schedule aktif
- menghitung hari nifas Mother
- menentukan Schedule yang sudah memenuhi syarat
- membuat Assignment
- mencegah Assignment ganda

Engine tidak mengubah Assessment.

Engine hanya membuat Assignment.

---

# Trigger

Pada MVP.

Assessment Schedule Engine hanya dijalankan ketika.

Status Mother berubah menjadi.

ACTIVE

Trigger dilakukan melalui Business Event.

Mother Activated

↓

Assessment Schedule Engine

↓

Generate Assignment

Assessment Schedule Engine tidak dipanggil langsung dari UI.

---

# Assignment Generator

Assignment Generator hanya membuat Assignment apabila.

- Mother berstatus ACTIVE
- Schedule sudah memenuhi syarat
- Assignment belum pernah dibuat

Generator harus bersifat idempotent.

Menjalankan Engine berkali-kali tidak boleh menghasilkan Assignment ganda.

---

# Assignment Lifecycle

Status Assignment.

PENDING

↓

AVAILABLE

↓

IN_PROGRESS

↓

SUBMITTED

↓

UNDER_REVIEW

↓

COMPLETED

atau.

REJECTED

Assignment tetap menggunakan Assessment Engine yang sudah ada.

---

# Business Rules

Mother tidak dapat membuat Assignment.

Schedule tidak boleh berada pada Assessment Module.

Schedule harus berasal dari database.

Assessment Template dapat memiliki lebih dari satu Schedule.

Schedule dapat digunakan oleh seluruh Assessment.

---

# Seeder

Buat Seeder awal.

Assessment.

EPDS

Schedule.

Hari ke-14

Hari ke-28

Hari ke-42

Seeder hanya digunakan sebagai data awal.

---

# Database

assessment_templates

Minimal.

- id
- code
- name
- description
- version
- isActive

---

assessment_schedules

Minimal.

- id
- templateId
- triggerType
- triggerValue
- sequence
- isActive

Assignment tetap menggunakan entity yang sudah ada.

---

# Folder Structure

src/

modules/

assessment/

template/

schedule/

engine/

generator/

services/

actions/

types/

Assessment Engine tetap menjadi pusat workflow.

Assessment Schedule Engine hanya bertugas menghasilkan Assignment.

---

# UI

Sprint ini tidak membuat halaman administrasi.

Data Schedule menggunakan Seeder.

Panel Admin akan dibuat apabila dibutuhkan pada masa mendatang.

---

# Coding Rules

- Next.js App Router
- TypeScript Strict
- Server Components First
- Server Actions
- Prisma ORM
- PostgreSQL
- Auth.js
- Zod Validation
- Tailwind CSS
- Domain Driven Structure
- SOLID Principle
- DRY Principle

Jangan menggunakan REST API.

Jangan melakukan hardcode jadwal Assessment.

---

# Yang Tidak Dikerjakan

Jangan membuat.

- Cron Job
- Reminder
- Notifikasi
- Dashboard Admin
- Dashboard Peneliti
- Reporting

---

# Acceptance Criteria

✓ Assessment Template berhasil dibuat.

✓ Assessment Schedule berhasil dibuat.

✓ Schedule tersimpan di database.

✓ Assessment Schedule Engine berhasil dibuat.

✓ Engine membaca Schedule dari database.

✓ Engine hanya membuat Assignment untuk Mother dengan status ACTIVE.

✓ Engine hanya membuat Assignment yang telah memenuhi jadwal.

✓ Assignment tidak pernah duplikat.

✓ Assignment Generator bersifat idempotent.

✓ Schedule dapat digunakan oleh seluruh Assessment.

✓ Assessment Module tidak menyimpan informasi jadwal.

---

# Definition of Done (DoD)

Sprint dianggap selesai apabila.

- Seluruh Acceptance Criteria terpenuhi.
- Tidak ada error TypeScript.
- Tidak ada error Prisma Migration.
- Tidak ada warning ESLint yang kritis.
- Seluruh Server Action tervalidasi menggunakan Zod.
- Assessment Schedule Engine reusable untuk seluruh Assessment.
- Business Rule tidak bergantung pada UI.
- Trigger Engine hanya berasal dari perubahan status Mother menjadi ACTIVE.
