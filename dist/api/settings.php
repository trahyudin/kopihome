<?php
/**
 * KOPIWEB - Settings API
 * GET: Mengambil konfigurasi situs publik (nomor WA, pesan default, kontak)
 * POST: Memperbarui pengaturan situs (Admin)
 */

require_once __DIR__ . '/config.php';

$pdo = get_db_connection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handle_get_settings($pdo);
        break;
    case 'POST':
    case 'PUT':
        require_admin();
        handle_update_settings($pdo);
        break;
    default:
        json_response(['status' => 'error', 'message' => 'Method not allowed'], 405);
}

function handle_get_settings($pdo) {
    $stmt = $pdo->query("SELECT `key`, `value` FROM settings");
    $rows = $stmt->fetchAll();

    $settings = [];
    foreach ($rows as $r) {
        $settings[$r['key']] = $r['value'];
    }

    json_response([
        'status' => 'success',
        'data' => $settings
    ]);
}

function handle_update_settings($pdo) {
    $data = get_json_input();
    if (empty($data)) {
        json_response(['status' => 'error', 'message' => 'Data pengaturan kosong'], 400);
    }

    $allowedKeys = ['wa_number', 'wa_msg_id', 'wa_msg_en', 'contact_email', 'contact_instagram', 'site_title'];
    $stmt = $pdo->prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");

    // Adaptasi syntax untuk MySQL vs SQLite
    if (DB_DRIVER === 'mysql') {
        $stmt = $pdo->prepare("INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)");
    }

    foreach ($data as $k => $v) {
        if (in_array($k, $allowedKeys)) {
            $stmt->execute([$k, trim((string)$v)]);
        }
    }

    json_response(['status' => 'success', 'message' => 'Pengaturan berhasil disimpan']);
}
