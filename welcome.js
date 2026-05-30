/* ========================================
   STUDY GATE SYSTEM - WELCOME PAGE SCRIPT
   ======================================== */

// ระบบเข้าเกม - ตรวจสอบชื่อผู้ใช้
document.getElementById('enterBtn').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value.trim();
    
    if (!playerName) {
        showMessage('กรุณาป้อนชื่อของคุณ', 'warning');
        return;
    }

    loginPlayer(playerName);
});

// ให้ Enter key ทำให้กดปุ่ม Enter
document.getElementById('playerName').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('enterBtn').click();
    }
});

function showMessage(text, type) {
    const msgBox = document.getElementById('messageBox');
    msgBox.textContent = text;
    msgBox.className = `message-box ${type}`;
    msgBox.style.display = 'block';
}

function loginPlayer(name) {
    const players = JSON.parse(localStorage.getItem('players')) || {};
    const isNewPlayer = !players[name];

    if (isNewPlayer) {
        // สร้างผู้ใช้ใหม่
        players[name] = {
            name: name,
            rank: 'E',
            level: 1,
            exp: 0,
            focus: 10,
            memory: 10,
            understanding: 10,
            accuracy: 10,
            mastery: 10,
            questsCompleted: 0,
            readingHistory: [],
            quizScores: [],
            badges: [],
            skillCards: [],
            studyStreak: 0,
            lastReadDate: null,
            chapterMastery: {}
        };
        
        localStorage.setItem('players', JSON.stringify(players));
        showMessage('✨ New Hunter Registered!', 'success');
    } else {
        showMessage(`✨ Welcome Back, Hunter ${name}!`, 'success');
    }

    // บันทึก current player
    localStorage.setItem('currentPlayer', name);

    // Redirect ไปหน้า dashboard หลังจาก 1 วินาที
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

// Load existing players ที่เลือกครั้งล่าสุด
window.addEventListener('load', () => {
    const lastPlayer = localStorage.getItem('currentPlayer');
    if (lastPlayer) {
        document.getElementById('playerName').value = lastPlayer;
        document.getElementById('statusRank').textContent = 'E - S';
        document.getElementById('statusMsg').textContent = 'Ready for new adventure...';
        document.getElementById('questAccess').textContent = 'Available';
    }
});
