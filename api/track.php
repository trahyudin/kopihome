<?php
/**
 * KOPIWEB - Track API
 * POST: Menambah counter interaksi template (sneak peek / order klik)
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['status' => 'error', 'message' => 'Method not allowed'], 405);
}

$pdo = get_db_connection();
$data = get_json_input();
$templateId = (int)($data['template_id'] ?? ($_GET['id'] ?? 0));

if ($templateId > 0) {
    $stmt = $pdo->prepare("UPDATE templates SET clicks = clicks + 1 WHERE id = ?");
    $stmt->execute([$templateId]);
}

json_response(['status' => 'success']);
