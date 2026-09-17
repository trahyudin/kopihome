# PANDUAN LENGKAP DEPLOYMENT KOPIWEB KE CPANEL

Dokumentasi resmi dan panduan langkah-demi-langkah untuk mengunggah, menghubungkan database MySQL, dan menjalankan website **KopiWeb** (Frontend + Backend REST API + Database) di hosting **cPanel**.

---

## 1. Persiapan File Deployment

Proyek ini telah dilengkapi dengan skrip build otomatis. File yang siap diunggah ke cPanel berada di:
- **File ZIP Siap Deploy:** `dist/cpanel-deploy.zip`
- **Atau Folder Siap Unggah:** `dist/`

Jika Anda ingin membuat ulang file zip kapan saja, cukup jalankan perintah:
```bash
npm run build
# atau: node build.js
```

---

## 2. Langkah 1: Unggah File ke cPanel

1. **Login ke cPanel** akun hosting Anda (misal: `https://domainanda.com:2083`).
2. Masuk ke menu **File Manager** (Pengelola File).
3. Buka direktori root website Anda, umumnya:
   - Untuk domain utama: folder **`public_html`**
   - Untuk subdomain/addon domain: folder direktori tujuan subdomain tersebut (misal: `public_html/kopiweb`).
4. Klik tombol **Upload** di bagian atas menu File Manager.
5. Pilih dan unggah file **`dist/cpanel-deploy.zip`**.
6. Setelah proses upload mencapai 100% (berwarna hijau), kembali ke File Manager.
7. Klik kanan pada file `cpanel-deploy.zip`, lalu pilih **Extract** (Ekstrak ke direktori saat ini).
8. Pastikan struktur file di `public_html` terlihat seperti berikut:
   ```text
   public_html/
   ├── index.html
   ├── .htaccess
   ├── css/
   │   └── style.css
   ├── js/
   │   ├── app.js
   │   ├── anime.umd.min.js
   │   └── anime-interactions.js
   ├── assets/
   │   ├── fig-hero.png
   │   └── fig-mobile.png
   ├── api/
   │   ├── config.php
   │   ├── templates.php
   │   ├── inquiries.php
   │   ├── settings.php
   │   ├── auth.php
   │   ├── track.php
   │   └── .htaccess
   ├── admin/
   │   ├── index.html
   │   ├── style.css
   │   └── admin.js
   └── data/
       ├── database.sql
       └── templates.json
   ```
9. (Opsional) Hapus file `cpanel-deploy.zip` dari server untuk menghemat ruang disk.

---

## 3. Langkah 2: Buat Database MySQL & User di cPanel

1. Di halaman utama cPanel, cari dan buka menu **MySQL® Database Wizard** (atau **MySQL Databases**).
2. **Langkah 1 (Create A Database):**
   - Masukkan nama database, misal: `kopiweb`.
   - Nama lengkapnya akan menjadi: `usernamecpanel_kopiweb`.
   - Klik **Next Step**.
3. **Langkah 2 (Create Database Users):**
   - Masukkan Username baru, misal: `kopiuser`.
   - Buat Password yang kuat (gunakan tombol *Password Generator* dan catat passwordnya).
   - Klik **Create User**.
4. **Langkah 3 (Add User to Database):**
   - Centang kotak **ALL PRIVILEGES** (Semua Hak Akses).
   - Klik **Make Changes** (Terapkan Perubahan).
5. **Catat 3 informasi penting ini:**
   - Nama Database: `usernamecpanel_kopiweb`
   - User Database: `usernamecpanel_kopiuser`
   - Password Database: *(password yang tadi Anda buat)*

---

## 4. Langkah 3: Impor Skema & Data Awal via phpMyAdmin

1. Di halaman utama cPanel, buka menu **phpMyAdmin**.
2. Di panel sebelah kiri phpMyAdmin, klik pada nama database Anda yang baru dibuat (`usernamecpanel_kopiweb`).
3. Klik tab **Import** di bagian atas menu.
4. Pada bagian *File to import*, klik tombol **Choose File** (Pilih Berkas).
5. Pilih file **`data/database.sql`** (bisa Anda download terlebih dahulu ke komputer atau unggah langsung).
6. Biarkan opsi lainnya default (Format: SQL), lalu scroll ke bawah dan klik tombol **Import** (Kirim).
7. Tunggu beberapa detik hingga muncul pesan sukses berwarna hijau:
   > *"Import has been successfully finished, 4 tables created (settings, users, inquiries, templates)."*
8. Ke-45 template kopi, akun admin awal, serta pengaturan website kini telah tersimpan di MySQL cPanel Anda!

---

## 5. Langkah 4: Hubungkan API ke Database MySQL

1. Di File Manager cPanel, masuk ke folder **`public_html/api/`**.
2. Klik kanan pada file **`config.php`**, lalu pilih **Edit**.
3. Cari baris berikut di bagian atas file:
   ```php
   define('DB_DRIVER', 'mysql');
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'kopiweb_db');     // Ganti dengan nama database cPanel Anda
   define('DB_USER', 'kopiweb_user');   // Ganti dengan user database cPanel Anda
   define('DB_PASS', '');               // Ganti dengan password database cPanel Anda
   define('DB_CHARSET', 'utf8mb4');
   ```
4. Sesuaikan nilai dengan data yang Anda buat pada Langkah 2, contoh:
   ```php
   define('DB_DRIVER', 'mysql');
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'u123456_kopiweb');
   define('DB_USER', 'u123456_kopiuser');
   define('DB_PASS', 'PasswordKuatAnda_123!');
   define('DB_CHARSET', 'utf8mb4');
   ```
5. Klik tombol **Save Changes** di pojok kanan atas.

---

## 6. Langkah 5: Pengujian & Verifikasi Fitur

### A. Uji Website Utama
- Buka browser dan akses alamat domain Anda: `https://domainanda.com/`
- **Tampilan & Tema:** Periksa warna *Espresso* (gelap) & *Latte* (terang) via tombol bulan/matahari di navbar.
- **Bahasa (i18n):** Klik tombol **EN** dan **ID**, pastikan seluruh seksi dan link WhatsApp berubah otomatis.
- **Sneak Peek Template:**
  1. Scroll ke seksi **#template** (Showcase).
  2. Coba fitur pencarian dan filter kategori (*Minimalis*, *Company Profile*, *Dark*, dll.).
  3. Klik kartu atau tombol **"Sneak Peek"** pada template mana pun.
  4. Modal preview interaktif akan terbuka seketika dengan device switcher (**Desktop**, **Tablet**, **Mobile**).
  5. Klik tombol *"Pesan Template Ini"* untuk memastikan nomor dan pesan WhatsApp terisi otomatis sesuai template yang sedang dipratinjau.

### B. Uji Formulir Konsultasi (Lead Capture)
- Scroll ke seksi **#kontak**.
- Isi formulir: Nama, Nama Coffee Shop, Nomor WhatsApp, Paket, dan Catatan.
- Klik tombol **"Kirim Permohonan Konsultasi"**.
- Notifikasi Toast hijau akan muncul mengonfirmasi data berhasil tersimpan ke database, dan Anda akan diberikan opsi membuka chat WhatsApp langsung.

### C. Uji Dashboard Admin
- Buka URL: `https://domainanda.com/admin/`
- Masukkan kredensial login default:
  - **Username:** `admin`
  - **Password:** `admin123`
- Di dalam dashboard admin, Anda dapat:
  1. Melihat data prospek konsultasi yang baru saja dikirimkan pada Tab **Data Leads & Konsultasi**.
  2. Mengubah status lead (*Baru* ➔ *Dihubungi* ➔ *Deal*).
  3. Mengklik tombol WhatsApp klien untuk langsung memulai obrolan.
  4. Mengelola/mengedit ke-45 katalog template pada Tab **Katalog Template**.
  5. Mengubah nomor WhatsApp bisnis, email, dan Instagram langsung pada Tab **Pengaturan Website** tanpa perlu menyentuh kode program.

---

## 7. Tips Keamanan & Troubleshooting

### Bagaimana cara mengganti password admin?
Anda dapat mengubah password akun admin kapan saja melalui phpMyAdmin:
1. Buka tabel `users`.
2. Klik tombol **Edit** pada user `admin`.
3. Pada kolom `password`, pilih fungsi **PASSWORD_BCRYPT** (atau gunakan fungsi hash bcrypt PHP) dan masukkan password baru Anda, lalu klik **Go**.

### Error 500 Internal Server Error saat dibuka di cPanel?
1. Buka cPanel ➔ **Select PHP Version**, pastikan versi PHP yang aktif adalah **PHP 8.0, 8.1, 8.2, atau 8.3+**.
2. Pastikan ekstensi `pdo_mysql` dicentang aktif.
3. Pastikan konfigurasi nama database, user, dan password di `api/config.php` sudah sesuai tanpa ada salah ketik.
