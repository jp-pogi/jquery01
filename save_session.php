<?php
header('Content-Type: application/json');

$dataFile = 'sessions.json';

// Create file if it doesn't exist
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([]));
}

// Get input data
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

// Validate data
if (empty($input['type']) || empty($input['duration']) || empty($input['completed_at'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid data']));
}

// Load existing sessions
$sessions = json_decode(file_get_contents($dataFile), true) ?: [];

// Add new session
$sessions[] = [
    'type' => $input['type'],
    'duration' => (int)$input['duration'],
    'completed_at' => $input['completed_at']
];

// Save back to file
if (file_put_contents($dataFile, json_encode($sessions))) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Could not save session']);
}
?>