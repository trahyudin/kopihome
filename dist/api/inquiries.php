<?php
/**
 * KOPIWEB - Inquiries API (Lead Capture & Consultation Form)
 * POST: Pengunjung mengirim form permohonan konsultasi / order
 * GET / PATCH / DELETE: Akses Admin untuk memantau & memproses leads
 */

require_once __DIR__ . '/config.php';

$pdo = get_db_connection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        handle_submit_inquiry($pdo);
        break;
    case 'GET':
        require_admin();
        handle_list_inquiries($pdo);
        break;
    case 'PATCH':
    case 'PUT':
        require_admin();
        handle_update_status($pdo);
        break;
    case 'DELETE':
        require_admin();
        handle_delete_inquiry($pdo);
        break;
    default:
        json_response(['status' => 'error', 'message' => 'Method not allowed'], 405);
}

function handle_submit_inquiry($pdo) {
    $data = get_json_input();

    $name = trim($data['name'] ?? '');
    $coffee_shop = trim($data['coffee_shop'] ?? '');
    $whatsapp = trim($data['whatsapp'] ?? '');
    $package = trim($data['package'] ?? 'Visibility Landing Page');
    $template_interest = trim($data['template_interest'] ?? '');
    $notes = trim($data['notes'] ?? '');

    // Validasi
    if ($name === '') {
        json_response(['status' => 'error', 'message' => 'Nama lengkap wajib diisi.'], 422);
    }
    if ($whatsapp === '') {
        json_response(['status' => 'error', 'message' => 'Nomor WhatsApp / telepon wajib diisi.'], 422);
    }

    // Bersihkan nomor WhatsApp (hanya angka dan plus)
    $clean_wa = preg_replace('/[^0-9]/', '', $whatsapp);
    if (strlen($clean_wa) < 9) {
        json_response(['status' => 'error', 'message' => 'Nomor WhatsApp tampak tidak valid.'], 422);
    }

    $stmt = $pdo->prepare("
        INSERT INTO inquiries (name, coffee_shop, whatsapp, package, template_interest, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, 'baru')
    ");
    $stmt->execute([
        $name,
        $coffee_shop ?: null,
        $whatsapp,
        $package ?: 'Visibility Landing Page',
        $template_interest ?: null,
        $notes ?: null
    ]);

    $insertId = (int)$pdo->lastInsertId();

    // Buat deep-link WhatsApp otomatis agar pengunjung juga bisa langsung chat
    $stmtSettings = $pdo->query("SELECT value FROM settings WHERE key = 'wa_number'");
    $waNumber = $stmtSettings->fetchColumn() ?: '6281234567890';

    $msg = "Halo KopiWeb! Saya sudah mengisi formulir konsultasi.\n"
         . "Nama: {$name}\n"
         . ($coffee_shop ? "Coffee Shop: {$coffee_shop}\n" : "")
         . "Paket Minat: {$package}\n"
         . ($template_interest ? "Template Minat: {$template_interest}\n" : "")
         . ($notes ? "Catatan: {$notes}\n" : "")
         . "Mohon info tindak lanjutnya. Terima kasih!";

    $waLink = "https://wa.me/{$waNumber}?text=" . rawurlencode($msg);

    json_response([
        'status' => 'success',
        'message' => 'Permohonan konsultasi Anda berhasil dikirim! Tim kami akan segera menghubungi Anda.',
        'data' => [
            'id' => $insertId,
            'whatsapp_redirect' => $waLink
        ]
    ], 201);
}

function handle_list_inquiries($pdo) {
    $status = isset($_GET['status']) ? trim($_GET['status']) : '';
    $sql = "SELECT * FROM inquiries";
    $params = [];

    if ($status !== '' && in_array($status, ['baru', 'dihubungi', 'deal', 'batal'])) {
        $sql .= " WHERE status = ?";
        $params[] = $status;
    }

    $sql .= " ORDER BY created_at DESC, id DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    json_response([
        'status' => 'success',
        'count'  => count($rows),
        'data'   => $rows
    ]);
}

function handle_update_status($pdo) {
    $data = get_json_input();
    $id = (int)($data['id'] ?? ($_GET['id'] ?? 0));
    $status = trim($data['status'] ?? '');
    $notes = isset($data['notes']) ? trim($data['notes']) : null;

    if (!$id) {
        json_response(['status' => 'error', 'message' => 'ID inquiry tidak valid'], 400);
    }
    if (!in_array($status, ['baru', 'dihubungi', 'deal', 'batal'])) {
        json_response(['status' => 'error', 'message' => 'Status tidak valid'], 400);
    }

    if ($notes !== null) {
        $stmt = $pdo->prepare("UPDATE inquiries SET status = ?, notes = ? WHERE id = ?");
        $stmt->execute([$status, $notes, $id]);
    } else {
        $stmt = $pdo->prepare("UPDATE inquiries SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);
    }

    json_response(['status' => 'success', 'message' => 'Status lead berhasil diperbarui']);
}

function handle_delete_inquiry($pdo) {
    $id = (int)($_GET['id'] ?? get_json_input()['id'] ?? 0);
    if (!$id) {
        json_response(['status' => 'error', 'message' => 'ID inquiry tidak valid'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM inquiries WHERE id = ?");
    $stmt->execute([$id]);

    json_response(['status' => 'success', 'message' => 'Inquiry berhasil dihapus']);
}
