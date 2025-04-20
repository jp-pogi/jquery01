<?php
header('Content-Type: application/json');

$dataFile = 'sessions.json';

if (file_exists($dataFile)) {
    $sessions = json_decode(file_get_contents($dataFile), true) ?: [];
    echo json_encode($sessions);
} else {
    echo json_encode([]);
}
?>