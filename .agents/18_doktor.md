# AGENT

# Sprint 9 — Dashboard Dokter

## Project

Monitoring Ibu Nifas

---

# Tujuan

Membangun Dashboard Dokter sebagai media untuk melakukan review klinis terhadap hasil skrining EPDS yang telah direview oleh Bidan.

Dokter tidak melakukan pengisian assessment, tetapi melakukan evaluasi, memberikan rekomendasi klinis, dan menentukan tindak lanjut.

---

# Objective

Dokter dapat:

* Melihat daftar Mother yang menunggu review.
* Melihat hasil EPDS beserta riwayatnya.
* Membaca catatan Bidan.
* Memberikan review klinis.
* Menentukan intervensi lanjutan.
* Menentukan perlu atau tidaknya rujukan.
* Menentukan jadwal kontrol berikutnya.

---

# Workflow

```text
Mother

↓

Mengisi EPDS

↓

Assessment Selesai

↓

Review Bidan

↓

Masuk Antrian Dokter

↓

Review Dokter

↓

Selesai
```

---

# Scope

Sprint ini mencakup:

* Dashboard Dokter
* Daftar Review
* Detail Mother
* Review Klinis
* Riwayat Review

Tidak mencakup:

* Dashboard Bidan
* Dashboard Ahli Gizi
* Reminder
* Reporting

---

# Dashboard

Menampilkan ringkasan:

* Total Mother Menunggu Review
* Review Hari Ini
* Kasus Priority HIGH
* Kasus Priority URGENT
* Review Selesai

---

# Daftar Review

Kolom:

* Nama Mother
* Tanggal Persalinan
* Umur Bayi
* Skor EPDS Terakhir
* Priority
* Status Review Bidan
* Status Review Dokter
* Tanggal Pengisian

Filter:

* Semua
* Belum Direview
* Sudah Direview
* HIGH
* URGENT

Pencarian:

* Nama Mother

Urutan default:

* Priority tertinggi
* Pengisian terbaru

---

# Detail Mother

Dokter dapat melihat:

## Profil

* Nama
* Umur
* Tanggal Persalinan
* Paritas
* Jenis Persalinan

---

## Hasil EPDS

Menampilkan:

* Tanggal Assessment
* Total Score
* Interpretation
* Priority
* Red Flag

---

## Riwayat EPDS

Daftar seluruh hasil EPDS berdasarkan tanggal.

---

## Grafik Skor EPDS

Menampilkan perkembangan skor EPDS dari waktu ke waktu.

---

## Catatan Bidan

Menampilkan:

* Nama Bidan
* Tanggal Review
* Catatan
* Rekomendasi

Catatan Bidan bersifat read-only.

---

# Review Dokter

Dokter mengisi:

* Status Review
* Catatan Klinis
* Rekomendasi
* Tindak Lanjut
* Perlu Rujukan (Ya/Tidak)
* Jadwal Kontrol Berikutnya (opsional)

Status Review:

* Menunggu
* Selesai

---

# Intervensi

Dokter dapat memilih satu atau lebih intervensi:

* Edukasi
* Konseling
* Psikoterapi
* Rujukan
* Kunjungan Rumah

Intervensi disimpan sebagai riwayat.

---

# Validasi

Review hanya dapat dilakukan apabila:

* EPDS telah selesai diisi.
* Sudah direview oleh Bidan.
* Status Mother ACTIVE.

---

# Hak Akses

Dokter hanya dapat:

* Melihat Mother yang menjadi tanggung jawabnya.
* Melakukan review terhadap data tersebut.
* Melihat riwayat review miliknya.

Dokter tidak dapat:

* Mengubah hasil EPDS.
* Mengubah catatan Bidan.
* Menghapus review yang telah disubmit.

---

# Status Workflow

```text
MENUNGGU_BIDAN

↓

SELESAI_REVIEW_BIDAN

↓

MENUNGGU_DOKTER

↓

SELESAI_REVIEW_DOKTER
```

---

# Riwayat Review

Setiap review menyimpan:

* Dokter
* Tanggal Review
* Priority Saat Review
* Catatan Klinis
* Intervensi
* Rekomendasi
* Status

Riwayat tidak boleh dihapus.

---

# Dashboard Widget

Widget yang ditampilkan:

* Menunggu Review
* Review Hari Ini
* HIGH Priority
* URGENT Priority
* Review Selesai

---

# Business Rules

* Dokter hanya melakukan review setelah Bidan selesai.
* Hasil EPDS tidak dapat diubah oleh Dokter.
* Catatan Bidan tidak dapat diubah oleh Dokter.
* Review Dokter menghasilkan catatan klinis dan rekomendasi.
* Intervensi dipilih dari Master Intervention.
* Review yang telah disubmit tidak dapat diedit kembali.
* Semua aktivitas review dicatat sebagai histori.

---

# Acceptance Criteria

* Dashboard Dokter tersedia.
* Daftar Mother tersedia.
* Detail Mother tersedia.
* Riwayat EPDS dapat dilihat.
* Catatan Bidan dapat dibaca.
* Dokter dapat melakukan review.
* Intervensi dapat dipilih.
* Riwayat review tersimpan.
* Workflow berpindah ke status **SELESAI_REVIEW_DOKTER** setelah review disubmit.

---

# Definition of Done

Sprint dianggap selesai apabila:

* Dokter dapat melihat seluruh Mother yang menunggu review.
* Dokter dapat membuka detail hasil EPDS.
* Dokter dapat memberikan review klinis.
* Dokter dapat menentukan intervensi dan tindak lanjut.
* Riwayat review tersimpan dengan baik.
* Workflow review berjalan sesuai alur yang telah ditentukan.
