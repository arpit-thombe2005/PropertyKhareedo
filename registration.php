<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
error_log("Received data: " . print_r($data, true));


if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

$fname = trim($data['fname'] ?? '');
$mname = trim($data['mname'] ?? '');
$lname = trim($data['lname'] ?? '');
$email = trim($data['email'] ?? '');
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';
$gender = trim($data['gender'] ?? '');
$phone = trim($data['phone'] ?? '');
$altPhone = trim($data['altPhone'] ?? '');

if (!$email || !$username || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Email, username, and password are required']);
    exit;
}

// Password hashing for security
$password_hash = password_hash($password, PASSWORD_BCRYPT);

try {
    // Check if email already exists (prepare statement)
    $sqlCheck = "SELECT COUNT(*) AS count FROM users WHERE email = ?";
    $paramsCheck = [$email];
    $stmtCheck = sqlsrv_query($conn, $sqlCheck, $paramsCheck);
    if ($stmtCheck === false) {
        throw new Exception(print_r(sqlsrv_errors(), true));
    }
    $row = sqlsrv_fetch_array($stmtCheck, SQLSRV_FETCH_ASSOC);
    if ($row['count'] > 0) {
        http_response_code(409);
        echo json_encode(['error' => 'Email already exists']);
        exit;
    }

    $sqlInsert = "INSERT INTO users (Fname, Mname, Lname, email, username, password_hash, gender, phone, altPhone) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $paramsInsert = [$fname, $mname, $lname, $email, $username, $password_hash, $gender, $phone, $altPhone];

    $stmtInsert = sqlsrv_query($conn, $sqlInsert, $paramsInsert);
    if ($stmtInsert === false) {
    $sqlErrs = print_r(sqlsrv_errors(), true);
    error_log("SQL ERROR: " . $sqlErrs);
    http_response_code(500);
    echo json_encode(['error' => 'Database error', 'details' => $sqlErrs]);
    exit;
}

    echo json_encode(['message' => 'Registration successful']);
    exit();
} catch (Exception $ex) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error', 'details' => $ex->getMessage()]);
}
?>
