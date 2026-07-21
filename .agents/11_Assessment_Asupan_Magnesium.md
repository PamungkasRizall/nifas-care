# AGENT 11

# Sprint 11 — Assessment Asupan Magnesium

## Project

Monitoring Ibu Nifas

---

# Tujuan

Mengimplementasikan Assessment Asupan Magnesium sebagai assessment kedua pada sistem.

Sprint ini bertujuan membuktikan bahwa Assessment Engine, Assessment Player, Clinical Management Workspace, dan Assessment Schedule Engine dapat digunakan kembali tanpa perubahan arsitektur.

Assessment Asupan Magnesium hanya menambahkan business logic baru.

Tidak membangun engine baru.

---

# Prasyarat

Sprint sebelumnya telah selesai.

- Authentication
- Mother Onboarding
- Verifikasi Bidan
- Assessment Engine
- Dashboard Mother
- Assessment Player
- EPDS
- Review Level 1
- Clinical Management Workspace
- Assessment Schedule Engine

---

# Business Flow

Mother

↓

Dashboard

↓

Assignment Magnesium

↓

Assessment Player

↓

Submit

↓

Review Bidan

↓

Clinical Management Workspace

↓

Nutritionist

↓

Clinical Decision

↓

Clinical Intervention

↓

Completed

---

# Scope Sprint

Sprint ini hanya mengimplementasikan.

- Assessment Asupan Magnesium
- Perhitungan Asupan
- Interpretasi
- Registrasi Assessment
- Jadwal Assessment

Tidak mengimplementasikan.

- Reminder
- Reporting
- Dashboard Peneliti

---

# Konsep

Assessment Asupan Magnesium merupakan Assessment Module.

Module mengikuti Assessment Contract yang telah dibuat.

Module tidak boleh mengubah Assessment Engine.

Module tidak boleh mengubah Assessment Player.

---

# Assessment Template

Tambahkan Template baru.

Code

MAGNESIUM

Reviewer Level 1

MIDWIFE

Reviewer Level 2

NUTRITIONIST

Template didaftarkan pada Assessment Registry.

---

# Assessment Schedule

Tambahkan Schedule.

Contoh.

Hari ke-14

Hari ke-28

Jadwal hanya berupa data.

Jangan menggunakan hardcode.

---

# Assessment Manifest

Manifest minimal.

- Code
- Name
- Description
- Version
- Reviewer Level 1
- Reviewer Level 2

Manifest tidak menyimpan Schedule.

---

# Questions

Implementasikan seluruh pertanyaan Assessment Asupan Magnesium sesuai instrumen penelitian yang digunakan.

Question dapat menggunakan.

- Radio
- Number
- Select

Gunakan komponen yang sudah dimiliki Assessment Player.

---

# Validation

Pastikan.

- seluruh pertanyaan wajib dijawab
- nilai valid
- hanya Mother yang memiliki Assignment yang dapat mengisi

---

# Calculator

Implementasikan.

calculator.ts

Calculator bertugas.

- menghitung total asupan magnesium
- menghitung hasil assessment

Assessment Player tidak boleh menghitung hasil.

---

# Interpreter

Implementasikan.

interpreter.ts

Interpreter bertugas.

- mengubah hasil perhitungan menjadi interpretasi

Contoh.

- Cukup
- Kurang
- Sangat Kurang

Interpretasi mengikuti pedoman penelitian.

---

# Priority

Module dapat menghasilkan Priority.

LOW

NORMAL

HIGH

URGENT

Priority digunakan oleh Clinical Management Workspace.

---

# Clinical Management

Assessment Asupan Magnesium menggunakan Clinical Management Workspace yang sudah ada.

Tidak membuat Workspace baru.

Reviewer Level 2 adalah.

NUTRITIONIST

---

# Clinical Intervention

Assessment Asupan Magnesium menggunakan Intervention yang sudah tersedia.

Contoh.

- EDUCATION
- COUNSELING
- REFERRAL

Tidak membuat jenis Intervention baru kecuali benar-benar diperlukan.

---

# Assessment Registry

Daftarkan Assessment.

MAGNESIUM

ke Registry.

Assessment Player harus dapat mengenali Module secara otomatis.

---

# Folder Structure

src/

modules/

assessment/

magnesium/

manifest.ts

questions.ts

validator.ts

calculator.ts

interpreter.ts

service.ts

Module hanya berisi business logic.

---

# Seeder

Tambahkan.

Assessment Template

MAGNESIUM

Tambahkan.

Assessment Schedule

sesuai jadwal penelitian.

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

Jangan mengubah Assessment Engine.

Jangan mengubah Assessment Player.

---

# Yang Tidak Dikerjakan

Jangan membuat.

- Reminder
- Dashboard Peneliti
- Reporting
- Engine baru
- Workflow baru

---

# Acceptance Criteria

✓ Assessment Template MAGNESIUM berhasil dibuat.

✓ Assessment Schedule berhasil ditambahkan.

✓ Assessment terdaftar pada Registry.

✓ Assessment Player dapat menampilkan Assessment Asupan Magnesium tanpa perubahan kode.

✓ Calculator berhasil menghitung hasil Assessment.

✓ Interpreter menghasilkan interpretasi.

✓ Priority berhasil dihasilkan.

✓ Assignment dibuat otomatis oleh Assessment Schedule Engine.

✓ Review Level 1 menggunakan Bidan.

✓ Clinical Management Workspace digunakan kembali.

✓ Reviewer Level 2 menggunakan Nutritionist.

✓ Clinical Intervention menggunakan Engine yang sudah ada.

✓ Tidak ada perubahan pada Assessment Engine.

✓ Tidak ada perubahan pada Assessment Player.

---

# Definition of Done (DoD)

Sprint dianggap selesai apabila.

- Seluruh Acceptance Criteria terpenuhi.
- Tidak ada error TypeScript.
- Tidak ada error Prisma Migration.
- Tidak ada warning ESLint yang kritis.
- Seluruh Server Action tervalidasi menggunakan Zod.
- Assessment Asupan Magnesium berjalan menggunakan seluruh infrastruktur yang sudah ada tanpa modifikasi arsitektur.
