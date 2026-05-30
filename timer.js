/* ========================================
   TIMER - QUEST IN PROGRESS
   Countdown timer with pause/resume
   ======================================== */

let timerInterval = null;
let timeRemaining = 0;
let totalTime = 0;
let isRunning = false;
let isPaused = false;

document.addEventListener('DOMContentLoaded', () => {
    initializeTimer();
    setupTimerControls();
});

function initializeTimer() {
    const currentQuest = JSON.parse(sessionStorage.getItem('currentQuest')) || {};
    
    if (!currentQuest.questName) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Set quest info
    const questNameEl = document.querySelector('.quest-name');
    if (questNameEl) questNameEl.textContent = currentQuest.questName;
    
    // Convert minutes to seconds
    totalTime = currentQuest.questTime * 60;
    timeRemaining = totalTime;
    
    updateTimerDisplay();
    console.log(`⏱️ Quest: ${currentQuest.questName} (${currentQuest.questTime}min)`);
}

function setupTimerControls() {
    const buttons = document.querySelectorAll('.btn-timer');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent.includes('START')) {
                startTimer();
            } else if (this.textContent.includes('PAUSE') || this.textContent.includes('RESUME')) {
                togglePause();
            } else if (this.textContent.includes('FINISH')) {
                finishQuest();
            }
        });
    });
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    const timerElement = document.querySelector('.timer-time');
    if (timerElement) {
        timerElement.textContent = display;
        
        // Change color when <60s
        if (timeRemaining < 60 && timeRemaining > 0) {
            timerElement.style.color = 'var(--neon-pink)';
            timerElement.style.textShadow = '0 0 20px rgba(255, 0, 102, 0.6)';
        }
    }
}

function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    isPaused = false;
    
    console.log('🟢 Timer started');
    
    timerInterval = setInterval(() => {
        if (!isPaused) {
            timeRemaining--;
            updateTimerDisplay();
            
            // Play warning sound at 60s
            if (timeRemaining === 60) {
                playWarningSound();
            }
            
            // Auto complete at 0
            if (timeRemaining <= 0) {
                finishTimerAutomatically();
            }
        }
    }, 1000);
    
    // Update button visibility
    updateTimerButtons();
}

function togglePause() {
    if (!isRunning) return;
    
    isPaused = !isPaused;
    console.log(isPaused ? '⏸️ Timer paused' : '▶️ Timer resumed');
    updateTimerButtons();
}

function finishQuest() {
    clearInterval(timerInterval);
    const actualReadingTime = Math.round((totalTime - timeRemaining) / 60);
    
    sessionStorage.setItem('readingTime', actualReadingTime);
    console.log(`✅ Quest finished! Reading time: ${actualReadingTime} min`);
    
    window.location.href = 'quiz.html';
}

function finishTimerAutomatically() {
    clearInterval(timerInterval);
    sessionStorage.setItem('readingTime', Math.round(totalTime / 60));
    
    console.log('⏱️ Time\'s up! Auto-completing quest...');
    
    const timerElement = document.querySelector('.timer-time');
    if (timerElement) {
        timerElement.textContent = '00:00';
        timerElement.style.color = 'var(--neon-green)';
        timerElement.style.textShadow = '0 0 20px rgba(0, 255, 153, 0.6)';
    }
    
    setTimeout(() => {
        window.location.href = 'quiz.html';
    }, 3000);
}

function playWarningSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('⚠️ Audio unavailable');
    }
}

function updateTimerButtons() {
    const buttons = document.querySelectorAll('.btn-timer');
    buttons.forEach(btn => {
        if (btn.textContent.includes('START')) {
            btn.style.display = isRunning ? 'none' : 'block';
        } else if (btn.textContent.includes('PAUSE') || btn.textContent.includes('RESUME')) {
            btn.style.display = isRunning ? 'block' : 'none';
            btn.textContent = isPaused ? 'RESUME READING' : 'PAUSE READING';
        }
    });
}
