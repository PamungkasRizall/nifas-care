# AGENT 13

# Sprint 13 — Reminder Engine

## Project

Monitoring Ibu Nifas

---

# Tujuan

Membangun Reminder Engine yang bertugas menentukan kapan Notification harus dibuat.

Reminder Engine tidak mengirim Notification.

Reminder Engine hanya menghasilkan Business Event.

Notification dikirim oleh Notification Center.

---

# Prasyarat

Sprint sebelumnya telah selesai.

- Notification Center
- Assessment Schedule Engine
- Clinical Management Workspace

---

# Business Flow

Reminder Rule

↓

Reminder Engine

↓

Business Event

↓

Notification Center

↓

Email

↓

In-App Notification

---

# Scope Sprint

Implementasi.

- Reminder Rule
- Reminder Engine
- Reminder Scheduler
- Reminder History

---

# Konsep

Reminder Engine hanya bertugas.

- membaca Rule
- mengevaluasi kondisi
- menghasilkan Business Event

Reminder Engine tidak mengetahui Channel Notification.

---

# Reminder Rule

Gunakan entity.

reminder_rules

Minimal.

- Code
- Name
- Trigger
- Offset
- Active

Rule berasal dari database.

Bukan hardcode.

---

# Trigger

Contoh.

ASSESSMENT_AVAILABLE

ASSESSMENT_DUE

ASSESSMENT_OVERDUE

FOLLOWUP_DUE

INTERVENTION_SCHEDULED

---

# Offset

Contoh.

Hari H

H-1

H-3

H+1

---

# Reminder Event

Reminder Engine menghasilkan.

REMINDER_CREATED

Notification Center menentukan.

- Recipient
- Template
- Channel

---

# Reminder Scheduler

Untuk MVP.

Reminder Engine dijalankan secara manual melalui Service.

Arsitektur harus siap dipanggil Scheduler/Cron pada masa mendatang.

Business Logic Reminder tidak boleh bergantung pada Cron.

---

# Reminder History

Simpan.

- Rule
- Recipient
- Assessment
- Trigger Date
- Status

---

# Database

reminder_rules

- id
- code
- trigger
- offset
- isActive

---

reminder_histories

- id
- ruleId
- recipientId
- assessmentId
- triggeredAt

---

# Reminder Default

Mother.

- Assignment Baru
- H-1 Due Date
- Hari H
- Terlambat Mengisi

Midwife.

- Assessment Baru
- Priority HIGH
- Priority URGENT

Doctor.

- Assessment Menunggu Review

Nutritionist.

- Assessment Magnesium Menunggu Review

---

# Folder Structure

src/

modules/

reminder/

engine/

rules/

services/

scheduler/

history/

actions/

types/

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

Reminder Engine tidak boleh mengirim Email.

Reminder Engine tidak boleh membuat Notification secara langsung.

---

# Yang Tidak Dikerjakan

Jangan membuat.

- WhatsApp
- SMS
- Push Notification

---

# Acceptance Criteria

✓ Reminder Rule berhasil dibuat.

✓ Reminder Engine berhasil dibuat.

✓ Rule berasal dari database.

✓ Reminder menghasilkan Business Event.

✓ Notification Center menerima Event.

✓ Reminder History tersimpan.

✓ Reminder Engine reusable.

---

# Definition of Done

- Seluruh Acceptance Criteria terpenuhi.
- Reminder tidak bergantung pada Notification Channel.
- Reminder dapat digunakan seluruh Assessment.
- Arsitektur siap diintegrasikan dengan Scheduler pada masa mendatang.
