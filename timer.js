/* ========================================
   TIMER - HOLOGRAM FOCUS MODE - OPTIMIZED
   Boot sequence + performance optimized countdown
   ======================================== */

let timerInterval = null;
let timeRemaining = 0;
let totalTime = 0;
let isRunning = false;
let isPaused = false;
let currentQuestData = {};
let messageUpdateTimer = null;
let lastUpdateTime = 0;

// Cache DOM elements for performance
let timerDisplay = null;
let sessionDisplay = null;
let progressDisplay = null;
let pauseBtn = null;
let resumeBtn = null;
let finishBtn = null;
let startBtn = null;
let focusStabilityBar = null;
let sessionProgressBar = null;
let mainContainer = null;
let messageBox = null;

// Motivational messages for focus
const motivationalMessages = [
    '> Stay focused, Hunter.',
    '> Your concentration is rising.',
    '> Every minute strengthens discipline.',
    '> Do not let the quest fail.',
    '> Knowledge is being accumulated.',
    '> Focus stability increased.',
    '> System monitoring: All optimal.',
    '> Warrior of knowledge detected.',
    '> Persistence breeds mastery.',
    '> The path to wisdom continues...',
];

document.addEventListener('DOMContentLoaded', () => {
    startBootSequence();
});

function startBootSequence() {
    const bootOverlay = document.getElementById('timerBootOverlay');
    
    // Boot sequence timing: 2.4 seconds total (same as dashboard)
    setTimeout(() => {
        if (bootOverlay) {
            bootOverlay.classList.add('hidden');
        }
        cacheElements();
        initializeTimer();
        setupTimerControls();
        startMotivationalMessages();
    }, 2400);
}

function cacheElements() {
    timerDisplay = document.getElementById('timerTimeDisplay');
    sessionDisplay = document.getElementById('sessionTimeDisplay');
    progressDisplay = document.getElementById('progressPercentageDisplay');
    pauseBtn = document.getElementById('pauseBtn');
    resumeBtn = document.getElementById('resumeBtn');
    finishBtn = document.getElementById('finishBtn');
    startBtn = document.getElementById('startBtn');
    focusStabilityBar = document.getElementById('focusStabilityBar');
    sessionProgressBar = document.getElementById('sessionProgressBar');
    mainContainer = document.querySelector('.timer-container-wrapper');
    messageBox = document.getElementById('systemMessageBox');
}

function initializeTimer() {
    const currentQuest = JSON.parse(sessionStorage.getItem('currentQuest')) || {};
    const currentPlayer = localStorage.getItem('currentPlayer');
    
    if (!currentQuest.questName || !currentPlayer) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Store quest data
    currentQuestData = currentQuest;
    
    // Get player data
    const players = JSON.parse(localStorage.getItem('players')) || {};
    const player = players[currentPlayer];
    
    // Display player info
    if (document.getElementById('hunterNameDisplay')) {
        document.getElementById('hunterNameDisplay').textContent = currentPlayer;
    }
    if (document.getElementById('hunterRankDisplay')) {
        document.getElementById('hunterRankDisplay').textContent = player.rank || 'E';
    }
    if (document.getElementById('hunterLevelDisplay')) {
        document.getElementById('hunterLevelDisplay').textContent = player.level || 1;
    }
    
    // Display quest info in center panel
    if (document.getElementById('questNameDisplay')) {
        document.getElementById('questNameDisplay').textContent = currentQuest.questName;
    }
    if (document.getElementById('difficultyBadgeDisplay')) {
        const difficulty = currentQuest.questDifficulty || 'normal';
        document.getElementById('difficultyBadgeDisplay').textContent = 
            difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    }
    
    // Convert minutes to seconds
    totalTime = currentQuest.questTime * 60;
    timeRemaining = totalTime;
    
    updateTimerDisplay();
    
    // Calculate reward estimate
    const difficulty = currentQuest.questDifficulty || 'normal';
    const difficultyMultiplier = { 'easy': 1, 'normal': 1.5, 'hard': 2, 'boss': 3 }[difficulty] || 1.5;
    const baseReward = 50;
    const estimatedReward = Math.round(baseReward * difficultyMultiplier);
    
    const rewardValue = document.getElementById('rewardValue');
    if (rewardValue) {
        rewardValue.textContent = estimatedReward + ' EXP';
    }
    
    console.log(`⏱️ Quest: ${currentQuest.questName} (${currentQuest.questTime}min)`);
}

function setupTimerControls() {
    // Setup Start button
    const startBtnElement = document.getElementById('startBtn');
    if (startBtnElement) {
        startBtnElement.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Start button clicked');
            startTimer();
            updateControlsVisibility();
        });
    }
    
    // Setup Pause button
    const pauseBtnElement = document.getElementById('pauseBtn');
    if (pauseBtnElement) {
        pauseBtnElement.addEventListener('click', togglePause);
    }
    
    // Setup Resume button
    const resumeBtnElement = document.getElementById('resumeBtn');
    if (resumeBtnElement) {
        resumeBtnElement.addEventListener('click', toggleResume);
    }
    
    // Setup Finish button
    const finishBtnElement = document.getElementById('finishBtn');
    if (finishBtnElement) {
        finishBtnElement.addEventListener('click', finishQuest);
    }
    
    // Update initial button visibility
    updateControlsVisibility();
    
    console.log('✅ Timer controls setup complete');
}

function updateTimerDisplay() {
    // Format time only once
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // Batch DOM updates - all at once
    if (timerDisplay) {
        timerDisplay.textContent = display;
    }
    
    // Update progress percentage only when needed (every few updates)
    if (progressDisplay) {
        const percentage = Math.round(((totalTime - timeRemaining) / totalTime) * 100);
        progressDisplay.textContent = percentage + '% Complete';
    }
    
    // Update session info
    if (sessionDisplay) {
        const totalTimeMin = Math.floor(totalTime / 60);
        const elapsedTimeMin = Math.floor((totalTime - timeRemaining) / 60);
        const elapsedTimeSec = (totalTime - timeRemaining) % 60;
        const sessionDisplay_text = `${String(elapsedTimeMin).padStart(2, '0')}:${String(elapsedTimeSec).padStart(2, '0')} / ${String(totalTimeMin).padStart(2, '0')}:00`;
        sessionDisplay.textContent = sessionDisplay_text;
    }
    
    // Update progress bars only once per update
    const progress = ((totalTime - timeRemaining) / totalTime) * 100;
    if (sessionProgressBar) {
        sessionProgressBar.style.width = Math.round(progress) + '%';
    }
    
    // Update focus stability based on pause state
    const focusStability = isPaused ? 70 : 100;
    if (focusStabilityBar) {
        focusStabilityBar.style.width = focusStability + '%';
    }
}

function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    isPaused = false;
    lastUpdateTime = Date.now();
    
    updateControlsVisibility();
    showSystemMessage('SYSTEM ACTIVATED');
    
    console.log('🟢 Timer started');
    
    // Use requestAnimationFrame for smooth updates
    function tick() {
        if (!isRunning) return;
        
        const now = Date.now();
        const elapsed = now - lastUpdateTime;
        
        if (elapsed >= 990) { // Update every ~1 second to avoid jitter
            if (!isPaused) {
                timeRemaining--;
                
                // Batch all DOM updates in one call
                updateTimerDisplay();
                
                // Play warning sound at 60s
                if (timeRemaining === 60) {
                    playWarningSound();
                    showSystemMessage('⚠️ ONE MINUTE REMAINING');
                }
                
                // Auto complete at 0
                if (timeRemaining <= 0) {
                    finishTimerAutomatically();
                    return;
                }
            }
            lastUpdateTime = now;
        }
        
        timerInterval = requestAnimationFrame(tick);
    }
    
    timerInterval = requestAnimationFrame(tick);
}

function togglePause() {
    if (!isRunning) return;
    
    isPaused = true;
    
    updateControlsVisibility();
    showSystemMessage('SYSTEM PAUSED');
    updateTimerDisplay(); // Update display immediately
    
    // Use CSS class instead of inline styles for better performance
    if (mainContainer) {
        mainContainer.classList.add('paused-state');
    }
    
    console.log('⏸️ Timer paused');
}

function toggleResume() {
    if (!isPaused || !isRunning) return;
    
    isPaused = false;
    
    updateControlsVisibility();
    showSystemMessage('SYSTEM REACTIVATED');
    updateTimerDisplay(); // Update display immediately
    
    // Remove pause state
    if (mainContainer) {
        mainContainer.classList.remove('paused-state');
    }
    
    console.log('▶️ Timer resumed');
}

function updateControlsVisibility() {
    if (isRunning && !isPaused) {
        // Timer running: show PAUSE and FINISH, hide RESUME and START
        if (pauseBtn) pauseBtn.classList.remove('hidden');
        if (resumeBtn) resumeBtn.classList.add('hidden');
        if (finishBtn) finishBtn.classList.remove('hidden');
        if (startBtn) startBtn.classList.add('hidden');
    } else if (isRunning && isPaused) {
        // Paused: show RESUME and FINISH, hide PAUSE and START
        if (pauseBtn) pauseBtn.classList.add('hidden');
        if (resumeBtn) resumeBtn.classList.remove('hidden');
        if (finishBtn) finishBtn.classList.remove('hidden');
        if (startBtn) startBtn.classList.add('hidden');
    } else {
        // Initial state: show START only
        if (pauseBtn) pauseBtn.classList.add('hidden');
        if (resumeBtn) resumeBtn.classList.add('hidden');
        if (finishBtn) finishBtn.classList.add('hidden');
        if (startBtn) startBtn.classList.remove('hidden');
    }
}

function finishQuest() {
    if (timerInterval) {
        cancelAnimationFrame(timerInterval);
    }
    isRunning = false;
    
    const actualReadingTime = Math.round((totalTime - timeRemaining) / 60);
    sessionStorage.setItem('readingTime', actualReadingTime);
    
    showQuestSaveOverlay();
    
    console.log(`✅ Quest finished! Reading time: ${actualReadingTime} min`);
    
    setTimeout(() => {
        window.location.href = 'quiz.html';
    }, 2000);
}

function finishTimerAutomatically() {
    if (timerInterval) {
        cancelAnimationFrame(timerInterval);
    }
    isRunning = false;
    
    sessionStorage.setItem('readingTime', Math.round(totalTime / 60));
    
    showSystemMessage('TIME\'S UP - EXCELLENT FOCUS');
    showQuestSaveOverlay();
    
    console.log('⏱️ Time\'s up! Auto-completing quest...');
    
    setTimeout(() => {
        window.location.href = 'quiz.html';
    }, 2000);
}

function showSystemMessage(message) {
    if (messageBox) {
        messageBox.textContent = '> ' + message;
        messageBox.classList.remove('pulse-message');
        // Trigger reflow to restart animation
        void messageBox.offsetWidth;
        messageBox.classList.add('pulse-message');
    }
}

function showQuestSaveOverlay() {
    const overlay = document.getElementById('questSaveOverlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}

function startMotivationalMessages() {
    // Show random motivational message every 40-80 seconds
    const showMessage = () => {
        const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        showSystemMessage(randomMessage.replace('> ', ''));
        
        const nextDelay = 40000 + Math.random() * 40000; // 40-80 seconds
        messageUpdateTimer = setTimeout(showMessage, nextDelay);
    };
    
    // Start after 5 seconds
    messageUpdateTimer = setTimeout(showMessage, 5000);
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
        
        console.log('🔊 Warning sound played');
    } catch (e) {
        console.log('⚠️ Audio unavailable');
    }
}
