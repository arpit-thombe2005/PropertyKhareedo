<?php
// db.php — Azure SQL DB connection via Microsoft Entra password auth

error_reporting(E_ALL);
ini_set('display_errors', 1);

$serverName = "propertykhareedobackup.database.windows.net";    // Your Azure SQL Server name
$database = "PropertyKhareedoBackup";                          // Your Azure SQL Database name
$aadUsername = "basil.shaikh@vit.edu.in";  // Your Azure AD User Principal Name (UPN)
$aadPassword = "Act786786";                  // Your Azure AD password


$connectionInfo = [
    "Database" => $database,
    "UID" => $aadUsername,
    "PWD" => $aadPassword,
    "Authentication" => "ActiveDirectoryPassword"
];

$conn = sqlsrv_connect($serverName, $connectionInfo);

if ($conn === false) {
        file_put_contents(__DIR__ . '/db_error.log', print_r(sqlsrv_errors(), true), FILE_APPEND);
    http_response_code(500);
    die(json_encode([
        'error' => 'Database connection failed',
        'details' => sqlsrv_errors()
    ]));
}
// Connection resource is $conn to be used in other scripts
?>
