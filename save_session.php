<?php
header('Content-Type: application/json');

$dataFile = 'sessions.json';

// Get input data
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

// Only save WORK sessions
if ($input['type'] !== 'work') {
    echo json_encode(['success' => true, 'message' => 'Break session not saved']);
    exit;
}

// Load existing sessions
$sessions = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];

// Add new session
$sessions[] = [
    'type' => 'work',
    'duration' => (int)$input['duration'],
    'completed_at' => $input['completed_at']
];

// Save back to file
file_put_contents($dataFile, json_encode($sessions));
echo json_encode(['success' => true]);
?>