# PUBLIC_WEBSITE_AGENT.md

# Agent Specification

## Project: Website Publik Monitoring Ibu Nifas (Nifas Care)

---

# Overview

Bangun sebuah website publik modern menggunakan **Next.js (App Router)** yang bertujuan sebagai media edukasi mengenai masa nifas, kesehatan mental ibu setelah melahirkan, dan pentingnya asupan magnesium.

Website ini merupakan landing page sekaligus pintu masuk menuju aplikasi monitoring ibu nifas yang pada tahap berikutnya akan memiliki fitur login, pengisian EPDS, pengisian asupan magnesium, serta dashboard dokter.

**Pada fase ini TIDAK membuat fitur login maupun dashboard.**

---

# Tujuan Website

Website harus:

- memberikan edukasi yang mudah dipahami
- meningkatkan awareness mengenai kesehatan ibu nifas
- memperkenalkan skrining EPDS
- menjelaskan pentingnya magnesium
- menjadi landing page profesional
- SEO Friendly
- Responsive
- Fast Loading
- Accessibility Friendly

---

# Target Pengguna

Primary User

- Ibu nifas

Secondary User

- Suami
- Keluarga
- Bidan
- Dokter
- Mahasiswa kesehatan

---

# Tech Stack

Framework

- Next.js 15+
- React 19
- TypeScript

Styling

- Tailwind CSS
- shadcn/ui

Icons

- Lucide React

Animation

- Framer Motion

Font

- Geist Sans

Image

- next/image

Deployment

- Vercel Ready

---

# Design Style

Modern Medical Website

Keywords

- Clean
- Soft
- Elegant
- Calm
- Professional
- Friendly

Inspirasi

- Healthcare
- Maternal Care
- WHO
- Mayo Clinic
- Modern SaaS Landing Page

---

# Color Palette

Primary

Sage Green

Secondary

Soft Pink

Accent

Warm Orange

Background

Off White

Text

Dark Gray

Jangan menggunakan warna yang terlalu mencolok.

Website harus memberikan kesan:

- aman
- nyaman
- terpercaya

---

# Layout

Website memiliki struktur:

Navbar

↓

Hero

↓

Tentang Masa Nifas

↓

Mengapa Kesehatan Mental Penting

↓

Mengapa Magnesium Penting

↓

Fitur Platform

↓

Artikel Edukasi

↓

FAQ

↓

Tentang Kami

↓

CTA

↓

Footer

---

# Navbar

Menu

- Home
- Masa Nifas
- EPDS
- Magnesium
- Artikel
- FAQ
- Tentang Kami

Button

Mulai Skrining

(Button hanya menuju halaman placeholder.)

Navbar sticky.

---

# Hero Section

Headline

"Ibu Sehat, Bayi Bahagia"

Subheadline

"Platform edukasi dan pemantauan ibu nifas untuk membantu menjaga kesehatan fisik dan mental setelah persalinan."

CTA

Primary

Mulai Skrining

Secondary

Pelajari Masa Nifas

Tambahkan ilustrasi modern bertema ibu dan bayi.

---

# Section Masa Nifas

Isi

- Apa itu masa nifas
- Lama masa nifas
- Perubahan tubuh
- Perubahan hormon
- Jadwal kontrol
- Hal normal
- Tanda bahaya

Gunakan card.

---

# Section EPDS

Jelaskan:

- Apa itu EPDS
- Mengapa digunakan
- Siapa yang perlu mengisi
- Kapan diisi
- Berapa lama pengerjaan

Tambahkan card:

- Cepat
- Mudah
- Rahasia

---

# Section Magnesium

Jelaskan:

- Apa itu magnesium
- Mengapa penting
- Dampak kekurangan
- Sumber makanan

Gunakan icon untuk setiap makanan.

Contoh

- Bayam
- Tempe
- Tahu
- Pisang
- Oatmeal
- Almond
- Ikan

---

# Section Fitur Platform

Card

✓ Edukasi

✓ Skrining EPDS

✓ Monitoring Magnesium

✓ Review Dokter

✓ Riwayat Pengisian

Untuk fase pertama hanya tampil sebagai informasi.

Belum ada implementasi.

---

# Artikel

Tampilkan

3 artikel terbaru

Card

Image

Kategori

Judul

Ringkasan

Button

Baca Selengkapnya

---

# FAQ

Gunakan Accordion.

Contoh

Apa itu masa nifas?

Apa itu baby blues?

Apa bedanya baby blues dan depresi postpartum?

Apakah EPDS aman?

Apakah website ini gratis?

---

# Tentang Kami

Berisi

Visi

Misi

Tujuan penelitian

Kolaborasi tenaga kesehatan

---

# CTA

Section terakhir

Headline

"Mulai menjaga kesehatan Anda sejak masa nifas."

Button

Mulai Skrining

---

# Footer

Menu

Kontak

Email

Privacy Policy

Disclaimer

Copyright

---

# Disclaimer

Website ini hanya bertujuan sebagai media edukasi dan alat bantu skrining.

Hasil skrining bukan diagnosis medis.

Selalu konsultasikan kondisi kesehatan kepada dokter atau tenaga kesehatan.

---

# Responsive

Support

Desktop

Tablet

Mobile

Gunakan Mobile First.

---

# Accessibility

Gunakan

- semantic HTML
- aria-label
- alt image
- keyboard navigation

---

# Performance

Target

Lighthouse

Performance > 95

Accessibility > 95

Best Practices > 95

SEO > 95

---

# SEO

Gunakan metadata Next.js.

Setiap halaman memiliki

title

description

keywords

OpenGraph

Twitter Card

Tambahkan sitemap.

Tambahkan robots.txt.

---

# Folder Structure

app/

components/

components/layout

components/home

components/ui

lib/

hooks/

types/

public/

styles/

---

# Reusable Components

Navbar

Footer

SectionTitle

FeatureCard

ArticleCard

FAQAccordion

CTASection

Hero

Container

Badge

Button

---

# Coding Rules

- Gunakan TypeScript strict mode.
- Hindari hardcoded styling yang berulang.
- Pisahkan komponen berdasarkan tanggung jawab.
- Gunakan reusable components.
- Jangan membuat file dengan ukuran terlalu besar.
- Ikuti prinsip Clean Code.
- Ikuti prinsip SOLID jika memungkinkan.
- Gunakan server components secara default.
- Gunakan client components hanya jika diperlukan.

---

# Future Features (Not Implemented)

Jangan diimplementasikan sekarang.

- Google Login
- Dashboard Ibu
- Dashboard Dokter
- EPDS Form
- Magnesium Form
- Notification
- Email Reminder
- Admin Panel

Website publik harus dipersiapkan agar mudah dikembangkan ke fitur-fitur tersebut tanpa perlu mengubah arsitektur utama.

---

# Expected Output

Hasil akhir berupa website landing page profesional dengan tampilan modern, ramah pengguna, mudah dikembangkan, dan siap menjadi fondasi aplikasi Monitoring Ibu Nifas pada fase berikutnya.
