# DOKUMENTASI LENGKAP PENGGUNAAN FITUR & PANDUAN DEPLOYMENT CPANEL
## Website KopiWeb — Jasa Pembuatan Website Coffee Shop (Fullstack Application)

Dokumen ini berisi panduan lengkap cara penggunaan seluruh fitur website **KopiWeb**, cara pengelolaan melalui **Admin Dashboard**, serta instruksi langkah-demi-langkah pengunggahan dan deployment ke **cPanel** agar frontend, backend REST API, dan database MySQL terhubung sempurna.

---

## DAFTAR ISI
1. [Ringkasan Arsitektur & Paket Siap Deploy](#1-ringkasan-arsitektur--paket-siap-deploy)
2. [Panduan Penggunaan Fitur Website (Frontend)](#2-panduan-penggunaan-fitur-website-frontend)
   - [A. Navigasi & Responsivitas](#a-navigasi--responsivitas)
   - [B. Switcher Tema (Espresso & Latte)](#b-switcher-tema-espresso--latte)
   - [C. Sistem Dwibahasa (ID / EN)](#c-sistem-dwibahasa-id--en)
   - [D. Fitur Sneak Peek Live Preview Template](#d-fitur-sneak-peek-live-preview-template)
   - [E. Filter Kategori & Pencarian Template](#e-filter-kategori--pencarian-template)
   - [F. Formulir Konsultasi & Penangkapan Leads](#f-formulir-konsultasi--penangkapan-leads)
   - [G. Integrasi WhatsApp Otomatis](#g-integrasi-whatsapp-otomatis)
   - [H. FAQ Accordion](#h-faq-accordion)
3. [Panduan Penggunaan Admin Dashboard](#3-panduan-penggunaan-admin-dashboard)
   - [A. Akses & Login Admin](#a-akses--login-admin)
   - [B. Memantau & Memproses Leads Masuk](#b-memantau--memproses-leads-masuk)
   - [C. Manajemen Katalog Template (CRUD)](#c-manajemen-katalog-template-crud)
   - [D. Mengubah Pengaturan Kontak & WhatsApp](#d-mengubah-pengaturan-kontak--whatsapp)
   - [E. Cara Mengganti Password Admin](#e-cara-mengganti-password-admin)
4. [Instruksi Pengunggahan & Deployment ke cPanel](#4-instruksi-pengunggahan--deployment-ke-cpanel)
   - [Langkah 1: Unggah & Ekstrak File ZIP](#langkah-1-unggah--ekstrak-file-zip)
   - [Langkah 2: Buat Database & User MySQL di cPanel](#langkah-2-buat-database--user-mysql-di-cpanel)
   - [Langkah 3: Impor Database via phpMyAdmin](#langkah-3-impor-database-via-phpmyadmin)
   - [Langkah 4: Hubungkan Backend ke Database MySQL](#langkah-4-hubungkan-backend-ke-database-mysql)
   - [Langkah 5: Pengujian Akhir](#langkah-5-pengujian-akhir)
5. [Troubleshooting & Solusi Kendala](#5-troubleshooting--solusi-kendala)

---

## 1. Ringkasan Arsitektur & Paket Siap Deploy

Aplikasi KopiWeb telah dibangun dengan spesifikasi teknologi ramah cPanel:
- **Frontend:** HTML5 Semantik, Vanilla CSS3 (Custom Properties), Vanilla JavaScript ES2020+, serta library animasi *anime.js* versi lokal mandiri (tidak bergantung CDN eksternal).
- **Backend:** RESTful API berbasis **PHP 8.x + PDO** dengan response JSON berstandar modern.
- **Database:** **MySQL / MariaDB** (standar cPanel) dengan auto-fallback SQLite untuk pengujian lokal.
- **Web Server:** Apache dengan konfigurasi `.htaccess` (kompresi Gzip, caching browser, keamanan header, dan URL rewrite).

### Berkas Utama yang Perlu Diketahui:
- **`dist/cpanel-deploy.zip`**: File arsip zip produksi yang **siap diunggah langsung** ke folder `public_html` cPanel Anda.
- **`data/database.sql`**: File skema dan data awal MySQL (berisi 45 template, pengaturan kontak, dan user admin).
- **`api/config.php`**: File konfigurasi koneksi database di cPanel.

---

## 2. Panduan Penggunaan Fitur Website (Frontend)

### A. Navigasi & Responsivitas
1. **Desktop:** Navbar melayang di bagian atas dengan efek *glassmorphism blur* saat halaman di-scroll ke bawah. Terdapat menu tautan navigasi langsung ke seksi `#why`, `#solusi`, `#proses`, `#template`, `#harga`, dan `#faq`.
2. **Mobile:** Pada layar ponsel (di bawah 760px), menu berpindah ke tombol hamburger (☰). Klik ikon hamburger untuk membuka laci navigasi mobile.

### B. Switcher Tema (Espresso & Latte)
- **Tombol:** Ikon Bulan / Matahari di navbar kanan (`#themeBtn`).
- **Mode Espresso (Default):** Nuansa gelap mewah khas biji kopi panggang (`#14100b`) dengan aksen karamel emas (`#e0a058`).
- **Mode Latte:** Nuansa terang lembut khas cangkir keramik latte (`#f6efe2`) dengan kontras teks cokelat tua.
- **Penyimpanan Otomatis:** Pilihan tema pengguna langsung tersimpan di `localStorage (kw-theme)`, sehingga saat halaman di-refresh, tema tidak akan kembali ke default.

### C. Sistem Dwibahasa (ID / EN)
- **Tombol:** Tombol pil bahasa **ID** dan **EN** di navbar kanan.
- **Bahasa Indonesia (ID):** Bahasa bawaan yang menyajikan konten lengkap bagi pasar lokal UMKM Indonesia.
- **English (EN):** Menerjemahkan seluruh heading, deskripsi, paket harga, kartu fitur, pertanyaan FAQ, hingga pesan pembuka WhatsApp secara otomatis.
- **Persistensi:** Pilihan bahasa tersimpan di `localStorage (kw-lang)` dan atribut `<html data-lang="en">` diterapkan sebelum halaman selesai dirender untuk mencegah teks berkedip.

### D. Fitur Sneak Peek Live Preview Template
Fitur unggulan untuk calon klien agar dapat "mencoba" website coffee shop secara interaktif sebelum memesan:
1. Scroll ke seksi **#template (Katalog Template)**.
2. Setiap kartu dari 45 template memiliki badge dan tombol **"Sneak Peek"**.
3. **Klik kartu atau tombol "Sneak Peek"**:
   - Modal layar penuh interaktif (**Sneak Peek Modal**) akan terbuka seketika.
   - Website template yang dipilih akan dimuat di dalam frame pratinjau langsung.
4. **Device Switcher (Uji Responsivitas)**:
   - Klik tombol **Desktop**: Melihat tampilan layar penuh (100%).
   - Klik tombol **Tablet**: Frame otomatis menyusut ke ukuran 768px (iPad/Tablet).
   - Klik tombol **Mobile**: Frame otomatis menyusut ke ukuran 390px (iPhone/Android).
5. **Aksi Langsung**:
   - **Buka di Tab Baru:** Membuka URL demo asli di tab browser baru.
   - **Pesan Template Ini:** Membuka WhatsApp secara otomatis dengan pesan pembuka yang langsung menyebutkan nama template yang sedang dilihat.
6. **Menutup Modal:** Klik tombol **X** di pojok kanan atas modal, klik di luar area modal, atau tekan tombol **Escape (ESC)** pada keyboard.

### E. Filter Kategori & Pencarian Template
Untuk mempermudah calon klien menemukan konsep coffee shop yang cocok di antara 45 template:
- **Search Bar:** Ketik kata kunci pada kotak pencarian (misal: *RPG, Jawa, Dark, Roastery, Minimalis, Pantai*), kartu template akan tersaring secara instan tanpa reload halaman.
- **Filter Pills:** Klik salah satu tombol kategori:
  - *Semua Template* (Menampilkan 45 item)
  - *Minimalis*
  - *Company Profile*
  - *Dark & Elegant*
  - *Luxury*
  - *Roastery*
  - *Modern*
  - *Kreatif & RPG*

### F. Formulir Konsultasi & Penangkapan Leads
Terletak pada seksi **#kontak**:
1. Calon klien mengisi data:
   - **Nama Lengkap** *(Wajib)*
   - **Nama Coffee Shop / Brand** *(Opsional)*
   - **Nomor WhatsApp / Telepon** *(Wajib)*
   - **Paket yang Diminati** *(Dropdown pilihan paket)*
   - **Template yang Diminati** *(Dropdown otomatis terisi 45 nama template)*
   - **Catatan Tambahan** *(Konsep / kebutuhan khusus)*
2. Klik tombol **"Kirim Permohonan Konsultasi"**.
3. Sistem secara otomatis:
   - Memvalidasi data input.
   - Menyimpan data prospek ke database (`table inquiries`) via endpoint `POST /api/inquiries.php`.
   - Menampilkan notifikasi **Toast Konfirmasi Hijau** yang elegan.
   - Memberikan dialog konfirmasi untuk langsung meneruskan rincian pesan ke chat WhatsApp resmi.

### G. Integrasi WhatsApp Otomatis
- Terdapat 7 tombol CTA WhatsApp di berbagai seksi strategis (Navbar, Hero, Solusi, Showcase, Harga, Kontak, Footer).
- Semua tombol memiliki atribut `[data-wa]` yang otomatis merangkai deep-link `https://wa.me/<nomor>?text=<pesan>`.
- Jika bahasa aktif adalah **English**, pesan WhatsApp otomatis berganti ke teks bahasa Inggris.

### H. FAQ Accordion
- Berisi 6 pertanyaan umum seputar jasa pembuatan website kopi, domain, hosting, dan waktu pengerjaan.
- Bekerja secara eksklusif: membuka satu pertanyaan akan otomatis menutup pertanyaan lain yang sedang terbuka, dengan animasi rotasi ikon panah dan transisi tinggi yang mulus.

---

## 3. Panduan Penggunaan Admin Dashboard

Dashboard admin dirancang khusus untuk pemilik website agar dapat mengelola bisnis tanpa perlu keahlian koding.

### A. Akses & Login Admin
1. Buka browser dan akses alamat:
   ```text
   https://domainanda.com/admin/
   ```
2. Masukkan kredensial bawaan:
   - **Username:** `admin`
   - **Password:** `admin123`
3. Klik **Masuk Dashboard**.

---

### B. Memantau & Memproses Leads Masuk (Tab 1)
Pada tab **"Data Leads & Konsultasi"**, Anda dapat melihat seluruh permohonan konsultasi yang dikirim pengunjung website:
1. **Statistik Teratas:**
   - *Total Leads Konsultasi*: Total prospek yang pernah masuk.
   - *Leads Baru*: Jumlah prospek yang belum dihubungi (berwarna biru).
   - *Leads Deal*: Jumlah prospek yang berhasil closing project (berwarna hijau).
2. **Tabel Leads:**
   - **Nama & Coffee Shop:** Menampilkan nama calon klien dan nama kedai kopinya.
   - **WhatsApp:** Tombol hijau cepat `💬 [Nomor WA]`. Klik tombol ini untuk langsung membuka WhatsApp Web / aplikasi WhatsApp dan memulai obrolan dengan prospek tanpa perlu menyimpan nomor manual!
   - **Paket & Template:** Mengetahui paket dan gaya website yang diinginkan calon klien.
   - **Dropdown Status Lead:** Anda dapat mengubah status proses lead secara real-time:
     - 🔵 **Baru** (Prospek baru masuk)
     - 🟡 **Dihubungi** (Sedang dalam tahap chat / penawaran)
     - 🟢 **Deal / Order** (Klien sepakat dan memesan)
     - 🔴 **Batal** (Prospek tidak melanjutkan)
   - **Hapus:** Menghapus data prospek yang tidak relevan.
3. **Filter Status:** Gunakan dropdown status di kanan atas tabel untuk memfilter tampilan hanya prospek dengan status tertentu.

---

### C. Manajemen Katalog Template (Tab 2)
Pada tab **"Katalog Template"**, Anda dapat mengelola 45 template yang tampil di halaman depan:
1. **Cari Template:** Gunakan kotak pencarian untuk menemukan template berdasarkan nama.
2. **Tambah Template Baru:**
   - Klik tombol **"+ Tambah Template"**.
   - Isi form modal: Nama (ID), Nama (EN), URL Demo, URL Screenshot, Kategori/Tags, dan Deskripsi.
   - Klik **Simpan Template**. Template baru akan langsung muncul di katalog landing page!
3. **Edit Template:**
   - Klik tombol **"Edit"** pada baris template yang ingin diubah (misal: memperbarui URL demo atau mengganti screenshot).
   - Simpan perubahan.
4. **Hapus Template:**
   - Klik tombol **"Hapus"** untuk menghapus template dari database.
5. **Metrik Sneak Peeks (Clicks):**
   - Kolom ini mencatat berapa kali pengunjung mengklik atau membuka sneak peek preview pada masing-masing template, membantu Anda menganalisis desain mana yang paling diminati pasar!

---

### D. Mengubah Pengaturan Kontak & WhatsApp (Tab 3)
Pada tab **"Pengaturan Website"**, Anda dapat mengubah informasi bisnis yang tampil di landing page tanpa menyentuh kode program:
1. **Nomor WhatsApp Bisnis:** Masukkan nomor WhatsApp format internasional tanpa simbol `+` atau spasi (contoh: `6281234567890`). Seluruh tombol CTA di website utama akan langsung mengarah ke nomor baru ini.
2. **Pesan Pembuka WhatsApp (ID & EN):** Teks salam pembuka otomatis saat pengunjung mengklik tombol konsultasi.
3. **Email Kontak:** Mengubah link `mailto:` di footer dan kartu kontak.
4. **Username Instagram:** Mengubah link Instagram di kartu kontak dan footer.
5. **Judul Website (SEO Title):** Mengubah judul meta halaman depan.
6. Klik **"Simpan Perubahan"**.

---

### E. Cara Mengganti Password Admin
Password admin disimpan menggunakan hashing satu arah standar industri (**Bcrypt**). Untuk mengganti password:
1. Buka **phpMyAdmin** di cPanel hosting Anda.
2. Pilih database KopiWeb Anda, lalu klik tabel **`users`**.
3. Klik tombol **Edit** pada baris user `admin`.
4. Pada baris kolom `password`:
   - Pada kolom **Function (Fungsi)**, pilih **`PASSWORD_BCRYPT`** (atau `BCRYPT`).
   - Pada kolom **Value (Nilai)**, ketikkan password baru Anda.
5. Klik tombol **Go / Kirim** di bagian bawah. Password baru Anda telah aktif!

---

## 4. Instruksi Pengunggahan & Deployment ke cPanel

Ikuti panduan berikut untuk melakukan deployment ke hosting cPanel Anda.

### Langkah 1: Unggah & Ekstrak File ZIP
1. Buka cPanel hosting Anda di browser: `https://domainanda.com:2083`.
2. Klik ikon menu **File Manager (Pengelola File)**.
3. Buka direktori root website Anda:
   - Jika untuk domain utama: masuk ke folder **`public_html`**.
   - Jika untuk subdomain / addon domain: masuk ke folder tujuan subdomain tersebut (misal: `public_html/kopiweb`).
4. Klik menu **Upload** di bilah atas File Manager.
5. Seret (*drag and drop*) atau pilih file **`dist/cpanel-deploy.zip`** dari komputer Anda.
6. Tunggu hingga progress bar menunjukkan 100% (berwarna hijau).
7. Kembali ke tab File Manager, klik tombol **Reload**.
8. Klik kanan pada file `cpanel-deploy.zip` yang baru diunggah, pilih **Extract**, lalu konfirmasi ekstraksi ke folder saat ini.
9. Pastikan file `index.html`, folder `api/`, `admin/`, `css/`, `js/`, `data/`, dan `.htaccess` sudah berada langsung di dalam folder tersebut.
10. Anda boleh menghapus file `cpanel-deploy.zip` dari File Manager agar ruang hosting tetap rapi.

---

### Langkah 2: Buat Database & User MySQL di cPanel
1. Di halaman beranda cPanel, cari dan buka menu **MySQL® Database Wizard** (atau **MySQL Databases**).
2. **Langkah 1 (Create A Database):**
   - Masukkan nama database, misalnya: `kopiweb`.
   - Nama lengkap database Anda akan menjadi: `usercpanel_kopiweb`.
   - Klik **Next Step**.
3. **Langkah 2 (Create Database Users):**
   - Masukkan nama pengguna database baru, misalnya: `kopiuser`.
   - Nama lengkap user akan menjadi: `usercpanel_kopiuser`.
   - Buat password yang kuat (gunakan tombol *Password Generator*). **Salin dan simpan password ini di notepad Anda.**
   - Klik **Create User**.
4. **Langkah 3 (Add User to the Database):**
   - Centang kotak paling atas: **ALL PRIVILEGES (Semua Hak Akses)**.
   - Klik tombol **Make Changes**.
5. Database MySQL Anda sekarang sudah siap digunakan!

---

### Langkah 3: Impor Database via phpMyAdmin
1. Kembali ke halaman beranda cPanel, cari dan buka menu **phpMyAdmin**.
2. Di panel sebelah kiri phpMyAdmin, klik nama database Anda yang baru dibuat (`usercpanel_kopiweb`).
3. Klik tab **Import** di bagian atas menu phpMyAdmin.
4. Pada bagian *File to import*, klik tombol **Choose File (Pilih Berkas)**.
5. Cari dan pilih file **`data/database.sql`** (berada di dalam folder proyek ini).
6. Biarkan opsi lainnya pada pengaturan default (Format: SQL).
7. Gulir ke bagian paling bawah, lalu klik tombol **Import** (atau **Go / Kirim**).
8. Tunggu beberapa saat hingga muncul notifikasi sukses berwarna hijau:
   > *"Import has been successfully finished, 4 tables created (settings, users, inquiries, templates)."*
9. Seluruh 45 template, pengaturan kontak, dan user admin kini telah terisi ke dalam database MySQL Anda.

---

### Langkah 4: Hubungkan Backend ke Database MySQL
1. Kembali ke **File Manager** cPanel.
2. Masuk ke folder **`public_html/api/`** (atau `nama_subdomain/api/`).
3. Klik kanan pada file **`config.php`**, lalu pilih **Edit**.
4. Temukan baris konfigurasi berikut di baris 20–25:
   ```php
   // ============================================================================
   // KONFIGURASI DATABASE CPANEL (Ubah sesuai database di cPanel Anda)
   // ============================================================================
   define('DB_DRIVER', 'mysql');
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'kopiweb_db');     // Ganti dengan Nama Database cPanel Anda
   define('DB_USER', 'kopiweb_user');   // Ganti dengan User Database cPanel Anda
   define('DB_PASS', '');               // Ganti dengan Password Database Anda
   define('DB_CHARSET', 'utf8mb4');
   ```
5. Ubah nilainya sesuai dengan data yang Anda buat pada Langkah 2, contoh:
   ```php
   define('DB_DRIVER', 'mysql');
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'usercpanel_kopiweb');
   define('DB_USER', 'usercpanel_kopiuser');
   define('DB_PASS', 'PasswordKuatAnda_123!');
   define('DB_CHARSET', 'utf8mb4');
   ```
6. Klik tombol **Save Changes (Simpan Perubahan)** di pojok kanan atas editor.

---

### Langkah 5: Pengujian Akhir
1. Buka browser dan kunjungi domain Anda: `https://domainanda.com/`
2. **Cek Katalog & Sneak Peek:** Buka seksi template, coba cari template, dan klik tombol **Sneak Peek** untuk memastikan preview responsif berfungsi.
3. **Cek Form Konsultasi:** Kirim permohonan konsultasi uji coba di seksi `#kontak`. Pastikan toast hijau muncul.
4. **Cek Admin Dashboard:** Buka `https://domainanda.com/admin/`, login dengan `admin` / `admin123`, dan pastikan data konsultasi uji coba tadi langsung muncul di tabel leads!

---

## 5. Troubleshooting & Solusi Kendala

| Kendala | Penyebab | Solusi |
|---|---|---|
| **Error 500 Internal Server Error saat membuka website** | Versi PHP di cPanel usang atau file `.htaccess` bentrok | Masuk ke menu cPanel ➔ **Select PHP Version** (atau *MultiPHP Manager*). Pastikan memilih versi **PHP 8.0, 8.1, 8.2, atau 8.3**. Pastikan ekstensi `pdo_mysql` dicentang aktif. |
| **API mengembalikan pesan "Database connection failed"** | Nama database, username, atau password di `api/config.php` salah ketik | Buka kembali `api/config.php`, periksa apakah ada spasi yang tidak sengaja terbawa, dan pastikan user database sudah ditambahkan ke database dengan hak akses *ALL PRIVILEGES*. |
| **Data template tidak muncul di katalog** | Izin baca file atau koneksi MySQL terputus | KopiWeb memiliki mekanisme fallback otomatis. Jika database MySQL tidak dapat diakses, sistem secara otomatis membaca cadangan dari `data/templates.json` sehingga website tidak akan pernah kosong. Periksa koneksi database Anda di `api/config.php`. |
| **File zip gagal diekstrak di cPanel** | Kuota penyimpanan hosting penuh (*Disk Quota Exceeded*) | Periksa kapasitas ruang penyimpanan pada panel info sebelah kanan cPanel. Bersihkan file yang tidak terpakai jika kuota penuh. |
| **Iframe Sneak Peek menampilkan layar putih / abu-abu pada template tertentu** | Beberapa platform demo pihak ketiga (misal: header `X-Frame-Options: SAMEORIGIN`) membatasi embedding iframe langsung | Sistem Sneak Peek KopiWeb secara otomatis menyediakan tombol **"Buka di Tab Baru"** di bagian atas modal pratinjau agar pengunjung tetap dapat melihat live demo template secara langsung. |

---

*Dokumentasi disusun untuk project KopiWeb — Siap Produksi 2026.*
