/* ========================================
   TIMER PAGE - FOCUS MODE
   Countdown timer with focus elimination
   ======================================== */

let timerInterval = null;
let timeRemaining = 0;
let totalTime = 0;
let isRunning = false;
let isPaused = false;
let startTime = 0;
let pausedTime = 0;

document.addEventListener('DOMContentLoaded', () => {
    initializeTimer();
    setupEventListeners();
});

/**
 * Initialize Timer
 */
function initializeTimer() {
    const questData = JSON.parse(sessionStorage.getItem('currentQuest'));
    
    if (!questData) {
        console.error('No quest data found');
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Set quest info
    const questName = document.getElementById('questName');
    const questDifficulty = document.getElementById('questDifficulty');
    
    if (questName) questName.textContent = questData.questName;
    if (questDifficulty) questDifficulty.textContent = questData.questDifficulty.toUpperCase();
    
    // Set timer
    totalTime = questData.questTime * 60; // Convert minutes to seconds
    timeRemaining = totalTime;
    
    updateTimerDisplay();
}

/**
 * Update Timer Display
 */
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const percent = ((totalTime - timeRemaining) / totalTime) * 100;
        progressFill.style.width = percent + '%';
    }
    
    // Color change when low time
    if (timeRemaining < 60 && timeRemaining > 0) {
        if (timerDisplay) timerDisplay.style.color = '#ff006e';
    }
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const finishBtn = document.getElementById('finishBtn');
    
    if (startBtn) startBtn.addEventListener('click', startTimer);
    if (pauseBtn) pauseBtn.addEventListener('click', togglePause);
    if (finishBtn) finishBtn.addEventListener('click', finishQuest);
}

/**
 * Start Timer
 */
function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    startTime = Date.now() - pausedTime;
    
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.textContent = 'PAUSE';
        startBtn.style.display = 'none';
    }
    
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) pauseBtn.style.display = 'inline-block';
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        // Play warning sound when 60 seconds left
        if (timeRemaining === 60) {
            playWarningSound();
        }
        
        // Timer finished
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            finishTimerAutomatically();
        }
    }, 1000);
}

/**
 * Toggle Pause/Resume
 */
function togglePause() {
    if (!isRunning) {
        startTimer();
        return;
    }
    
    const pauseBtn = document.getElementById('pauseBtn');
    
    if (isPaused) {
        // Resume
        isPaused = false;
        pausedTime = 0;
        startTimer();
        if (pauseBtn) pauseBtn.textContent = 'PAUSE';
    } else {
        // Pause
        isPaused = true;
        isRunning = false;
        clearInterval(timerInterval);
        pausedTime = Date.now() - startTime;
        if (pauseBtn) pauseBtn.textContent = 'RESUME';
    }
}

/**
 * Finish Quest
 */
function finishQuest() {
    clearInterval(timerInterval);
    
    const questData = JSON.parse(sessionStorage.getItem('currentQuest'));
    const actualReadingTime = totalTime - timeRemaining; // seconds
    const actualReadingMinutes = Math.ceil(actualReadingTime / 60);
    
    // Save reading time
    sessionStorage.setItem('readingTime', actualReadingMinutes);
    sessionStorage.setItem('readingSeconds', actualReadingTime);
    
    console.log(`✓ Quest finished! Reading time: ${actualReadingMinutes} minutes`);
    
    // Navigate to quiz
    setTimeout(() => {
        window.location.href = 'quiz.html';
    }, 500);
}

/**
 * Finish Timer Automatically
 */
function finishTimerAutomatically() {
    isRunning = false;
    
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.textContent = '00:00';
        timerDisplay.style.color = '#00ff64';
        timerDisplay.style.animation = 'glow 0.5s ease-out infinite';
    }
    
    const finishBtn = document.getElementById('finishBtn');
    if (finishBtn) {
        finishBtn.textContent = 'TIME COMPLETE! TAP TO CONTINUE';
        finishBtn.style.background = 'linear-gradient(135deg, #00ff64 0%, var(--cyan) 100%)';
        finishBtn.style.boxShadow = '0 0 30px rgba(0, 255, 100, 0.5)';
    }
    
    // Auto finish after 5 seconds
    setTimeout(() => {
        finishQuest();
    }, 5000);
}

/**
 * Play Warning Sound (Optional)
 */
function playWarningSound() {
    // Create beep sound using Web Audio API
    try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        
        oscillator.connect(gain);
        gain.connect(context.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gain.gain.setValueAtTime(0.3, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
        
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.5);
    } catch (e) {
        console.log('Audio not available');
    }
}

/**
 * DEBUG: Set test time
 */
function debugSetTestTime(minutes) {
    totalTime = minutes * 60;
    timeRemaining = totalTime;
    updateTimerDisplay();
    console.log(`✓ Test time set to ${minutes} minutes`);
}
