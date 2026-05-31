/* ========================================
   TIMER - HOLOGRAM FOCUS MODE
   Boot sequence + 3-panel layout + motivational messages
   ======================================== */

let timerInterval = null;
let timeRemaining = 0;
let totalTime = 0;
let isRunning = false;
let isPaused = false;
let currentQuestData = {};
let messageUpdateTimer = null;

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
        initializeTimer();
        setupTimerControls();
        startMotivationalMessages();
    }, 2400);
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
    updateSessionInfo();
    updateRewardEstimate();
    
    console.log(`⏱️ Quest: ${currentQuest.questName} (${currentQuest.questTime}min)`);
}

function setupTimerControls() {
    const pauseBtn = document.getElementById('pauseBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    const finishBtn = document.getElementById('finishBtn');
    const startBtn = document.getElementById('startBtn');
    
    // Setup Start button
    if (startBtn) {
        startBtn.addEventListener('click', (e) => {
            e.preventDefault();
            startTimer();
            updateControlsVisibility();
        });
    }
    
    // Setup Pause button
    if (pauseBtn) {
        pauseBtn.addEventListener('click', togglePause);
    }
    
    // Setup Resume button
    if (resumeBtn) {
        resumeBtn.addEventListener('click', toggleResume);
    }
    
    // Setup Finish button
    if (finishBtn) {
        finishBtn.addEventListener('click', finishQuest);
    }
    
    // Update initial button visibility
    updateControlsVisibility();
    
    console.log('✅ Timer controls setup complete');
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    const timerElement = document.getElementById('timerTimeDisplay');
    if (timerElement) {
        timerElement.textContent = display;
        
        // Color transitions based on time
        if (timeRemaining > 60) {
            timerElement.classList.remove('time-warning', 'time-complete');
        } else if (timeRemaining > 0 && timeRemaining <= 60) {
            timerElement.classList.add('time-warning');
            timerElement.classList.remove('time-complete');
        } else if (timeRemaining === 0) {
            timerElement.classList.add('time-complete');
            timerElement.classList.remove('time-warning');
        }
    }
    
    // Update progress percentage
    const percentage = Math.round(((totalTime - timeRemaining) / totalTime) * 100);
    const progressEl = document.getElementById('progressPercentageDisplay');
    if (progressEl) {
        progressEl.textContent = percentage + '% Complete';
    }
}

function updateSessionInfo() {
    const totalTimeMin = Math.floor(totalTime / 60);
    const elapsedTimeMin = Math.floor((totalTime - timeRemaining) / 60);
    const elapsedTimeSec = (totalTime - timeRemaining) % 60;
    
    const display = `${String(elapsedTimeMin).padStart(2, '0')}:${String(elapsedTimeSec).padStart(2, '0')} / ${String(totalTimeMin).padStart(2, '0')}:00`;
    
    const sessionDisplay = document.getElementById('sessionTimeDisplay');
    if (sessionDisplay) {
        sessionDisplay.textContent = display;
    }
}

function updateProgressBars() {
    // Session progress bar
    const progress = ((totalTime - timeRemaining) / totalTime) * 100;
    const progressBar = document.getElementById('sessionProgressBar');
    const progressValue = document.getElementById('sessionProgressValue');
    if (progressBar) progressBar.style.width = progress + '%';
    if (progressValue) progressValue.textContent = Math.round(progress) + '%';
    
    // Focus stability (stays high if not paused)
    const focusStability = isPaused ? 70 : 100;
    const focusBar = document.getElementById('focusStabilityBar');
    const focusValue = document.getElementById('focusStabilityValue');
    if (focusBar) focusBar.style.width = focusStability + '%';
    if (focusValue) focusValue.textContent = focusStability + '%';
}

function updateRewardEstimate() {
    // Rough reward estimate based on difficulty
    const difficulty = currentQuestData.questDifficulty || 'normal';
    const difficultyMultiplier = { 'easy': 1, 'normal': 1.5, 'hard': 2, 'boss': 3 }[difficulty] || 1.5;
    const baseReward = 50;
    const estimatedReward = Math.round(baseReward * difficultyMultiplier);
    
    const rewardValue = document.getElementById('rewardValue');
    if (rewardValue) {
        rewardValue.textContent = estimatedReward + ' EXP';
    }
}

function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    isPaused = false;
    
    updateControlsVisibility();
    showSystemMessage('SYSTEM ACTIVATED');
    
    console.log('🟢 Timer started');
    
    timerInterval = setInterval(() => {
        if (!isPaused) {
            timeRemaining--;
            updateTimerDisplay();
            updateSessionInfo();
            updateProgressBars();
            
            // Play warning sound at 60s
            if (timeRemaining === 60) {
                playWarningSound();
                showSystemMessage('⚠️ ONE MINUTE REMAINING');
            }
            
            // Auto complete at 0
            if (timeRemaining <= 0) {
                finishTimerAutomatically();
            }
        }
    }, 1000);
}

function togglePause() {
    if (!isRunning) return;
    
    isPaused = true;
    // Don't clear interval - let it check isPaused flag
    
    updateControlsVisibility();
    showSystemMessage('SYSTEM PAUSED');
    
    // Show paused indicator
    const pausedIndicator = document.getElementById('pausedIndicator');
    if (pausedIndicator) {
        pausedIndicator.style.opacity = '1';
        setTimeout(() => {
            pausedIndicator.style.opacity = '0';
        }, 2000);
    }
    
    // Dim the main container
    const mainContainer = document.querySelector('.timer-main-container');
    if (mainContainer) {
        mainContainer.style.opacity = '0.7';
    }
    
    console.log('⏸️ Timer paused');
}

function toggleResume() {
    if (!isPaused || !isRunning) return;
    
    isPaused = false;
    
    updateControlsVisibility();
    showSystemMessage('SYSTEM REACTIVATED');
    
    // Restore opacity
    const mainContainer = document.querySelector('.timer-main-container');
    if (mainContainer) {
        mainContainer.style.opacity = '1';
    }
    
    console.log('▶️ Timer resumed');
    // Timer continues because isPaused is now false - interval will check it
}

function updateControlsVisibility() {
    const pauseBtn = document.getElementById('pauseBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    const finishBtn = document.getElementById('finishBtn');
    const startBtn = document.getElementById('startBtn');
    
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
    clearInterval(timerInterval);
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
    clearInterval(timerInterval);
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
    const messageBox = document.getElementById('systemMessageBox');
    if (messageBox) {
        messageBox.textContent = '> ' + message;
        messageBox.style.animation = 'none';
        setTimeout(() => {
            messageBox.style.animation = 'slideInRight 0.5s ease-out';
        }, 10);
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
