# AGENT

# Sprint 10 — Dashboard Ahli Gizi (Nutritionist)

## Project

Monitoring Ibu Nifas

---

# Tujuan

Membangun Dashboard Ahli Gizi sebagai media untuk melakukan evaluasi terhadap asupan magnesium harian ibu nifas berdasarkan data konsumsi makanan yang telah dicatat oleh Mother dan direview oleh Bidan.

Ahli Gizi berperan dalam memberikan rekomendasi perbaikan pola makan, edukasi nutrisi, dan tindak lanjut terkait kecukupan magnesium.

---

# Objective

Ahli Gizi dapat:

* Melihat daftar Mother yang memerlukan review.
* Melihat riwayat konsumsi magnesium.
* Melihat total asupan magnesium harian.
* Membaca catatan Bidan.
* Memberikan evaluasi gizi.
* Memberikan rekomendasi makanan.
* Menentukan tindak lanjut.

---

# Workflow

```text
Mother

↓

Mengisi Asupan Magnesium Harian

↓

Sistem Menghitung Total Magnesium

↓

Review Bidan

↓

Masuk Antrian Ahli Gizi

↓

Review Ahli Gizi

↓

Selesai
```

---

# Scope

Sprint ini mencakup:

* Dashboard Ahli Gizi
* Daftar Mother
* Detail Asupan Magnesium
* Review Gizi
* Riwayat Review

Tidak mencakup:

* Dashboard Dokter
* Reminder
* Reporting

---

# Dashboard

Menampilkan ringkasan:

* Total Mother Menunggu Review
* Review Hari Ini
* Asupan Kurang
* Asupan Cukup
* Review Selesai

---

# Daftar Review

Kolom:

* Nama Mother
* Tanggal Persalinan
* Umur Bayi
* Total Magnesium Hari Terakhir
* Target Magnesium
* Status (Kurang / Cukup / Tinggi)
* Status Review Bidan
* Status Review Ahli Gizi
* Tanggal Pencatatan

Filter:

* Semua
* Belum Direview
* Sudah Direview
* Kurang
* Cukup
* Tinggi

Pencarian:

* Nama Mother

Urutan default:

* Belum Direview
* Asupan terendah
* Pencatatan terbaru

---

# Detail Mother

Ahli Gizi dapat melihat:

## Profil

* Nama
* Umur
* Tanggal Persalinan
* Paritas
* Jenis Persalinan

---

## Ringkasan Asupan

Menampilkan:

* Total Magnesium
* Target Harian
* Persentase Pencapaian
* Status

---

## Detail Konsumsi

Daftar makanan yang dikonsumsi.

Kolom:

* Nama Makanan
* Kategori
* Porsi
* Qty
* Magnesium

Contoh:

| Makanan | Porsi | Qty | Magnesium |
| ------- | ----- | --: | --------: |
| Bayam   | 180 g |   2 |    284 mg |
| Almond  | 30 g  |   1 |     80 mg |

---

## Riwayat Asupan

Menampilkan riwayat konsumsi harian berdasarkan tanggal.

---

## Grafik Asupan Magnesium

Menampilkan tren asupan magnesium harian.

---

## Catatan Bidan

Menampilkan:

* Nama Bidan
* Tanggal Review
* Catatan
* Edukasi

Catatan Bidan bersifat read-only.

---

# Review Ahli Gizi

Ahli Gizi mengisi:

* Status Review
* Evaluasi Gizi
* Rekomendasi Pola Makan
* Saran Makanan
* Target Perbaikan
* Jadwal Evaluasi Berikutnya (opsional)

Status Review:

* Menunggu
* Selesai

---

# Rekomendasi Makanan

Ahli Gizi dapat memilih satu atau lebih makanan dari Master Data.

Contoh:

* Bayam
* Brokoli
* Tempe
* Kedelai
* Almond
* Biji Labu

Rekomendasi disimpan sebagai riwayat.

---

# Validasi

Review hanya dapat dilakukan apabila:

* Mother telah mengisi konsumsi harian.
* Sudah direview oleh Bidan.
* Status Mother ACTIVE.

---

# Hak Akses

Ahli Gizi hanya dapat:

* Melihat Mother yang menjadi tanggung jawabnya.
* Melakukan review gizi.
* Melihat riwayat review miliknya.

Ahli Gizi tidak dapat:

* Mengubah data konsumsi Mother.
* Mengubah hasil perhitungan magnesium.
* Mengubah catatan Bidan.
* Menghapus review yang telah disubmit.

---

# Status Workflow

```text
MENUNGGU_BIDAN

↓

SELESAI_REVIEW_BIDAN

↓

MENUNGGU_AHLI_GIZI

↓

SELESAI_REVIEW_AHLI_GIZI
```

---

# Riwayat Review

Setiap review menyimpan:

* Nama Ahli Gizi
* Tanggal Review
* Total Magnesium Saat Review
* Status Asupan
* Evaluasi Gizi
* Rekomendasi Makanan
* Target Perbaikan
* Status Review

Riwayat tidak boleh dihapus.

---

# Dashboard Widget

Widget yang ditampilkan:

* Menunggu Review
* Review Hari Ini
* Asupan Kurang
* Asupan Cukup
* Review Selesai

---

# Business Rules

* Ahli Gizi melakukan review setelah Bidan selesai melakukan review.
* Data konsumsi harian tidak dapat diubah oleh Ahli Gizi.
* Total magnesium dihitung otomatis oleh sistem.
* Catatan Bidan tidak dapat diubah.
* Ahli Gizi memberikan evaluasi gizi dan rekomendasi makanan.
* Review yang telah disubmit tidak dapat diedit kembali.
* Semua aktivitas review disimpan sebagai histori.

---

# Acceptance Criteria

* Dashboard Ahli Gizi tersedia.
* Daftar Mother tersedia.
* Detail konsumsi magnesium dapat dilihat.
* Riwayat konsumsi dapat dilihat.
* Catatan Bidan dapat dibaca.
* Ahli Gizi dapat memberikan evaluasi gizi.
* Rekomendasi makanan dapat diberikan.
* Riwayat review tersimpan.
* Workflow berpindah ke status **SELESAI_REVIEW_AHLI_GIZI** setelah review disubmit.

---

# Definition of Done

Sprint dianggap selesai apabila:

* Ahli Gizi dapat melihat Mother yang menunggu review.
* Ahli Gizi dapat melihat detail konsumsi magnesium.
* Ahli Gizi dapat memberikan evaluasi dan rekomendasi gizi.
* Riwayat review tersimpan.
* Workflow review berjalan sesuai proses yang telah ditentukan.
