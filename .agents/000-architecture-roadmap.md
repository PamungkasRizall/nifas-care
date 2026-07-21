# ARCHITECTURE ROADMAP

# Monitoring Ibu Nifas

Version: 1.0

---

# Vision

Monitoring Ibu Nifas bukan hanya aplikasi untuk mengisi kuesioner.

Aplikasi ini merupakan platform monitoring kesehatan ibu nifas yang dapat berkembang untuk berbagai instrumen penelitian dan skrining kesehatan.

Seluruh fitur harus dibangun di atas pondasi yang reusable, scalable, dan mudah dikembangkan.

---

# Core Principles

## Domain Driven Structure

Gunakan struktur project berdasarkan domain.

Bukan berdasarkan layer.

Contoh yang diinginkan.

src/

modules/

auth/

mother/

midwife/

doctor/

nutritionist/

researcher/

assessment/

epds/

magnesium/

Jangan menggunakan struktur seperti.

services/

repositories/

controllers/

helpers/

---

## Assessment Platform

Assessment adalah platform utama aplikasi.

Semua assessment harus menggunakan engine yang sama.

Assessment bukan sekadar halaman form.

Assessment terdiri dari:

Assignment

↓

Player

↓

Assessment

↓

Review

↓

History

↓

Reporting

---

# Assessment Engine

Assessment Engine adalah jantung aplikasi.

Engine bertanggung jawab terhadap:

- Assignment
- Workflow
- Status
- Permission
- Review
- History

Engine tidak mengetahui algoritma setiap assessment.

---

# Assessment Module

Setiap assessment berdiri sendiri sebagai module.

Contoh.

EPDS

Magnesium

PSQI

GAD-7

WHOQOL

dan assessment lainnya.

Setiap module hanya mengetahui business logic miliknya sendiri.

---

# Assessment Contract

Seluruh assessment wajib memiliki kontrak yang sama.

Minimal.

manifest.ts

validator.ts

service.ts

Module dapat memiliki file tambahan sesuai kebutuhan.

Contoh.

EPDS

questions.ts

score.ts

interpreter.ts

Magnesium

foods.ts

calculator.ts

interpreter.ts

---

# Assessment Registry

Seluruh assessment harus terdaftar pada Registry.

Assessment Player tidak boleh menggunakan:

if (type === EPDS)

atau

switch(type)

Gunakan Registry untuk mendapatkan module assessment.

---

# Assessment Player

Assessment Player adalah UI generik.

Assessment Player bertanggung jawab terhadap:

- menampilkan assessment
- navigasi
- progress
- validasi
- submit
- save draft

Assessment Player tidak mengetahui algoritma assessment.

---

# Assignment

Mother tidak membuat assessment.

Assessment selalu diawali dengan Assignment.

Flow.

System

↓

Assignment

↓

Mother

↓

Assessment

↓

Submit

↓

Review

Assignment bertanggung jawab terhadap.

- jadwal
- due date
- status tugas
- progress

---

# Workflow Review

Workflow review bersifat generic.

Level 1

MIDWIFE

↓

Level 2

ditentukan oleh manifest assessment.

Contoh.

EPDS

↓

DOCTOR

Magnesium

↓

NUTRITIONIST

Workflow tidak boleh di-hardcode.

---

# Dashboard

Seluruh dashboard mengambil data dari Assessment Engine.

Dashboard tidak boleh mengetahui detail assessment.

Dashboard hanya membaca.

Assignment

Assessment

Review

History

---

# User Role

Role.

ADMIN

DOCTOR

MIDWIFE

NUTRITIONIST

MOTHER

RESEARCHER

Role menentukan hak akses.

---

# User Status

Status menentukan kondisi user.

PENDING_ONBOARDING

PENDING_MIDWIFE_REVIEW

ACTIVE

SUSPENDED

Role dan Status memiliki tanggung jawab yang berbeda.

---

# Folder Structure

src/

app/

modules/

auth/

mother/

midwife/

doctor/

nutritionist/

researcher/

assessment/

engine/

registry/

player/

review/

assignment/

shared/

epds/

magnesium/

components/

hooks/

types/

lib/

prisma/

---

# Coding Standard

- Next.js App Router
- TypeScript Strict
- Server Components First
- Server Actions
- Prisma ORM
- Auth.js
- PostgreSQL
- Zod
- Tailwind CSS
- Domain Driven Structure
- SOLID Principle
- DRY Principle
- Clean Code

Tidak menggunakan REST API kecuali benar-benar diperlukan.

---

# Development Roadmap

Sprint 1

Website Publik

Status

Selesai

---

Sprint 2

Authentication

Status

Selesai

---

Sprint 3

Mother Enrollment & Onboarding

Status

Selesai

---

Sprint 4

Verifikasi Data oleh Bidan

Status

Selesai

---

Sprint 5

Assessment Engine Foundation

Status

Selesai

---

Sprint 6

Dashboard Mother

Status

Selesai

---

Sprint 7

Assessment Player

EPDS Module

---

Sprint 8

Dashboard Bidan

Assignment Review

---

Sprint 9

Doctor Review

EPDS Review

---

Sprint 10

Magnesium Module

---

Sprint 11

Nutritionist Review

---

Sprint 12

Reminder Engine

---

Sprint 13

Research Dashboard

---

Sprint 14

Reporting

Export

Analytics

---

# Long Term Goal

Assessment baru dapat ditambahkan tanpa mengubah:

- Dashboard
- Assessment Player
- Workflow
- Review Engine

Cukup membuat module assessment baru yang mengikuti Assessment Contract.

Dengan demikian aplikasi dapat berkembang menjadi platform penelitian kesehatan ibu dan anak yang reusable untuk berbagai instrumen skrining di masa depan.
