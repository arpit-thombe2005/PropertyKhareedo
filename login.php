<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

header('Content-Type: application/json');
require 'db.php'; // Your DB connection (sqlsrv) config

// Read JSON body from request
$data = json_decode(file_get_contents('php://input'), true);

$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Username and password are required']);
    exit;
}

try {
    // Fetch user by username
    $sql = "SELECT id, username, password_hash FROM users WHERE username = ?";
    $params = [$username];
    $stmt = sqlsrv_query($conn, $sql, $params);

    if ($stmt === false) {
        throw new Exception(print_r(sqlsrv_errors(), true));
    }

    $user = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

    // Verify user exists and password is correct
    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid Username or password']);
        exit;
    }

    // Store user ID in session for later use in profile.php
    $_SESSION['user_id'] = $user['id'];


    // You can also return some basic info if needed
    echo json_encode([
        'message' => 'Login successful',
        'userId'  => $user['id'],
        'username'=> $user['username']
    ]);

} catch (Exception $ex) {
    http_response_code(500);
    echo json_encode([
        'error'   => 'Database error',
        'details' => $ex->getMessage()
    ]);
}
