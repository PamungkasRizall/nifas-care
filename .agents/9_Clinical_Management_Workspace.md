# AGENT 09

# Sprint 9 — Clinical Management Workspace

## Project

Monitoring Ibu Nifas

---

# Tujuan

Membangun Clinical Review Workspace sebagai halaman kerja utama bagi Reviewer Level 2.

Workspace ini digunakan oleh seluruh Reviewer Level 2 seperti:

- DOCTOR
- NUTRITIONIST

Workspace menggabungkan tiga proses utama.

- Assessment Review
- Clinical Decision
- Clinical Intervention

Seluruh proses dilakukan dalam satu halaman kerja.

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
- Clinical Decision Engine

---

# Business Flow

Mother

↓

Assessment

↓

Review Bidan

↓

Clinical Review Workspace

↓

Clinical Decision

↓

Clinical Intervention

↓

Completed

---

# Scope Sprint

Sprint ini hanya mengimplementasikan.

- Queue Reviewer Level 2
- Detail Assessment
- Clinical Decision
- Clinical Intervention
- Complete Assessment

Belum mengimplementasikan.

- Reminder
- Dashboard Peneliti
- Reporting

---

# Workspace

Workspace merupakan halaman kerja Reviewer Level 2.

Reviewer tidak berpindah halaman.

Semua proses dilakukan pada satu halaman.

Workspace terdiri dari.

1. Informasi Mother

2. Informasi Assessment

3. Jawaban Assessment

4. Score

5. Interpretation

6. Priority

7. Clinical Decision

8. Clinical Intervention

9. Follow Up

10. Riwayat Review

---

# Queue

Queue hanya menampilkan assessment.

Status.

UNDER_REVIEW

Queue dibangun berdasarkan.

Assessment Manifest

↓

Reviewer Level 2

Contoh.

Role

DOCTOR

↓

EPDS

Role

NUTRITIONIST

↓

MAGNESIUM

Workflow tidak boleh menggunakan hardcode.

---

# Assessment

Assessment ditampilkan menggunakan.

Assessment Player

Mode.

READ ONLY

Jangan membuat UI baru.

---

# Score

Tampilkan.

- Total Score
- Interpretation
- Priority

Score berasal dari module assessment.

Workspace tidak menghitung score.

---

# Clinical Decision

Reviewer wajib membuat Clinical Decision.

Minimal.

- Decision
- Note

Decision merupakan kesimpulan klinis.

Decision tidak dibuat otomatis.

---

# Clinical Intervention

Reviewer dapat menambahkan.

Satu atau lebih intervention.

Jenis intervention.

- COUNSELING
- EDUCATION
- REFERRAL
- HOME_VISIT
- PSYCHOTHERAPY

Intervention harus mudah diperluas.

---

# Follow Up

Reviewer dapat menentukan.

- Follow Up Date
- Follow Up Note

Belum mengirim Reminder.

Reminder dibuat pada sprint berikutnya.

---

# Complete Assessment

Jika seluruh proses selesai.

Assessment Status.

COMPLETED

Assessment menjadi read only.

Mother hanya dapat melihat hasil.

---

# Reject

Reviewer dapat melakukan.

REJECTED

Assessment kembali ke Mother.

Status.

REJECTED

Mother dapat memperbaiki assessment.

Workflow kembali dimulai dari Review Level 1.

---

# Review History

Workspace menampilkan seluruh riwayat.

- Submit Mother
- Review Bidan
- Clinical Decision
- Intervention
- Follow Up

Urut berdasarkan waktu.

---

# Authorization

Workspace hanya dapat diakses oleh.

Reviewer Level 2

Role ditentukan oleh.

Assessment Manifest.

Contoh.

EPDS

↓

DOCTOR

Magnesium

↓

NUTRITIONIST

Jangan menggunakan hardcode.

---

# Folder Structure

src/

modules/

review/

workspace/

components/

actions/

services/

types/

Clinical Decision tetap berada pada.

modules/

clinical/

Workspace hanya menggunakan service.

---

# UI Guidelines

Gunakan tampilan profesional.

Prioritaskan efisiensi.

Gunakan.

- Card
- Badge
- Timeline
- Read Only Assessment
- Section yang jelas
- Sticky Action Panel

Hindari popup yang berlebihan.

Seluruh proses review dilakukan pada satu halaman.

---

# Coding Rules

- Next.js App Router
- TypeScript Strict
- Server Components First
- Server Actions
- Prisma ORM
- PostgreSQL
- Auth.js
- Tailwind CSS
- Zod Validation
- Domain Driven Structure
- SOLID Principle
- DRY Principle

Jangan menggunakan REST API.

Jangan menggunakan hardcode jenis assessment.

---

# Yang Tidak Dikerjakan

Jangan membuat.

- Reminder
- Dashboard Peneliti
- Reporting
- Export Data
- Notifikasi

---

# Acceptance Criteria

✓ Reviewer Level 2 dapat melihat Queue.

✓ Queue dibangun berdasarkan Manifest.

✓ Assessment ditampilkan menggunakan Assessment Player dalam mode Read Only.

✓ Score, Interpretation, dan Priority tampil.

✓ Reviewer dapat membuat Clinical Decision.

✓ Reviewer dapat menambahkan satu atau lebih Clinical Intervention.

✓ Reviewer dapat menentukan Follow Up.

✓ Assessment dapat diselesaikan.

✓ Assessment dapat dikembalikan ke Mother.

✓ Riwayat workflow tampil.

✓ Workflow dapat digunakan oleh seluruh assessment.

---

# Definition of Done (DoD)

Sprint dianggap selesai apabila.

- Seluruh Acceptance Criteria terpenuhi.
- Tidak ada error TypeScript.
- Tidak ada error Prisma Migration.
- Tidak ada warning ESLint yang kritis.
- Seluruh Server Action tervalidasi menggunakan Zod.
- Workspace dapat digunakan oleh seluruh Reviewer Level 2 tanpa perubahan kode.
- Tidak ada hardcode berdasarkan jenis assessment.
