<?php
/**
 * KOPIWEB - Templates API
 * GET: Mengambil daftar 45 template (dengan filter/pencarian)
 * POST / PUT / DELETE: Manajemen template (Admin)
 */

require_once __DIR__ . '/config.php';

$pdo = get_db_connection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handle_get($pdo);
        break;
    case 'POST':
        require_admin();
        handle_post($pdo);
        break;
    case 'PUT':
        require_admin();
        handle_put($pdo);
        break;
    case 'DELETE':
        require_admin();
        handle_delete($pdo);
        break;
    default:
        json_response(['status' => 'error', 'message' => 'Method not allowed'], 405);
}

function handle_get($pdo) {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    $tag = isset($_GET['tag']) ? trim($_GET['tag']) : '';
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';

    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM templates WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) {
            json_response(['status' => 'error', 'message' => 'Template tidak ditemukan'], 404);
        }
        json_response(['status' => 'success', 'data' => format_template_item($row)]);
    }

    $sql = "SELECT * FROM templates WHERE is_active = 1";
    $params = [];

    if ($search !== '') {
        $sql .= " AND (name_id LIKE ? OR name_en LIKE ? OR desc_id LIKE ? OR desc_en LIKE ? OR tags LIKE ?)";
        $term = "%{$search}%";
        $params = array_merge($params, [$term, $term, $term, $term, $term]);
    }

    if ($tag !== '' && strtolower($tag) !== 'all' && strtolower($tag) !== 'semua') {
        $sql .= " AND tags LIKE ?";
        $params[] = "%\"{$tag}\"%";
    }

    $sql .= " ORDER BY sort_order ASC, id ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $data = [];
    foreach ($rows as $r) {
        $data[] = format_template_item($r);
    }

    json_response([
        'status' => 'success',
        'count'  => count($data),
        'data'   => $data
    ]);
}

function format_template_item($row) {
    $tags = json_decode($row['tags'], true);
    if (!is_array($tags)) {
        $tags = array_map('trim', explode(',', $row['tags']));
    }

    return [
        'id'        => (int)$row['id'],
        'name'      => [
            'id' => $row['name_id'],
            'en' => $row['name_en']
        ],
        'url'       => $row['url'],
        'shot'      => $row['shot'],
        'tags'      => $tags,
        'desc'      => [
            'id' => $row['desc_id'],
            'en' => $row['desc_en']
        ],
        'clicks'    => (int)($row['clicks'] ?? 0),
        'sort_order'=> (int)($row['sort_order'] ?? 0),
        'is_active' => (bool)($row['is_active'] ?? 1),
    ];
}

function handle_post($pdo) {
    $data = get_json_input();
    $name_id = trim($data['name_id'] ?? ($data['name']['id'] ?? ''));
    $name_en = trim($data['name_en'] ?? ($data['name']['en'] ?? $name_id));
    $url     = trim($data['url'] ?? '');
    $shot    = trim($data['shot'] ?? '');
    $tags    = is_array($data['tags'] ?? null) ? json_encode($data['tags'], JSON_UNESCAPED_UNICODE) : json_encode([], JSON_UNESCAPED_UNICODE);
    $desc_id = trim($data['desc_id'] ?? ($data['desc']['id'] ?? ''));
    $desc_en = trim($data['desc_en'] ?? ($data['desc']['en'] ?? $desc_id));

    if (!$name_id) {
        json_response(['status' => 'error', 'message' => 'Nama template wajib diisi'], 400);
    }

    $stmt = $pdo->prepare("SELECT MAX(sort_order) as m FROM templates");
    $stmt->execute();
    $maxOrder = (int)($stmt->fetch()['m'] ?? 0);

    $stmt = $pdo->prepare("INSERT INTO templates (name_id, name_en, url, shot, tags, desc_id, desc_en, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$name_id, $name_en, $url ?: null, $shot ?: null, $tags, $desc_id, $desc_en, $maxOrder + 1]);

    $newId = (int)$pdo->lastInsertId();
    json_response([
        'status' => 'success',
        'message' => 'Template berhasil ditambahkan',
        'id' => $newId
    ], 201);
}

function handle_put($pdo) {
    $data = get_json_input();
    $id = (int)($data['id'] ?? ($_GET['id'] ?? 0));
    if (!$id) {
        json_response(['status' => 'error', 'message' => 'ID template tidak valid'], 400);
    }

    $name_id = trim($data['name_id'] ?? ($data['name']['id'] ?? ''));
    $name_en = trim($data['name_en'] ?? ($data['name']['en'] ?? $name_id));
    $url     = trim($data['url'] ?? '');
    $shot    = trim($data['shot'] ?? '');
    $tags    = is_array($data['tags'] ?? null) ? json_encode($data['tags'], JSON_UNESCAPED_UNICODE) : json_encode([], JSON_UNESCAPED_UNICODE);
    $desc_id = trim($data['desc_id'] ?? ($data['desc']['id'] ?? ''));
    $desc_en = trim($data['desc_en'] ?? ($data['desc']['en'] ?? $desc_id));
    $is_active = isset($data['is_active']) ? (int)$data['is_active'] : 1;

    $stmt = $pdo->prepare("UPDATE templates SET name_id = ?, name_en = ?, url = ?, shot = ?, tags = ?, desc_id = ?, desc_en = ?, is_active = ? WHERE id = ?");
    $stmt->execute([$name_id, $name_en, $url ?: null, $shot ?: null, $tags, $desc_id, $desc_en, $is_active, $id]);

    json_response(['status' => 'success', 'message' => 'Template berhasil diperbarui']);
}

function handle_delete($pdo) {
    $id = (int)($_GET['id'] ?? get_json_input()['id'] ?? 0);
    if (!$id) {
        json_response(['status' => 'error', 'message' => 'ID template tidak valid'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM templates WHERE id = ?");
    $stmt->execute([$id]);

    json_response(['status' => 'success', 'message' => 'Template berhasil dihapus']);
}
