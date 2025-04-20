<?php
header('Content-Type: application/json');

$dataFile = 'sessions.json';

try {
    // Verify file exists or create it
    if (!file_exists($dataFile)) {
        file_put_contents($dataFile, json_encode([]));
    }

    // Check if file is writable
    if (!is_writable($dataFile)) {
        throw new Exception('File is not writable');
    }

    // Clear the file contents
    if (file_put_contents($dataFile, json_encode([])) === false) {
        throw new Exception('Failed to write to file');
    }

    echo json_encode(['success' => true]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Could not clear history',
        'message' => $e->getMessage()
    ]);
}
?>