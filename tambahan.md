Berdasarkan analisis terhadap **tangkapan layar UI**, file Excel **`Template Aplikasi tele ibu nifas.xlsx`**, serta kode yang saat ini ada di aplikasi Nifas Care, berikut adalah bedah menyeluruh tentang **apa maksud klien dan apa yang perlu dikembangkan**:

---

### 1. Ringkasan Eksekutif Maksud Klien

Klien (tim klinis/peneliti Nifas Care) sedang melakukan pemantauan atau studi klinis yang menghubungkan antara **asupan harian Magnesium** dengan **tingkat depresi (EPDS), kecemasan (EPDS-3A & GAD-7), serta mood ibu selama masa nifas (hingga 42 hari / 6 minggu)**.

Desain pemantauan mereka berbasis siklus intervensi per **14 hari**:
$$\text{EPDS-1 (Pre)} \xrightarrow{\text{Kuis Mg Hari 1–14}} \text{EPDS-2 (Post)} \xrightarrow{\text{Kuis Mg Hari 15–28}} \text{EPDS-3 (Pre)} \xrightarrow{\dots} \text{dst.}$$

Saat ini bidan/peneliti kesulitan jika harus mengecek riwayat satu per satu dari daftar antrean biasa. Klien meminta **2 hal utama**:

1. **Di Tampilan Web Bidan (`/midwife/review`)**: Ditambahkan Tab ke-3 khusus (_"Detail HASIL SKOR Ibu nifas"_) pada baris ibu yang di-expand untuk menampilkan matriks rekap skor secara langsung.
2. **Di Fitur Download Excel (`/api/export`)**: Format ekspor di-upgrade dari CSV ringkas 13 kolom saat ini menjadi tabel longitudinal 70 kolom per baris ibu nifas (mencakup Mg-1 s/d Mg-42, EPDS pre-post, GAD-7, mood, dan data klinis lengkap).

---

### 2. Bedah Detail Kebutuhan Klien

#### A. Permintaan UI: Tab Baru _"Detail HASIL SKOR Ibu nifas"_ (Screenshot UI)

Pada tabel antrean bidan saat baris nama ibu nifas diklik (_accordion expand_), saat ini baru ada 2 tombol tab:

- `📋 Antrean & Riwayat Skrining`
- `👤 Data Lengkap & Rekam Klinis Ibu`

Klien meminta dibuatkan **Tab ke-3** (diberi tanda panah merah _"Tambahkan TAB Ini CAL..."_ pada mockup):
👉 **`Detail HASIL SKOR Ibu nifas`**

Di dalam tab ini, klien ingin disajikan 4 kartu (_cards_) ringkasan:

1. **Kartu 1: HASIL SKOR EPDS**
   - Menampilkan urutan skrining EPDS ibu secara runtut:
     - `EPDS-1 SKOR : ... Status Resiko : ...` (sebagai Pre-test awal)
     - `EPDS-2 SKOR : ... Status Resiko : ...` (sebagai Post-test setelah 14 hari)
     - `EPDS-3 SKOR : ... s/d EPDS-8 SKOR : ...`
   - Disertai juga skor sub-skala **EPDS-3A** (skrining kecemasan 3 pertanyaan EPDS yang kodenya sudah ada di sistem).

2. **Kartu 2: HASIL SKOR INTAKE MAGNESIUM (Mg)**
   - Menampilkan asupan magnesium harian ibu per hari pengerjaan (target masa nifas hingga hari ke-42).
   - Dikelompokkan dalam 3 kolom siklus 14 harian:
     - **Kolom 1**: `Mg-1` s/d `Mg-14` (Skor & Status Risiko).
     - **Kolom 2**: `Mg-15` s/d `Mg-28` (Skor & Status Risiko).
     - **Kolom 3**: `Mg-29` s/d `Mg-42` (Skor & Status Risiko).

3. **Kartu 3: HASIL SKOR GAD-7**
   - Menampilkan skor kecemasan umum (_Generalized Anxiety Disorder-7_) beserta status risikonya (_Minimal, Ringan, Sedang, Berat_).

4. **Kartu 4: MOOD HARIAN IBU NIFAS**
   - Menampilkan ringkasan catatan mood harian dari fitur `DailyMood` (ikon emoji, skor suasana hati, dan tren harian ibu).

---

#### B. Permintaan Fitur Export Excel: Format Template Laporan (Sheet Excel)

Pada file `Template Aplikasi tele ibu nifas.xlsx`, klien membagi penjelasannya ke dalam 3 lembar kerja:

1. **Sheet `LAPORAN pER IBU NIFAS`**:
   - Berisi daftar semua atribut yang wajib masuk ke dalam file laporan Excel bidan.
   - Menegaskan definisi:
     - **EPDS Pre**: EPDS yang pertama kali diisi saat ibu baru terdaftar.
     - **EPDS Post**: EPDS yang diisi setelah ibu rutin mengisi kuis magnesium selama 14 hari berturut-turut.
     - **Tracker Mood** & **Total skrining hari 1 s/d 14**.

2. **Sheet `Tambahan FIELD (kuning)` (Skema Kolom Laporan)**:
   File ekspor bidan saat ini di `src/app/api/export/route.ts` hanya mengekspor 13 kolom ringkasan. Klien meminta format **70 kolom** yang memuat:
   - **Data Demografi & Klinis (Kolom A–O)**: Nama lengkap, No WA, Email, Tanggal Lahir, Usia, Pendidikan, Pekerjaan, Alamat, Tanggal Persalinan, Hari Postpartum, Metode Persalinan, Jenis Kelamin Bayi, Berat Badan Bayi, Panjang Badan Bayi, Faktor Risiko (Hipertensi, Diabetes, Pre-Eklampsia, dll).
   - **Tracker Mood (Kolom P)**.
   - **Matriks Skrining Longitudinal (Kolom Q–BJ)**:
     - Kolom Q: `Skor EPDS 1 (PRE)`
     - Kolom R–AE: `Skor Mg ke-1` s/d `Skor Mg ke-14`
     - Kolom AF: `SKOR EPDS-2 (POST)`
     - Kolom AG–AT: `Skor Mg ke-15` s/d `Skor Mg ke-22` (atau ke-28)
     - Kolom AU: `SKOR EPDS-3`
     - Kolom AV–BI: `Skor Mg ke-23` s/d `Skor Mg ke-36`
     - Kolom BJ: `SKOR EPDS-4` (dan seterusnya).
   - **Status Terkini & Intervensi Bidan (Kolom BM–BS)**: Skor EPDS Terakhir, Status EPDS, Skor GAD-7 Terakhir, Status GAD-7, Asupan Mg Terakhir (mg), Catatan Intervensi Bidan Terakhir, Tanggal Intervensi.

3. **Sheet `FITUR APLIKASI DITAMPILKAN`**:
   - Blueprint visual yang diinginkan klien saat data disajikan di layar bidan: profil ibu di atas, riwayat medis di sampingnya, diikuti tabel matriks skor per siklus nifas (EPDS dipadukan sejajar dengan 14 hari kuis Magnesium).

---

### 3. Rencana Langkah Tindak Lanjut (Action Plan)

Jika disetujui, pekerjaan ini dapat kita bagi ke dalam 3 langkah terarah:

1. **Langkah 1: Query & Aggregation Data Ibu Nifas**
   - Di `src/app/midwife/review/page.tsx`, lengkapi pengambilan data agar menyertakan riwayat lengkap skrining per urutan (_sequence_) untuk EPDS (1–8), Magnesium (1–42), GAD-7, serta data `DailyMood`.
   - Hitung status risiko masing-masing asesmen langsung dari backend.

2. **Langkah 2: Pembuatan Tab _"Detail HASIL SKOR Ibu nifas"_ di UI Bidan**
   - Di [`MidwifeReviewDataTable.tsx`](file:///Users/sirsrsjmm/Development/untitled-folder/pak%20sulaiman/nifas-care/src/app/midwife/review/components/MidwifeReviewDataTable.tsx):
     - Tambahkan pilihan tab ketiga di switcher: `"scores"` (`Detail HASIL SKOR Ibu nifas`).
     - Buat komponen tampilan 4 kartu sesuai tata letak yang ada di screenshot:
       - Kartu EPDS (EPDS 1-8 + indikator risiko + EPDS-3A).
       - Kartu Magnesium Grid 3 Kolom (Mg 1–14, Mg 15–28, Mg 29–42).
       - Kartu GAD-7.
       - Kartu Mood Harian Ibu Nifas.

3. **Langkah 3: Pembaruan Endpoint Export Excel/CSV**
   - Di [`src/app/api/export/route.ts`](file:///Users/sirsrsjmm/Development/untitled-folder/pak%20sulaiman/nifas-care/src/app/api/export/route.ts):
     - Sesuaikan kolom ekspor mengikuti format 70 kolom sheet _"Tambahan FIELD (kuning)"_.
     - Memetakan jawaban kuis Mg ke-1 s/d ke-42 dan EPDS 1 s/d 4 ke dalam baris masing-masing ibu nifas.

Bagian mana yang ingin Anda prioritaskan untuk dikerjakan terlebih dahulu, tampilan **Tab Detail HASIL SKOR di web**, perbaikan **Export Excel**, atau keduanya sekaligus?
