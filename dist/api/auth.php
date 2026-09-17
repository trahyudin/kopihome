<?php
/**
 * KOPIWEB - Admin Authentication API
 * POST ?action=login
 * POST ?action=logout
 * GET  ?action=check
 */

require_once __DIR__ . '/config.php';

$pdo = get_db_connection();
$action = $_GET['action'] ?? 'check';

switch ($action) {
    case 'login':
        handle_login($pdo);
        break;
    case 'logout':
        handle_logout();
        break;
    case 'check':
        handle_check();
        break;
    default:
        json_response(['status' => 'error', 'message' => 'Action tidak valid'], 400);
}

function handle_login($pdo) {
    $data = get_json_input();
    $username = trim($data['username'] ?? '');
    $password = trim($data['password'] ?? '');

    if ($username === '' || $password === '') {
        json_response(['status' => 'error', 'message' => 'Username dan password wajib diisi'], 422);
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        json_response(['status' => 'error', 'message' => 'Username atau password salah'], 401);
    }

    // Generate session token
    $token = bin2hex(random_bytes(32));
    $_SESSION['kopiweb_admin_id'] = $user['id'];
    $_SESSION['kopiweb_admin_user'] = $user['username'];
    $_SESSION['kopiweb_token'] = $token;

    json_response([
        'status' => 'success',
        'message' => 'Login berhasil',
        'data' => [
            'username' => $user['username'],
            'email'    => $user['email'],
            'token'    => $token
        ]
    ]);
}

function handle_logout() {
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();

    json_response([
        'status' => 'success',
        'message' => 'Logout berhasil'
    ]);
}

function handle_check() {
    if (is_admin_logged_in()) {
        json_response([
            'status' => 'success',
            'authenticated' => true,
            'user' => [
                'id' => $_SESSION['kopiweb_admin_id'] ?? null,
                'username' => $_SESSION['kopiweb_admin_user'] ?? 'admin'
            ]
        ]);
    } else {
        json_response([
            'status' => 'success',
            'authenticated' => false
        ]);
    }
}
