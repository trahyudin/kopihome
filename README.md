# ☕ KopiWeb — Fullstack Coffee Shop Website Showcase & Marketing Platform

Platform pemasaran jasa pembuatan website coffee shop dan etalase katalog 45 template responsif, dilengkapi fitur **Sneak Peek Live Preview Interaktif**, formulir penangkapan prospek (leads) yang terhubung ke database, serta **Admin Dashboard** modern. Siap di-deploy langsung ke **cPanel** (Apache + PHP 8.x + MySQL).

---

## ✨ Fitur Utama

- **Tampilan Premium & Estetis:** Dua palet warna bertema kopi (**Espresso** Gelap & **Latte** Terang) dengan CSS Custom Properties dan animasi *anime.js* (uap kopi melayang, cangkir mengambang, biji kopi berputar, dan *scroll-reveal*).
- **Fitur Sneak Peek Live Preview (Modal Interaktif):**
  - Menguji ke-45 template website coffee shop secara langsung di dalam website tanpa meninggalkan halaman.
  - **Device Switcher:** Beralih instan antara tampilan **Desktop (100%)**, **Tablet (768px)**, dan **Mobile (390px)**.
  - Tombol aksi: *"Buka di Tab Baru"* & *"Pesan Template Ini"* (otomatis membuka WhatsApp dengan pesan terisi nama template).
- **Katalog Template Dinamis:** Dilengkapi fitur pencarian real-time dan filter kategori (*Minimalis, Company Profile, Dark, Luxury, Roastery, Modern, Kreatif/RPG*).
- **Sistem Dwibahasa (ID / EN):** Dukungan penuh Bahasa Indonesia dan English dengan persistensi tersimpan di `localStorage`.
- **Formulir Konsultasi & Lead Capture:** Terintegrasi di seksi `#kontak` untuk menyimpan permohonan konsultasi langsung ke database backend dan opsi penerusan ke WhatsApp.
- **Admin Dashboard (`/admin`):**
  - Memantau dan mengubah status prospek (*Baru, Dihubungi, Deal, Batal*).
  - Mengelola katalog template (Tambah, Edit, Hapus, dan metrik klik sneak peek).
  - Mengubah nomor WhatsApp bisnis, pesan pembuka, dan informasi kontak tanpa menyentuh kode.
- **Arsitektur Siap cPanel:**
  - Backend REST API berbasis **PHP 8.x + PDO**.
  - Database **MySQL** dengan file skema & seed data lengkap: `data/database.sql`.
  - Konfigurasi `.htaccess` teroptimasi (Gzip compression, browser caching, header security, dan API URL rewriting).

---

## 📁 Struktur Direktori

```text
kopishop/
├── index.html                  # Landing page utama (11 seksi lengkap + sneak peek modal)
├── .htaccess                   # Konfigurasi Apache server cPanel
├── package.json                # Skrip build & development
├── build.js                    # Skrip compiler & packager zip cPanel
├── PANDUAN_DEPLOY_CPANEL.md    # Panduan lengkap deployment ke hosting cPanel
├── DOKUMENTASI_PENGGUNAAN...   # Panduan manual penggunaan fitur & admin
├── css/
│   └── style.css               # Seluruh styling, tema espresso/latte, dan modal preview
├── js/
│   ├── app.js                  # Logika aplikasi client (i18n, filter, sneak peek, form)
│   ├── anime.umd.min.js        # Library anime.js offline mandiri
│   └── anime-interactions.js   # Animasi micro-interactions & timeline
├── assets/                     # Gambar ilustrasi hero desktop & mobile
├── api/                        # Backend REST API (PHP 8.x + PDO)
│   ├── config.php              # Koneksi database (MySQL cPanel & SQLite fallback)
│   ├── templates.php           # Endpoint katalog template
│   ├── inquiries.php           # Endpoint leads konsultasi
│   ├── settings.php            # Endpoint konfigurasi situs
│   ├── auth.php                # Endpoint login/session admin
│   └── track.php               # Endpoint analytics klik sneak peek
├── admin/                      # Dashboard Admin
│   ├── index.html              # Antarmuka panel admin
│   ├── style.css               # Styling tema espresso untuk admin
│   └── admin.js                # Logika dashboard admin
├── data/
│   ├── database.sql            # File impor MySQL phpMyAdmin cPanel
│   └── templates.json          # Data JSON 45 template
└── dist/
    └── cpanel-deploy.zip       # ARSIP ZIP SIAP UNGGAH KE PUBLIC_HTML CPANEL
```

---

## 🚀 Menjalankan di Lokal (Development)

Pastikan PHP 8.x telah terpasang di komputer Anda.

```bash
# 1. Jalankan development server lokal
npm run dev
# atau:
php -S localhost:8000

# 2. Buka di browser:
# Website Utama : http://localhost:8000/
# Admin Panel   : http://localhost:8000/admin/
```

### Kredensial Login Admin Default:
- **URL:** `http://localhost:8000/admin/`
- **Username:** `admin`
- **Password:** `admin123`

---

## 📦 Panduan Singkat Deploy ke cPanel

1. **Unggah Berkas:** Masuk ke File Manager cPanel ➔ buka `public_html` ➔ unggah `dist/cpanel-deploy.zip` ➔ Ekstrak.
2. **Buat Database:** Buka menu **MySQL® Databases** di cPanel ➔ buat database dan user baru (berikan hak akses *ALL PRIVILEGES*).
3. **Impor SQL:** Buka **phpMyAdmin** ➔ pilih database Anda ➔ tab **Import** ➔ unggah file `data/database.sql` ➔ klik **Kirim / Go**.
4. **Koneksi Database:** Buka `api/config.php` via File Manager cPanel, sesuaikan `DB_NAME`, `DB_USER`, dan `DB_PASS`.
5. Selesai! Buka domain Anda di browser.

*Panduan detail langkah demi langkah tersedia di: [PANDUAN_DEPLOY_CPANEL.md](PANDUAN_DEPLOY_CPANEL.md).*

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
