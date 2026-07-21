# AGENT 12

# Sprint 12 — Infrastruktur Notifikasi

## Project

Monitoring Ibu Nifas

---

# Tujuan

Membangun Notification Center sebagai infrastruktur notifikasi yang reusable untuk seluruh sistem.

Notification Center bertugas menerima Business Event, membuat Notification, dan mengirimkannya melalui Channel yang tersedia.

Pada Sprint ini tersedia dua channel.

- In-App Notification
- Email

Reminder belum diimplementasikan pada Sprint ini.

---

# Prasyarat

Sprint sebelumnya telah selesai.

- Authentication
- Mother Onboarding
- Assessment Engine
- Clinical Management Workspace
- Assessment Schedule Engine
- Assessment Asupan Magnesium

---

# Business Flow

Business Event

↓

Notification Center

↓

Notification

↓

Recipient

↓

Notification Channel

↓

In-App

↓

Email

---

# Scope Sprint

Implementasi.

- Notification Center
- Notification Channel
- Email Channel
- In-App Notification
- Notification Bell
- Notification List
- Notification History

Belum mengimplementasikan Reminder.

---

# Konsep

Notification Center menjadi satu-satunya domain yang bertugas mengirim notifikasi.

Business Module tidak boleh mengirim Email ataupun membuat Notification secara langsung.

---

# Notification Channel

Gunakan enum.

EMAIL

IN_APP

Arsitektur harus mendukung penambahan channel baru.

Contoh.

WHATSAPP

SMS

PUSH

---

# Business Event

Minimal.

MOTHER_ACTIVATED

ASSESSMENT_ASSIGNED

ASSESSMENT_SUBMITTED

ASSESSMENT_REJECTED

ASSESSMENT_COMPLETED

CLINICAL_INTERVENTION_CREATED

FOLLOWUP_CREATED

---

# Notification

Notification berisi.

- Event
- Recipient
- Title
- Message
- Channel
- Status
- Created At

---

# Notification Status

UNREAD

READ

ARCHIVED

---

# Notification Recipient

Notification harus dapat dikirim kepada.

- Mother
- Midwife
- Doctor
- Nutritionist
- Researcher
- Admin

---

# Email Channel

Email merupakan implementasi pertama Notification Channel.

Gunakan interface.

NotificationChannel

Implementasi.

EmailChannel

Notification Center tidak boleh bergantung pada Email Provider tertentu.

---

# In-App Notification

Tambahkan Notification Bell.

Dashboard menampilkan jumlah Notification yang belum dibaca.

Klik Bell membuka Notification List.

---

# Notification List

Tampilkan.

- Judul
- Isi
- Waktu
- Status

User dapat.

- Tandai sudah dibaca
- Tandai semua sudah dibaca
- Arsipkan

---

# Notification History

Seluruh Notification harus tercatat.

Digunakan untuk audit.

---

# Database

notifications

Minimal.

- id
- event
- recipientId
- recipientRole
- title
- message
- channel
- status
- createdAt
- readAt

---

# Folder Structure

src/

modules/

notification/

channels/

email/

in-app/

services/

events/

templates/

actions/

components/

types/

interfaces/

---

# UI

Tambahkan.

- Notification Bell
- Notification Dropdown
- Notification Page

Gunakan UI sederhana.

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

---

# Yang Tidak Dikerjakan

Jangan membuat.

- Reminder
- WhatsApp
- SMS
- Push Notification

---

# Acceptance Criteria

✓ Notification Center berhasil dibuat.

✓ In-App Notification berjalan.

✓ Email Channel berjalan.

✓ Notification Bell tampil.

✓ Notification List berjalan.

✓ Read / Unread berjalan.

✓ Notification History tersimpan.

✓ Business Module tidak mengirim Notification secara langsung.

---

# Definition of Done

- Seluruh Acceptance Criteria terpenuhi.
- Tidak ada hardcode Channel.
- Notification Center reusable untuk seluruh domain.
