$(document).ready(function() {
    // Timer variables
    let timer;
    let timeLeft = 25 * 60;
    let isRunning = false;
    let isWorkSession = true;
    let totalSessions = 0;
    
    // DOM elements
    const $timer = $('#timer');
    const $mode = $('#mode');
    const $startBtn = $('#startBtn');
    const $pauseBtn = $('#pauseBtn');
    const $resetBtn = $('#resetBtn');
    const $skipBtn = $('#skipBtn');
    const $progress = $('#progress');
    const $workDuration = $('#workDuration');
    const $breakDuration = $('#breakDuration');
    const $historyList = $('#historyList');
    const $clearHistoryBtn = $('#clearHistoryBtn');
    const $historyMessage = $('#historyMessage');
    
    // Initialize
    updateDisplay();
    loadHistory();
    
    // Event listeners
    $startBtn.click(startTimer);
    $pauseBtn.click(pauseTimer);
    $resetBtn.click(resetTimer);
    $skipBtn.click(skipSession);
    $clearHistoryBtn.click(clearHistory);
    
    $workDuration.change(updateSettings);
    $breakDuration.change(updateSettings);
    
    // Timer functions
    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            timer = setInterval(updateTimer, 1000);
            $startBtn.prop('disabled', true);
            $pauseBtn.prop('disabled', false);
            $resetBtn.prop('disabled', false);
        }
    }
    
    function pauseTimer() {
        if (isRunning) {
            clearInterval(timer);
            isRunning = false;
            $startBtn.prop('disabled', false);
            $pauseBtn.prop('disabled', true);
        }
    }
    
    function resetTimer() {
        pauseTimer();
        isWorkSession = true;
        timeLeft = getCurrentDuration() * 60;
        updateDisplay();
        $mode.text('Work Session');
    }
    
    function skipSession() {
        pauseTimer();
        switchSession();
    }
    
    function updateTimer() {
        timeLeft--;
        updateDisplay();
        
        const totalDuration = getCurrentDuration() * 60;
        const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
        $progress.css('width', progress + '%');
        
        if (timeLeft <= 0) {
            const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
            audio.play();
            switchSession();
        }
    }
    
    function switchSession() {
        isWorkSession = !isWorkSession;
        
        if (isWorkSession) {
            $mode.text('Work Session');
            timeLeft = getCurrentDuration() * 60;
        } else {
            $mode.text('Break Time');
            timeLeft = getCurrentDuration() * 60;
            totalSessions++;
            saveSession();
        }
        
        updateDisplay();
        $progress.css('width', '0%');
        
        if (isRunning) {
            setTimeout(startTimer, 1000);
        }
    }
    
    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        $timer.text(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }
    
    function getCurrentDuration() {
        return isWorkSession ? parseInt($workDuration.val()) : parseInt($breakDuration.val());
    }
    
    function updateSettings() {
        if (!isRunning) {
            resetTimer();
        }
    }
    
    // AJAX functions
    function saveSession() {
        const sessionData = {
            type: isWorkSession ? 'work' : 'break',
            duration: getCurrentDuration(),
            completed_at: new Date().toISOString()
        };
        
        $.ajax({
            url: 'save_session.php',
            type: 'POST',
            data: sessionData,
            success: function(response) {
                loadHistory();
            }
        });
    }
    
    function loadHistory() {
        $.ajax({
            url: 'get_history.php',
            type: 'GET',
            success: function(response) {
                displayHistory(response);
            },
            error: function() {
                displayHistory([]);
            }
        });
    }
    
    function displayHistory(sessions) {
        $historyList.empty();
        
        if (sessions && sessions.length > 0) {
            sessions.slice().reverse().forEach(session => {
                const date = new Date(session.completed_at);
                const li = $('<li>').html(`
                    <strong>${session.type === 'work' ? 'Work' : 'Break'}</strong> - 
                    ${session.duration} minutes - 
                    ${date.toLocaleDateString()} ${date.toLocaleTimeString()}
                `);
                $historyList.append(li);
            });
        } else {
            $historyList.append('<li>No sessions recorded yet</li>');
        }
    }
    
    function clearHistory() {
        if (confirm('Are you sure you want to clear all session history?')) {
            $clearHistoryBtn.prop('disabled', true).text('Clearing...');
            
            $.ajax({
                url: 'clear_history.php',
                type: 'POST',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        $historyList.empty().append('<li>No sessions recorded yet</li>');
                        showMessage('History cleared successfully!');
                    } else {
                        showMessage(response.message || 'Failed to clear history', true);
                    }
                },
                error: function(xhr) {
                    let errorMsg = 'Error clearing history';
                    try {
                        const response = JSON.parse(xhr.responseText);
                        errorMsg = response.message || errorMsg;
                    } catch (e) {}
                    showMessage(errorMsg, true);
                },
                complete: function() {
                    $clearHistoryBtn.prop('disabled', false).text('Clear History');
                }
            });
        }
    }
    
    function showMessage(text, isError = false) {
        $historyMessage
            .text(text)
            .css('color', isError ? '#f44336' : '#4CAF50')
            .fadeIn()
            .delay(2000)
            .fadeOut();
    }
});