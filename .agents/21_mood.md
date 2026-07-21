# AGENT

# Sprint — Mood Tracker Harian

## Project

Monitoring Ibu Nifas

---

# Tujuan

Membangun fitur **Mood Tracker Harian** yang memungkinkan Mother mencatat kondisi emosinya setiap hari menggunakan emoji dan catatan singkat.

Mood Tracker berfungsi sebagai data pendukung untuk membantu Bidan, Dokter, dan Peneliti dalam memantau perkembangan kondisi psikologis Mother.

Mood Tracker **bukan merupakan bagian dari EPDS**, melainkan pencatatan harian yang berdiri sendiri.

---

# Objective

Mother dapat:

* Mengisi mood setiap hari.
* Memilih emoji yang menggambarkan perasaannya.
* Menambahkan catatan (opsional).
* Melihat riwayat mood.

Tenaga kesehatan dapat melihat riwayat mood sebagai data pendukung dalam proses review.

---

# Workflow

```text
Mother Login

↓

Dashboard

↓

Bagaimana perasaan Anda hari ini?

↓

Pilih Emoji

↓

(Optional) Tambahkan Catatan

↓

Simpan

↓

Mood Hari Ini Tersimpan

↓

Masuk Riwayat Mood

↓

Ditampilkan pada Dashboard Bidan & Dokter
```

---

# Scope

Sprint ini mencakup:

* Input Mood Harian
* Riwayat Mood
* Dashboard Analytics Mood
* Integrasi ke Dashboard Bidan
* Integrasi ke Dashboard Dokter

Tidak mencakup:

* EPDS
* Magnesium
* Reminder

---

# Input Mood

Mother hanya memilih satu kondisi mood setiap hari.

Pilihan Mood:

| Emoji | Label          | Score |
| ----- | -------------- | ----: |
| 😄    | Sangat Bahagia |     5 |
| 🙂    | Bahagia        |     4 |
| 😐    | Biasa Saja     |     3 |
| 😔    | Sedih          |     2 |
| 😭    | Sangat Sedih   |     1 |

Score digunakan untuk kebutuhan analytics.

Mother tidak melihat nilai score.

---

# Catatan

Mother dapat menambahkan catatan.

Contoh:

* Hari ini tidur kurang nyenyak.
* Bayi sering menangis.
* Merasa lebih semangat.
* Hari ini merasa sangat lelah.

Catatan bersifat opsional.

---

# Dashboard Mother

Widget **Mood Hari Ini** ditampilkan pada bagian atas dashboard.

```text
Bagaimana perasaan Anda hari ini?

😄   🙂   😐   😔   😭

Catatan (Opsional)

________________________

[ Simpan ]
```

---

# Riwayat Mood

Mother dapat melihat riwayat mood berdasarkan tanggal.

Kolom:

* Tanggal
* Emoji
* Label Mood
* Catatan

Urutan berdasarkan tanggal terbaru.

---

# Analytics Mother

## Grafik Mood

Line Chart.

Menampilkan perubahan mood berdasarkan tanggal.

---

## Kalender Mood

Setiap tanggal menampilkan emoji mood yang dipilih.

Mother dapat melihat pola perubahan mood selama satu bulan.

---

# Dashboard Bidan

Bidan dapat melihat:

* Mood Hari Ini
* Mood 7 Hari Terakhir
* Riwayat Mood
* Catatan Mother

Apabila terjadi penurunan mood selama beberapa hari berturut-turut, Bidan dapat mempertimbangkan evaluasi lebih lanjut bersamaan dengan hasil EPDS.

---

# Dashboard Dokter

Dokter dapat melihat:

* Riwayat Mood
* Grafik Mood
* Catatan Mother

Data mood digunakan sebagai informasi pendukung saat melakukan evaluasi hasil EPDS.

---

# Dashboard Ahli Gizi

Ahli Gizi dapat melihat:

* Riwayat Mood
* Grafik Mood

Data mood hanya sebagai informasi pendukung saat mengevaluasi pola makan dan asupan magnesium.

---

# Research Dashboard

Peneliti dapat melihat:

* Distribusi Mood Harian
* Tren Mood
* Rata-rata Mood
* Perubahan Mood berdasarkan waktu
* Korelasi Mood dengan hasil EPDS
* Korelasi Mood dengan Asupan Magnesium

Data ditampilkan dalam bentuk agregat tanpa mengungkap identitas pribadi.

---

# Dashboard Analytics

Widget yang ditampilkan:

## Summary

* Mood Hari Ini
* Rata-rata Mood Minggu Ini
* Hari Berturut-turut Mengisi Mood

---

## Trend

Line Chart.

Perubahan mood harian.

---

## Distribution

Donut Chart.

Distribusi:

* Sangat Bahagia
* Bahagia
* Biasa Saja
* Sedih
* Sangat Sedih

---

# Business Rules

* Mother hanya dapat mengisi satu mood setiap hari.
* Mother dapat memperbarui mood pada hari yang sama sebelum dilakukan review atau pergantian hari.
* Catatan bersifat opsional.
* Mood tidak memengaruhi perhitungan skor EPDS.
* Mood tidak memengaruhi perhitungan asupan magnesium.
* Mood digunakan sebagai data pendukung untuk monitoring dan penelitian.
* Seluruh riwayat mood disimpan dan dapat ditampilkan dalam bentuk grafik maupun kalender.

---

# Acceptance Criteria

* Mother dapat mengisi mood harian.
* Mother dapat menambahkan catatan.
* Riwayat mood dapat dilihat.
* Grafik mood tersedia pada Dashboard Mother.
* Bidan dapat melihat riwayat mood Mother.
* Dokter dapat melihat riwayat mood Mother.
* Ahli Gizi dapat melihat riwayat mood Mother.
* Data mood tersedia pada Research Dashboard untuk kebutuhan analisis.

---

# Definition of Done

Sprint dianggap selesai apabila:

* Fitur Mood Tracker Harian dapat digunakan oleh Mother.
* Riwayat mood tersimpan dengan baik.
* Dashboard Mother menampilkan analytics mood.
* Bidan, Dokter, dan Ahli Gizi dapat melihat riwayat mood sebagai data pendukung.
* Mood Tracker terintegrasi dengan Dashboard Analytics dan Research Dashboard.
