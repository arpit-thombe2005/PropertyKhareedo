<?php
session_start();
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$token = trim($data['token'] ?? '');
$password = $data['password'] ?? '';

if (!$token || !$password) {
    http_response_code(400);
    echo json_encode(['error'=>'Missing token or password.']);
    exit;
}

// Find user by token and check expiry
$sql = "SELECT id, reset_expiry FROM users WHERE reset_token = ?";
$params = [$token];
$stmt = sqlsrv_query($conn, $sql, $params);
$user = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

if (!$user) {
    http_response_code(400);
    echo json_encode(['error'=>'Invalid or expired token.']);
    exit;
}
if ($user['reset_expiry'] instanceof DateTime) {
    $expiryTimestamp = $user['reset_expiry']->getTimestamp();
} else {
    // if it is string, convert normally
    $expiryTimestamp = strtotime($user['reset_expiry']);
}

if ($expiryTimestamp < time()) {
    http_response_code(400);
    echo json_encode(['error'=>'Reset link has expired. Please request again.']);
    exit;
}


// Hash new password and update user
$password_hash = password_hash($password, PASSWORD_DEFAULT);
$sql = "UPDATE users SET password_hash = ?, reset_token = NULL, reset_expiry = NULL WHERE id = ?";
$params = [$password_hash, $user['id']];
$res = sqlsrv_query($conn, $sql, $params);

if ($res === false) {
    http_response_code(500);
    echo json_encode(['error'=>'Database error.']);
    exit;
}

echo json_encode(['message' => 'Password has been reset successfully.']);
?>
