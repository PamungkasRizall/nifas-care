# AGENT

# Clinical Content — Magnesium Intake Monitoring

## Project

Monitoring Ibu Nifas

---

# Tujuan

Membangun modul pencatatan asupan magnesium harian ibu nifas yang mudah digunakan, akurat, dan mendukung proses review oleh Bidan serta Ahli Gizi.

Modul ini bukan berupa kuisioner seperti EPDS, melainkan pencatatan konsumsi makanan harian.

---

# Objective

Mother dapat mencatat makanan yang dikonsumsi setiap hari.

Sistem secara otomatis menghitung total magnesium yang dikonsumsi berdasarkan data Master Makanan.

Hasil perhitungan akan digunakan sebagai dasar review oleh Bidan dan Ahli Gizi.

---

# Workflow

```text
Master Data Makanan

↓

Mother Login

↓

Pilih Tanggal

↓

Tambah Makanan

↓

Pilih Makanan

↓

Pilih Porsi

↓

Masukkan Qty

↓

Simpan

↓

Hitung Magnesium

↓

Total Magnesium Harian

↓

Bandingkan dengan Target AKG

↓

Interpretasi

↓

Review Bidan

↓

Review Ahli Gizi
```

---

# Scope

Modul ini mencakup:

- Master Kategori Makanan
- Master Makanan
- Master Porsi
- Nilai Magnesium
- Pencatatan Konsumsi Harian
- Perhitungan Magnesium
- Interpretasi
- Review Bidan
- Review Ahli Gizi

---

# 1. Master Kategori Makanan

Kategori digunakan untuk mempermudah pencarian makanan.

Contoh:

- Sayuran
- Kacang-kacangan
- Biji-bijian
- Buah
- Seafood
- Ikan
- Daging
- Telur
- Susu dan Produk Olahan
- Minuman
- Lainnya

Kategori dapat ditambah tanpa mengubah source code.

---

# 2. Master Makanan

Setiap makanan memiliki:

- Nama
- Kategori
- Deskripsi (opsional)
- Status Aktif

Contoh:

| Nama      | Kategori        |
| --------- | --------------- |
| Bayam     | Sayuran         |
| Kangkung  | Sayuran         |
| Brokoli   | Sayuran         |
| Kedelai   | Kacang-kacangan |
| Almond    | Kacang-kacangan |
| Biji Labu | Biji-bijian     |
| Oatmeal   | Biji-bijian     |

Master makanan dapat terus bertambah.

---

# 3. Master Porsi

Setiap makanan dapat memiliki satu atau lebih pilihan porsi.

Contoh:

Bayam

- 1 Mangkok (180 g)
- 100 g

Kedelai

- 100 g rebus
- 50 g rebus

Almond

- 30 g
- 100 g

Setiap porsi menyimpan:

- Nama Porsi
- Berat (gram)

---

# 4. Kandungan Magnesium

Setiap porsi memiliki nilai magnesium.

Contoh:

| Makanan | Porsi | Magnesium |
| ------- | ----- | --------- |
| Bayam   | 180 g | 142 mg    |
| Bayam   | 100 g | 79 mg     |
| Almond  | 30 g  | 80 mg     |
| Kedelai | 100 g | 86 mg     |

Nilai magnesium berasal dari referensi gizi yang telah ditentukan oleh tim penelitian.

---

# 5. Input Harian Mother

Mother memilih tanggal pencatatan.

Kemudian menambahkan makanan yang dikonsumsi.

Setiap item terdiri dari:

- Makanan
- Porsi
- Qty

Contoh:

Tanggal:

2026-07-15

Item 1

Bayam

Porsi

180 g

Qty

2

---

Item 2

Almond

30 g

Qty

1

---

Mother tidak mengisi jumlah magnesium.

Sistem menghitung secara otomatis.

---

# 6. Perhitungan Magnesium

Rumus:

Total Magnesium Item

=

Magnesium per Porsi

×

Qty

Contoh:

Bayam

142 mg

×

2

=

284 mg

---

Almond

80 mg

×

1

=

80 mg

---

Total Harian

=

364 mg

---

# 7. Target AKG

Sistem memiliki Target Magnesium Harian.

Contoh:

320 mg / hari

Target dapat disimpan sebagai Master Data sehingga mudah diperbarui apabila terdapat perubahan pedoman.

---

# 8. Interpretasi

Berdasarkan Total Magnesium Harian.

Contoh:

| Total    | Status |
| -------- | ------ |
| < Target | Kurang |
| ≥ Target | Cukup  |

Interpretasi berasal dari Master Data.

Tidak di-hardcode.

---

# 9. Review Bidan

Bidan melihat ringkasan.

- Tanggal
- Total Magnesium
- Target
- Status

Bidan dapat memberikan:

- Catatan
- Edukasi
- Status Review

---

# 10. Review Ahli Gizi

Ahli Gizi melihat detail konsumsi.

Contoh:

Bayam

180 g

Qty 2

284 mg

---

Almond

30 g

Qty 1

80 mg

---

Total

364 mg

Ahli Gizi dapat memberikan:

- Evaluasi
- Saran Perbaikan Pola Makan
- Rekomendasi Makanan
- Status Review

---

# 11. Dashboard Mother

Mother dapat melihat:

- Total Magnesium Hari Ini
- Target Harian
- Persentase Pencapaian
- Status
- Riwayat 7 Hari
- Riwayat 30 Hari

---

# 12. Dashboard Bidan

Bidan dapat melihat:

- Daftar Mother
- Status Magnesium
- Belum Direview
- Sudah Direview
- Membutuhkan Tindak Lanjut

---

# 13. Dashboard Ahli Gizi

Ahli Gizi dapat melihat:

- Mother dengan Status Kurang
- Riwayat Konsumsi
- Detail Makanan
- Grafik Asupan Magnesium
- Status Review

---

# 14. Reminder

Apabila Mother belum mengisi konsumsi hari ini.

↓

Kirim Email Reminder.

Apabila Total Magnesium berada di bawah target selama beberapa hari berturut-turut.

↓

Masuk ke daftar prioritas review Bidan dan Ahli Gizi.

---

# 15. Research Dashboard

Peneliti dapat melihat:

- Rata-rata Asupan Magnesium
- Distribusi Asupan
- Kepatuhan Pengisian Harian
- Tren Mingguan
- Tren Bulanan
- Cohort berdasarkan:
  - Tanggal Persalinan
  - Usia Ibu
  - Paritas
  - Jenis Persalinan

---

# Prisma Seeder

Master Data yang harus disediakan:

- Food Category
- Food
- Food Serving
- Food Nutrition (Magnesium)
- Daily Magnesium Target
- Interpretation Rules

Seluruh data master diisi melalui Prisma Seeder.

---

# Business Rules

- Mother hanya memilih makanan, porsi, dan qty.
- Mother tidak pernah mengisi nilai magnesium secara manual.
- Sistem menghitung total magnesium secara otomatis.
- Nilai magnesium berasal dari Master Data.
- Target AKG berasal dari Master Data.
- Interpretasi berasal dari Master Data.
- Bidan melakukan review pertama.
- Ahli Gizi melakukan review lanjutan.
- Seluruh riwayat konsumsi disimpan per hari.
- Mother dapat mengubah data pada hari yang sama sebelum direview.

---

# Acceptance Criteria

- Master makanan tersedia.
- Master porsi tersedia.
- Nilai magnesium tersedia.
- Mother dapat mencatat konsumsi harian.
- Sistem menghitung total magnesium otomatis.
- Interpretasi ditampilkan otomatis.
- Bidan dapat melakukan review.
- Ahli Gizi dapat melakukan review.
- Data siap digunakan untuk penelitian.

---

# Definition of Done

Modul Magnesium dianggap selesai apabila:

- Seluruh Master Data telah tersedia.
- Prisma Seeder berhasil mengisi Master Data.
- Mother dapat mencatat konsumsi harian dengan mudah.
- Sistem menghitung total magnesium secara otomatis.
- Bidan dan Ahli Gizi dapat melakukan review berdasarkan hasil perhitungan sistem.
