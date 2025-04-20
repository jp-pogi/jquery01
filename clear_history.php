<?php
header('Content-Type: application/json');

$dataFile = 'sessions.json';

// Verify file exists and is writable
if (file_exists($dataFile) {
    if (is_writable($dataFile)) {
        if (file_put_contents($dataFile, json_encode([])) {
            echo json_encode(['success' => true]);
            exit;
        }
    }
}

// If we get here, something failed
http_response_code(500);
echo json_encode(['error' => 'Could not clear history']);
?>