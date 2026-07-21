# AGENT 02

# Mother Enrollment & Onboarding

Project:
Monitoring Ibu Nifas

Sprint:
03 — Mother Onboarding

---

# Objective

Membangun proses onboarding bagi Mother setelah berhasil login menggunakan Google.

Onboarding bertujuan mengumpulkan informasi dasar ibu nifas yang diperlukan sebelum dapat menggunakan fitur monitoring.

Mother **belum dapat mengakses Dashboard maupun Assessment** sampai data onboarding diverifikasi oleh Midwife.

---

# Prerequisite

Authentication telah selesai.

Google Login berjalan.

Session aktif.

Role Mother telah dibuat.

---

# Business Flow

Mother Login

↓

Status = PENDING_ONBOARDING

↓

Lengkapi Data

↓

Submit

↓

Status = PENDING_MIDWIFE_REVIEW

↓

Midwife Review

↓

Approve

↓

Status = ACTIVE

↓

Mother dapat menggunakan Dashboard

Jika Reject

↓

Status tetap PENDING_ONBOARDING

↓

Mother memperbaiki data

↓

Submit kembali

---

# User Status

Gunakan enum.

enum UserStatus {

PENDING_ONBOARDING

PENDING_MIDWIFE_REVIEW

ACTIVE

SUSPENDED

}

Status default user baru:

PENDING_ONBOARDING

---

# Access Rules

PENDING_ONBOARDING

Hanya boleh mengakses:

- Onboarding
- Logout

Tidak dapat membuka Dashboard.

---

PENDING_MIDWIFE_REVIEW

Hanya dapat melihat halaman:

"Data Anda sedang diverifikasi oleh Bidan."

Tidak dapat mengubah data kecuali setelah status dikembalikan ke PENDING_ONBOARDING oleh Midwife.

---

ACTIVE

Dapat mengakses seluruh fitur Mother.

---

# Onboarding Sections

Onboarding dibagi menjadi beberapa kelompok informasi.

---

## Personal Information

- Full Name
- Phone Number
- Date of Birth
- Education
- Occupation
- Address

---

## Delivery Information

- Delivery Date
- Delivery Method

Pilihan:

- Normal
- Caesarean Section
- Vacuum
- Forceps

---

## Pregnancy Information

- Pregnancy Number (Gravida)
- Parity
- Abortus (opsional)

---

## Baby Information

- Baby Name (opsional)
- Gender
- Birth Weight
- Birth Length

---

## Medical History

Checklist.

Contoh:

- Hypertension
- Diabetes
- Pre-eclampsia
- Anxiety Disorder
- Depression History

---

## Emergency Contact

- Contact Name
- Relationship
- Phone Number

---

## Consent

Mother wajib menyetujui:

- Privacy Policy
- Data Processing Consent
- Research Participation Consent

Semua consent harus dicentang sebelum submit.

---

# Validation

Semua field wajib divalidasi.

Contoh:

Phone Number

- valid format

Delivery Date

- tidak boleh tanggal masa depan

Birth Weight

- angka positif

Birth Length

- angka positif

---

# Database

Buat tabel khusus untuk profil Mother.

Jangan menyimpan seluruh data pada tabel User.

Contoh:

MotherProfile

Berelasi one-to-one dengan User.

User

↓

MotherProfile

---

# Review Workflow

Setelah submit onboarding.

Mother tidak dapat mengubah data.

Midwife akan melakukan review.

Midwife dapat:

Approve

Reject

Jika Reject.

Midwife wajib mengisi alasan.

Contoh:

"Nomor telepon belum lengkap."

Alasan harus dapat ditampilkan kepada Mother.

---

# Mother Experience

Jika status:

PENDING_ONBOARDING

↓

Tampilkan halaman onboarding.

---

Jika status:

PENDING_MIDWIFE_REVIEW

↓

Tampilkan halaman:

"Data Anda sedang diverifikasi oleh Bidan."

Tampilkan juga:

Tanggal submit

Status

Catatan Midwife (jika ada)

---

Jika status:

ACTIVE

↓

Redirect ke Dashboard.

---

# Route Protection

Mother yang belum ACTIVE tidak boleh mengakses:

- Dashboard
- EPDS
- Magnesium
- History

Middleware harus melakukan pengecekan status user.

---

# Folder Suggestion

app/

(onboarding)/

onboarding/

components/

onboarding/

actions/

mother/

lib/

validators/

---

# Validation

Gunakan Zod.

Semua validasi dilakukan di Server Action.

---

# Coding Rules

- TypeScript Strict
- Server Component First
- Server Actions
- Prisma ORM
- Auth.js Session
- Zod Validation
- No REST API

---

# Out of Scope

Jangan membuat:

Dashboard

EPDS

Magnesium

Reminder

Notification

Doctor Review

Nutrition Review

Reporting

---

# Acceptance Criteria

✓ Mother dapat mengisi onboarding.

✓ Data tersimpan ke database.

✓ Status berubah menjadi PENDING_MIDWIFE_REVIEW.

✓ Mother tidak dapat mengakses Dashboard.

✓ Halaman "Menunggu Verifikasi Bidan" tampil dengan benar.

✓ Midwife nantinya dapat melakukan review tanpa perubahan struktur database.

✓ Struktur onboarding siap digunakan untuk modul berikutnya.
