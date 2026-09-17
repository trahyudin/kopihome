<?php
/**
 * KOPIWEB - Backend Configuration & Database Handler
 * Mendukung MySQL (cPanel Production) & SQLite (Local Development Fallback)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ============================================================================
// KONFIGURASI DATABASE CPANEL (Ubah sesuai database di cPanel Anda)
// ============================================================================
define('DB_DRIVER', 'mysql'); // 'mysql' untuk cPanel, atau 'sqlite' jika ingin SQLite
define('DB_HOST', 'localhost');
define('DB_NAME', 'kopiweb_db');     // Contoh di cPanel: u123456_kopiweb
define('DB_USER', 'kopiweb_user');   // Contoh di cPanel: u123456_kopiuser
define('DB_PASS', '');               // Password database cPanel Anda
define('DB_CHARSET', 'utf8mb4');

// Fallback SQLite jika MySQL belum disetup
define('SQLITE_PATH', __DIR__ . '/../data/database.sqlite');

// Session config untuk Admin
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Koneksi Database menggunakan PDO
 */
function get_db_connection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    // 1. Coba koneksi MySQL terlebih dahulu jika dikonfigurasi
    if (DB_DRIVER === 'mysql' && DB_NAME !== '' && DB_USER !== 'kopiweb_user') {
        try {
            $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', DB_HOST, DB_NAME, DB_CHARSET);
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
            return $pdo;
        } catch (PDOException $e) {
            // Jika MySQL gagal di lokal, beralih ke SQLite fallback
            error_log('MySQL connection failed, falling back to SQLite: ' . $e->getMessage());
        }
    }

    // 2. Fallback ke SQLite (Cocok untuk Local Testing & Portabilitas Instan)
    try {
        $dbFile = SQLITE_PATH;
        $isNew = !file_exists($dbFile);
        $pdo = new PDO('sqlite:' . $dbFile, null, null, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);

        if ($isNew || filesize($dbFile) === 0) {
            init_sqlite_schema($pdo);
        }
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Database connection failed: ' . $e->getMessage()
        ]);
        exit;
    }
}

/**
 * Inisialisasi Skema SQLite otomatis bila database SQLite baru dibuat
 */
function init_sqlite_schema($pdo) {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS inquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            coffee_shop TEXT,
            whatsapp TEXT NOT NULL,
            package TEXT DEFAULT 'Visibility Landing Page',
            template_interest TEXT,
            notes TEXT,
            status TEXT DEFAULT 'baru',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS templates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name_id TEXT NOT NULL,
            name_en TEXT NOT NULL,
            url TEXT,
            shot TEXT,
            tags TEXT NOT NULL,
            desc_id TEXT NOT NULL,
            desc_en TEXT NOT NULL,
            sort_order INTEGER DEFAULT 0,
            clicks INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // Insert Default Settings
    $settings = [
        ['wa_number', '6281234567890'],
        ['wa_msg_id', 'Halo KopiWeb! Saya ingin konsultasi gratis tentang pembuatan website untuk coffee shop saya.'],
        ['wa_msg_en', 'Hi KopiWeb! I would like a free consultation about building a website for my coffee shop.'],
        ['contact_email', 'hello@optibis.id'],
        ['contact_instagram', 'optibis.id'],
        ['site_title', 'KopiWeb — Spesialis Website Coffee Shop']
    ];
    $stmt = $pdo->prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    foreach ($settings as $s) {
        $stmt->execute($s);
    }

    // Insert Default Admin (admin / admin123)
    $stmt = $pdo->prepare("INSERT OR IGNORE INTO users (username, password, email) VALUES (?, ?, ?)");
    $stmt->execute(['admin', '$2y$12$M1qdl/V1IkQprWimni5WPuP0f24C8u4cz4posbJxKDgnJ9lkX7Wtu', 'admin@kopiweb.id']);

    // Seed Templates from templates.json
    $jsonFile = __DIR__ . '/../data/templates.json';
    if (file_exists($jsonFile)) {
        $templates = json_decode(file_get_contents($jsonFile), true);
        if (is_array($templates)) {
            $stmt = $pdo->prepare("INSERT INTO templates (name_id, name_en, url, shot, tags, desc_id, desc_en, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($templates as $idx => $t) {
                $stmt->execute([
                    $t['name']['id'],
                    $t['name']['en'],
                    $t['url'] ?? null,
                    $t['shot'] ?? null,
                    json_encode($t['tags'] ?? [], JSON_UNESCAPED_UNICODE),
                    $t['desc']['id'],
                    $t['desc']['en'],
                    $idx
                ]);
            }
        }
    }
}

/**
 * Helper JSON Response
 */
function json_response($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

/**
 * Helper Read JSON Input Body
 */
function get_json_input() {
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

/**
 * Helper Cek Admin Authentication
 */
function is_admin_logged_in() {
    // 1. Cek PHP Session
    if (!empty($_SESSION['kopiweb_admin_id'])) {
        return true;
    }

    // 2. Cek Authorization Header (Bearer token)
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (preg_match('/Bearer\s+(.*)$/i', $auth, $matches)) {
        $token = trim($matches[1]);
        if (!empty($_SESSION['kopiweb_token']) && hash_equals($_SESSION['kopiweb_token'], $token)) {
            return true;
        }
    }

    return false;
}

function require_admin() {
    if (!is_admin_logged_in()) {
        json_response([
            'status' => 'error',
            'message' => 'Unauthorized. Akses khusus admin diperlukan.'
        ], 401);
    }
}
