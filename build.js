/**
 * KOPIWEB - Production Build & cPanel Packager Script
 * Copies production files to dist/ and creates cpanel-deploy.zip
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');
const zipFile = path.join(rootDir, 'dist', 'cpanel-deploy.zip');

console.log('🚀 Memulai proses build KopiWeb untuk cPanel...\n');

// 1. Bersihkan & buat folder dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 2. Daftar file & folder yang dimasukkan ke paket produksi cPanel
const itemsToCopy = [
  'index.html',
  '.htaccess',
  'css',
  'js',
  'assets',
  'api',
  'admin',
  'data'
];

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(child => {
      // Kecualikan file sementara SQLite lokal atau file backup
      if (child.endsWith('.sqlite') || child.endsWith('.tmp') || child === 'original_style.css') return;
      copyRecursive(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

let copiedCount = 0;
itemsToCopy.forEach(item => {
  const srcPath = path.join(rootDir, item);
  const destPath = path.join(distDir, item);
  if (fs.existsSync(srcPath)) {
    copyRecursive(srcPath, destPath);
    console.log(` ✓ Disalin: ${item}`);
    copiedCount++;
  } else {
    console.warn(` ⚠️ Peringatan: ${item} tidak ditemukan.`);
  }
});

console.log(`\n📦 Total ${copiedCount} item berhasil dikompilasi ke folder dist/`);

// 3. Buat file ZIP untuk cPanel menggunakan PowerShell Compress-Archive
try {
  console.log('\n🗜️  Membuat cpanel-deploy.zip...');
  const psCmd = `powershell -Command "Compress-Archive -Path '${distDir}\\*' -DestinationPath '${zipFile}' -Force"`;
  execSync(psCmd, { stdio: 'inherit' });
  const zipStat = fs.statSync(zipFile);
  const sizeMb = (zipStat.size / (1024 * 1024)).toFixed(2);
  console.log(`\n🎉 SUKSES! File zip siap deploy telah dibuat:`);
  console.log(`   Lokasi : dist/cpanel-deploy.zip`);
  console.log(`   Ukuran : ${sizeMb} MB (${zipStat.size.toLocaleString()} bytes)`);
  console.log(`\n👉 Silakan unggah file 'cpanel-deploy.zip' ini langsung ke folder 'public_html' di cPanel Anda.`);
} catch (err) {
  console.error('Gagal membuat zip secara otomatis:', err.message);
  console.log('Anda tetap dapat mengunggah isi folder dist/ secara manual ke cPanel.');
}
