<?php
header('Content-Type: application/json');

$dataFile = 'sessions.json';

// Get input data
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

// Only validate required fields
if (empty($input['duration']) || empty($input['completed_at'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Missing data']));
}

// Load existing sessions
$sessions = [];
if (file_exists($dataFile)) {
    $sessions = json_decode(file_get_contents($dataFile), true) ?: [];
}

// Add new session (now saving all sessions)
$sessions[] = [
    'type' => $input['type'] ?? 'work', // Default to work if not specified
    'duration' => (int)$input['duration'],
    'completed_at' => $input['completed_at']
];

// Save back to file
if (file_put_contents($dataFile, json_encode($sessions))) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Save failed']);
}
?>