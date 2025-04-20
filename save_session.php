<?php
header('Content-Type: application/json');

// Simple file-based storage (in a real app, use a database)
$dataFile = 'sessions.json';

// Get input data
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

// Validate data
if (empty($input['type']) || empty($input['duration']) || empty($input['completed_at'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid data']));
}

// Load existing sessions
$sessions = [];
if (file_exists($dataFile)) {
    $sessions = json_decode(file_get_contents($dataFile), true) ?: [];
}

// Add new session
$sessions[] = [
    'type' => $input['type'],
    'duration' => (int)$input['duration'],
    'completed_at' => $input['completed_at']
];

// Save back to file
file_put_contents($dataFile, json_encode($sessions));

echo json_encode(['success' => true]);
?>