<?php
session_start();
header('Content-Type: application/json');
require 'db.php'; // Your SQLSRV DB connection file

// ✅ Correct PHPMailer namespace
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ✅ Include PHPMailer class files (adjust path if needed)
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

try {
    // Read & validate input
    $data = json_decode(file_get_contents('php://input'), true);
    $usernameOrEmail = trim($data['usernameOrEmail'] ?? '');

    if (!$usernameOrEmail) {
        http_response_code(400);
        echo json_encode(['error' => 'Please enter your username or email.']);
        exit;
    }

    // ✅ Fetch user from DB
    $sql = "SELECT id, email FROM users WHERE username = ? OR email = ?";
    $params = [$usernameOrEmail, $usernameOrEmail];
    $stmt = sqlsrv_query($conn, $sql, $params);

    if ($stmt === false) {
        throw new Exception('Database error: ' . print_r(sqlsrv_errors(), true));
    }

    $user = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

    if (!$user || empty($user['email'])) {
        http_response_code(404);
        echo json_encode(['error' => 'No user found with that username or email.']);
        exit;
    }

    // ✅ Generate reset token & expiry
    $token = bin2hex(random_bytes(24));
    $expiry = date('Y-m-d H:i:s', time() + 3600); // 1 hour from now

    // ✅ Save reset token & expiry to DB
    $updateSql = "UPDATE users SET reset_token = ?, reset_expiry = ? WHERE id = ?";
    $updateParams = [$token, $expiry, $user['id']];
    $updateStmt = sqlsrv_query($conn, $updateSql, $updateParams);

    if ($updateStmt === false) {
        throw new Exception('Database error (update): ' . print_r(sqlsrv_errors(), true));
    }

    // ✅ Create password reset link
    $resetUrl = 'http://localhost/PropertyKhareedo-master/homepage.html?token=' . urlencode($token);

    // ✅ PHPMailer setup
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'arpitthombe2005@gmail.com'; // Your Gmail
    $mail->Password   = 'cqar uvdz dbcd bmon';    // Gmail App Password, NOT your real email password
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;

    // ✅ Email headers & content
    $mail->setFrom('no-reply@propertykhareedo.com', 'PropertyKhareedo');
    $mail->addAddress($user['email']); // Send to user's email

    $mail->isHTML(true);
    $mail->Subject = 'Password Reset Request';
    $mail->Body    = "
        Hi,<br><br>
        You requested to reset your password. Click the link below to reset it:<br>
        <a href='$resetUrl'>$resetUrl</a>
        <br><br>This link will expire in 1 hour.
        <br><br>If you did not request this, you can ignore this email.
    ";
    $mail->AltBody = "Click the link to reset your password: $resetUrl (Expires in 1 hour)";

    // ✅ Send email
    $mail->send();

    echo json_encode(['message' => 'Reset link sent to your email.']);

} catch (Exception $ex) {
    http_response_code(500);
    // Log the actual error for debugging (don't show to user in production)
    error_log("Forgot password error: " . $ex->getMessage());
    echo json_encode(['error' => 'Server error. Please try again later.']);
}



