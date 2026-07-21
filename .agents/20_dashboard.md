# AGENT

# Sprint — Dashboard Analytics (Semua Role)

## Project

Monitoring Ibu Nifas

---

# Tujuan

Menyediakan Dashboard Analytics yang informatif untuk setiap Role sehingga pengguna dapat dengan cepat memahami kondisi saat ini, prioritas pekerjaan, dan perkembangan data tanpa harus membuka setiap halaman.

Dashboard Analytics harus menggunakan komponen yang reusable sehingga konsisten di seluruh aplikasi.

---

# Dashboard Architecture

Seluruh dashboard menggunakan struktur yang sama.

```text
Dashboard

├── Header
├── Summary Cards
├── Trend Analytics
├── Distribution Analytics
├── Priority List
└── Recent Activities
```

---

# Reusable Components

## Dashboard Header

Menampilkan:

* Nama User
* Role
* Tanggal Hari Ini

---

## Summary Cards

Komponen reusable.

Menampilkan KPI utama.

Format:

* Icon
* Title
* Value
* Description

---

## Trend Chart

Komponen reusable.

Jenis chart:

* Line Chart
* Bar Chart

Digunakan untuk melihat perkembangan data.

---

## Distribution Chart

Komponen reusable.

Jenis chart:

* Doughnut Chart
* Pie Chart

Digunakan untuk melihat distribusi data.

---

## Priority Table

Komponen reusable.

Menampilkan daftar prioritas.

Kolom bersifat dinamis sesuai Role.

---

## Recent Activity

Komponen reusable.

Menampilkan aktivitas terbaru.

---

# ROLE : MOTHER

## Tujuan

Membantu Mother memahami perkembangan kondisi dirinya.

---

## Summary Cards

* Hari Setelah Persalinan
* Skor EPDS Terakhir
* Total Magnesium Hari Ini
* Jadwal Assessment Berikutnya

---

## Trend Analytics

### Grafik Skor EPDS

Line Chart.

Menampilkan perubahan skor EPDS berdasarkan tanggal assessment.

---

### Grafik Magnesium Harian

Bar Chart.

Menampilkan total magnesium setiap hari.

Target magnesium ditampilkan sebagai garis pembanding.

---

## Distribution Analytics

### Progress Assessment

Donut Chart.

Status:

* Sudah Diisi
* Belum Diisi

---

## Priority

Menampilkan:

* Assessment yang harus segera diisi.
* Jadwal review berikutnya.

---

## Recent Activity

Menampilkan:

* Pengisian EPDS
* Pengisian Magnesium
* Review Bidan
* Review Dokter
* Review Ahli Gizi

---

# ROLE : BIDAN

## Tujuan

Membantu Bidan menentukan prioritas review.

---

## Summary Cards

* Menunggu Review
* Review Hari Ini
* Priority HIGH
* Priority URGENT

---

## Trend Analytics

### Trend Pengisian EPDS

Line Chart.

Jumlah assessment setiap minggu.

---

### Trend Pengisian Magnesium

Line Chart.

Jumlah pencatatan magnesium setiap minggu.

---

## Distribution Analytics

### Distribusi Priority EPDS

Donut Chart.

Kategori:

* LOW
* HIGH
* URGENT

---

### Distribusi Status Magnesium

Donut Chart.

Kategori:

* Sangat Kurang
* Kurang
* Cukup
* Tinggi

---

## Priority

Daftar Mother yang harus segera direview.

Kolom:

* Nama
* EPDS
* Magnesium
* Priority
* Tanggal

---

## Recent Activity

Menampilkan review terbaru yang telah dilakukan Bidan.

---

# ROLE : DOCTOR

## Tujuan

Membantu Dokter melakukan evaluasi klinis berdasarkan hasil EPDS.

---

## Summary Cards

* Menunggu Review
* HIGH Priority
* URGENT Priority
* Review Hari Ini

---

## Trend Analytics

### Trend Skor EPDS

Line Chart.

Rata-rata skor EPDS berdasarkan minggu.

---

### Trend Review

Bar Chart.

Jumlah review dokter setiap minggu.

---

## Distribution Analytics

### Distribusi Hasil EPDS

Donut Chart.

Kategori:

* Normal
* Risiko Depresi
* Probable Depression

---

### Distribusi Intervensi

Bar Chart.

Jumlah:

* Edukasi
* Konseling
* Psikoterapi
* Rujukan
* Kunjungan Rumah

---

## Priority

Daftar Mother yang membutuhkan review segera.

Kolom:

* Nama
* Score
* Priority
* Tanggal Assessment

---

## Recent Activity

Menampilkan review dokter terbaru.

---

# ROLE : NUTRITIONIST

## Tujuan

Membantu Ahli Gizi mengevaluasi kecukupan magnesium berdasarkan konsumsi makanan.

---

## Summary Cards

* Menunggu Review
* Asupan Kurang
* Asupan Cukup
* Review Hari Ini

---

## Trend Analytics

### Trend Magnesium

Line Chart.

Rata-rata magnesium harian.

---

### Trend Review

Bar Chart.

Jumlah review Ahli Gizi setiap minggu.

---

## Distribution Analytics

### Distribusi Status Magnesium

Donut Chart.

Kategori:

* Sangat Kurang
* Kurang
* Cukup
* Tinggi

---

### Top Makanan

Horizontal Bar Chart.

10 makanan yang paling sering dikonsumsi.

Contoh:

* Bayam
* Tempe
* Almond
* Kedelai
* Brokoli

---

## Priority

Daftar Mother dengan asupan magnesium terendah.

Kolom:

* Nama
* Total Magnesium
* Status
* Tanggal

---

## Recent Activity

Menampilkan review Ahli Gizi terbaru.

---

# Reusable Charts

Komponen chart yang digunakan bersama:

* Summary Card
* Line Chart
* Bar Chart
* Horizontal Bar Chart
* Doughnut Chart
* Pie Chart
* Priority Table
* Recent Activity

---

# Business Rules

* Semua Dashboard menggunakan komponen reusable.
* Semua Summary Card memiliki format yang sama.
* Semua grafik menggunakan rentang tanggal yang dapat dipilih.
* Semua tabel mendukung pencarian dan filter.
* Priority selalu diurutkan berdasarkan tingkat prioritas tertinggi kemudian tanggal terbaru.
* Data analytics hanya menampilkan informasi sesuai hak akses masing-masing Role.

---

# Acceptance Criteria

* Dashboard tersedia untuk Mother, Bidan, Dokter, dan Ahli Gizi.
* Seluruh dashboard menggunakan struktur layout yang konsisten.
* Komponen analytics dapat digunakan ulang pada seluruh Role.
* Summary Card, Trend Chart, Distribution Chart, Priority Table, dan Recent Activity dapat digunakan oleh seluruh dashboard.
* Setiap Role hanya melihat data yang menjadi kewenangannya.

---

# Definition of Done

Sprint dianggap selesai apabila:

* Dashboard Analytics untuk seluruh Role berhasil diimplementasikan.
* Seluruh komponen analytics bersifat reusable.
* Tampilan dashboard konsisten pada semua Role.
* Analytics memberikan informasi yang relevan sesuai kebutuhan masing-masing pengguna.
