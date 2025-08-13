<?php
// Enable full error reporting during development (disable on production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set JSON response header
header('Content-Type: application/json');

// Include your DB connection (adjust path as needed)
require_once __DIR__ . '/db.php';

// Check database connection
if (!isset($conn) || $conn === false) {
    $err = ['error' => 'Database connection not found'];
    file_put_contents(__DIR__ . '/debug_errors.log', json_encode($err) . PHP_EOL, FILE_APPEND);
    echo json_encode($err);
    exit;
}

// Helper function to sanitize and ensure UTF-8 encoding of strings
function clean_utf8_string($str) {
    if ($str === null) return '';
    // Ensure UTF-8 encoding, convert if necessary
    if (!mb_check_encoding($str, 'UTF-8')) {
        // Try guessing encoding with a list of possible encodings instead of 'auto'
        $encodings_to_try = ['UTF-8', 'ISO-8859-1', 'Windows-1252', 'ASCII'];
        $converted = false;
        foreach ($encodings_to_try as $enc) {
            $converted_str = @mb_convert_encoding($str, 'UTF-8', $enc);
            if ($converted_str !== false) {
                $str = $converted_str;
                $converted = true;
                break;
            }
        }
        if (!$converted) {
            // As a fallback, just remove invalid characters
            $str = mb_convert_encoding($str, 'UTF-8', 'UTF-8');
        }
    }
    // Remove control characters except \t, \n, \r
    $str = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $str);

    // Trim whitespace
    return trim($str);
}

// Retrieve and sanitize GET inputs
$city    = isset($_GET['city']) ? strtolower(trim($_GET['city'])) : '';
$p_type  = isset($_GET['p_type']) ? strtolower(trim($_GET['p_type'])) : '';
$minPrice = (isset($_GET['min_price']) && is_numeric($_GET['min_price'])) ? (int)$_GET['min_price'] : null;
$maxPrice = (isset($_GET['max_price']) && is_numeric($_GET['max_price'])) ? (int)$_GET['max_price'] : null;

// Set default price bounds if not provided
if ($minPrice === null) $minPrice = 0;
if ($maxPrice === null) $maxPrice = 1000000;

// Validate price range
if ($minPrice > $maxPrice) {
    $err = ['error' => 'Minimum price cannot be greater than maximum price'];
    file_put_contents(__DIR__ . '/debug_errors.log', json_encode($err) . PHP_EOL, FILE_APPEND);
    echo json_encode($err);
    exit;
}

// Start SQL query with p_address included (trim whitespace on p_status)
$sql = "SELECT city, p_type, p_name, price_lakhs, image_url, p_address, LOWER(LTRIM(RTRIM(p_status))) AS p_status FROM Properties WHERE 1=1";
$params = [];

// Add price filter
$sql .= " AND price_lakhs BETWEEN ? AND ?";
$params[] = $minPrice;
$params[] = $maxPrice;

// Property type filter if provided and not "all"
if (!empty($p_type) && $p_type !== 'all') {
    $sql .= " AND LOWER(p_type) = ?";
    $params[] = $p_type;
}

// City filter if provided and not "all"
if (!empty($city) && $city !== 'all') {
    $sql .= " AND LOWER(city) = ?";
    $params[] = $city;
}

// Log SQL and parameters for debug
file_put_contents(__DIR__ . '/debug_queries.log', $sql . " | Params: " . json_encode($params) . PHP_EOL, FILE_APPEND);

// Prepare statement
$stmt = sqlsrv_prepare($conn, $sql, $params);
if (!$stmt) {
    $err = [
        'error' => 'Failed to prepare statement',
        'details' => sqlsrv_errors()
    ];
    file_put_contents(__DIR__ . '/debug_errors.log', json_encode($err) . PHP_EOL, FILE_APPEND);
    echo json_encode($err);
    exit;
}

// Execute statement
if (!sqlsrv_execute($stmt)) {
    $err = [
        'error' => 'Failed to execute statement',
        'details' => sqlsrv_errors()
    ];
    file_put_contents(__DIR__ . '/debug_errors.log', json_encode($err) . PHP_EOL, FILE_APPEND);
    echo json_encode($err);
    exit;
}

// Fetch results
$properties = [];
while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    // Clean and encode p_address safely
    $cleanAddress = clean_utf8_string($row['p_address']);

    // Log each row (optional, comment out if too large)
    file_put_contents(__DIR__ . '/debug_data.log', print_r($row, true) . PHP_EOL, FILE_APPEND);

    $properties[] = [
        'city' => $row['city'],
        'p_type' => $row['p_type'],
        'p_name' => $row['p_name'],
        'p_address' => $cleanAddress,
        'price_lakhs' => $row['price_lakhs'],
        'image_url' => $row['image_url'] ?? null,
        'status' => !empty($row['p_status']) ? ucfirst(strtolower(trim($row['p_status']))) : 'Available',
    ];
}

// Free statement resource
sqlsrv_free_stmt($stmt);

// Encode response to JSON and check for encoding errors
$json = json_encode($properties);
if ($json === false) {
    $errorMsg = json_last_error_msg();
    $response = [
        'error' => 'JSON encoding error',
        'details' => $errorMsg,
        'data_sample' => array_slice($properties, 0, 1),
    ];
    file_put_contents(__DIR__ . '/debug_errors.log', json_encode($response) . PHP_EOL, FILE_APPEND);
    echo json_encode($response);
    exit;
}

// Output valid JSON response
echo $json;
