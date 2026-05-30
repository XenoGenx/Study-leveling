/* ========================================
   STUDY GATE SYSTEM - TIMER PAGE SCRIPT
   ======================================== */

// Timer variables
let timeRemaining = 25 * 60; // 25 minutes in seconds
let initialTime = timeRemaining;
let timerInterval = null;
let isRunning = false;
let isPaused = false;
let currentPlayer = null;
let currentChapter = null;

// ตรวจสอบ Player และ Chapter
window.addEventListener('load', () => {
    const playerName = localStorage.getItem('currentPlayer');
    const chapter = localStorage.getItem('currentChapter');

    if (!playerName || !chapter) {
        window.location.href = 'dashboard.html';
        return;
    }

    const players = JSON.parse(localStorage.getItem('players')) || {};
    currentPlayer = players[playerName];
    currentChapter = chapter;

    if (!currentPlayer) {
        window.location.href = 'index.html';
        return;
    }

    // Update Display
    document.getElementById('playerName').textContent = currentPlayer.name;
    
    const chapterNames = {
        respiratory: 'ระบบหายใจ',
        chemical: 'พันธะเคมี',
        probability: 'ความน่าจะเป็น',
        vocabulary: 'Vocabulary'
    };

    document.getElementById('chapterTitle').textContent = chapterNames[chapter];
    document.getElementById('chapterName').textContent = chapterNames[chapter];

    updateTimerDisplay();
});

// Update Timer Display
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    document.getElementById('timerMinutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('timerSeconds').textContent = String(seconds).padStart(2, '0');

    // Update Progress Bar
    const progress = ((initialTime - timeRemaining) / initialTime) * 100;
    document.getElementById('readingProgress').style.width = progress + '%';

    // Update SVG Circle Progress
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (progress / 100) * circumference;
    document.getElementById('timerProgress').style.strokeDashoffset = offset;
}

// Start Button
document.getElementById('startBtn').addEventListener('click', () => {
    startTimer();
});

// Pause Button
document.getElementById('pauseBtn').addEventListener('click', () => {
    pauseTimer();
});

// Resume Button
document.getElementById('resumeBtn').addEventListener('click', () => {
    resumeTimer();
});

// Finish Button
document.getElementById('finishBtn').addEventListener('click', () => {
    finishReading();
});

// Back Button
document.getElementById('backBtn').addEventListener('click', () => {
    if (isRunning || isPaused) {
        if (confirm('คุณแน่ใจหรือว่าต้องการออกจากเควส? ความพยายามจะสูญหายไป')) {
            stopTimer();
            window.location.href = 'dashboard.html';
        }
    } else {
        window.location.href = 'dashboard.html';
    }
});

function startTimer() {
    if (isRunning) return;

    isRunning = true;
    isPaused = false;

    document.getElementById('startBtn').disabled = true;
    document.getElementById('pauseBtn').disabled = false;
    document.getElementById('finishBtn').disabled = false;
    document.getElementById('focusMode').textContent = 'ACTIVE 🔥';

    document.getElementById('statusText').textContent = 'Quest in Progress...';
    updateMotivation('reading');

    timerInterval = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            updateTimerDisplay();
        } else {
            completeTimer();
        }
    }, 1000);
}

function pauseTimer() {
    if (!isRunning) return;

    isRunning = false;
    isPaused = true;
    clearInterval(timerInterval);

    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('resumeBtn').style.display = 'block';
    document.getElementById('statusText').textContent = 'Paused...';
    document.getElementById('focusMode').textContent = 'PAUSED';

    updateMotivation('paused');
}

function resumeTimer() {
    if (!isPaused) return;

    isRunning = true;
    isPaused = false;

    document.getElementById('pauseBtn').style.display = 'block';
    document.getElementById('resumeBtn').style.display = 'none';
    document.getElementById('statusText').textContent = 'Quest Resumed...';
    document.getElementById('focusMode').textContent = 'ACTIVE 🔥';

    updateMotivation('reading');

    timerInterval = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            updateTimerDisplay();
        } else {
            completeTimer();
        }
    }, 1000);
}

function stopTimer() {
    isRunning = false;
    isPaused = false;
    clearInterval(timerInterval);
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('finishBtn').disabled = true;
    document.getElementById('focusMode').textContent = 'Inactive';
}

function completeTimer() {
    stopTimer();
    document.getElementById('statusText').textContent = '⏰ TIME\'S UP! ได้เวลาไปทำข้อสอบแล้ว';
    document.getElementById('finishBtn').textContent = 'GO TO QUIZ';
    document.getElementById('finishBtn').disabled = false;
    updateMotivation('complete');
}

function finishReading() {
    stopTimer();

    // คำนวณเวลาอ่านจริง
    const actualReadingTime = 25 - Math.ceil(timeRemaining / 60);
    
    // บันทึกข้อมูล
    localStorage.setItem('readingTime', actualReadingTime.toString());
    localStorage.setItem('sessionChapter', currentChapter);

    // ไปหน้า Quiz
    window.location.href = 'quiz.html';
}

function updateMotivation(stage) {
    const motivations = {
        reading: [
            '✨ Focus Mode Activated - Do not give up, Hunter!',
            '📚 ความสมาธิของคุณเพิ่มขึ้น',
            '🔥 ผู้ล่าที่แข็งแกร่ง ไม่ยอมแพ้ต่อความยากจน',
            '🎯 จิตใจของคุณดุจเพชร ล้นเหลือไปด้วยปณหา'
        ],
        paused: [
            '⏸️ พยายามต่อไป คุณใกล้ถึงเป้าหมายแล้ว',
            '💪 เพียงครู่หนึ่ง แล้วคุณจะกลับมาแข็งแกร่งขึ้น'
        ],
        complete: [
            '🎉 ยอดเยี่ยม! คุณสำเร็จแล้ว เตรียมพร้อมสำหรับคำถาม',
            '⚡ พลังแห่งความรู้พร้อมไหลเข้าสู่จิตใจของคุณ'
        ]
    };

    const msgs = motivations[stage] || motivations.reading;
    const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
    document.getElementById('motivationText').textContent = randomMsg;
}

// Auto-update timer display on load
updateTimerDisplay();
