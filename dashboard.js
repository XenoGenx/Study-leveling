/* ========================================
   STUDY GATE SYSTEM - DASHBOARD SCRIPT
   ======================================== */

let currentPlayer = null;
let selectedChapter = null;

// โหลดข้อมูลผู้ใช้เมื่อเข้าหน้า
window.addEventListener('load', () => {
    loadDashboard();
});

function loadDashboard() {
    const playerName = localStorage.getItem('currentPlayer');
    if (!playerName) {
        window.location.href = 'index.html';
        return;
    }

    const players = JSON.parse(localStorage.getItem('players')) || {};
    currentPlayer = players[playerName];

    if (!currentPlayer) {
        window.location.href = 'index.html';
        return;
    }

    updateDashboardDisplay();
}

function updateDashboardDisplay() {
    // Update Player Title
    document.getElementById('playerTitle').textContent = currentPlayer.name;
    
    // Update Rank & Badge
    document.getElementById('rankDisplay').textContent = currentPlayer.rank + ' Rank';
    
    // Update Level & Quests
    document.getElementById('levelDisplay').textContent = currentPlayer.level;
    document.getElementById('questsDisplay').textContent = currentPlayer.questsCompleted;

    // Update EXP
    const nextLevelExp = currentPlayer.level * 300;
    const currentExp = currentPlayer.exp % nextLevelExp;
    const expPercent = (currentExp / nextLevelExp) * 100;
    
    document.getElementById('expText').textContent = `${currentExp}/${nextLevelExp}`;
    document.getElementById('expFill').style.width = expPercent + '%';

    // Update Status
    updateStatusBars();

    // Update Badges
    updateBadgesDisplay();

    // Update Quest Status
    updateQuestStatus();
}

function updateStatusBars() {
    const stats = ['focus', 'memory', 'understanding', 'accuracy', 'mastery'];
    const maxStat = 50;

    stats.forEach(stat => {
        const value = currentPlayer[stat] || 10;
        const percent = (value / maxStat) * 100;
        
        const barId = stat.charAt(0).toUpperCase() + stat.slice(1);
        document.getElementById(stat + 'Bar').style.setProperty('--value', percent + '%');
        document.getElementById(stat + 'Value').textContent = Math.floor(value);
    });
}

function updateBadgesDisplay() {
    const container = document.getElementById('badgeContainer');
    
    if (currentPlayer.badges && currentPlayer.badges.length > 0) {
        container.innerHTML = currentPlayer.badges.map(badge => 
            `<div class="badge-item" title="${badge}">🏆 ${badge}</div>`
        ).join('');
    } else {
        container.innerHTML = '<div class="badge-empty">ยังไม่มีรางวัล</div>';
    }
}

function updateQuestStatus() {
    const chapters = ['respiratory', 'chemical', 'probability', 'vocabulary'];
    chapters.forEach(chapter => {
        const mastery = currentPlayer.chapterMastery[chapter] || 0;
        const statusEl = document.getElementById(`quest-${chapter}-status`);
        
        if (mastery === 0) {
            statusEl.textContent = 'Not Cleared';
            statusEl.className = 'quest-status status-not-cleared';
        } else if (mastery < 40) {
            statusEl.textContent = 'Basic';
            statusEl.className = 'quest-status status-basic';
        } else if (mastery < 60) {
            statusEl.textContent = 'Skilled';
            statusEl.className = 'quest-status status-skilled';
        } else if (mastery < 80) {
            statusEl.textContent = 'Mastered';
            statusEl.className = 'quest-status status-mastered';
        } else {
            statusEl.textContent = 'Perfect Clear';
            statusEl.className = 'quest-status status-perfect';
        }
    });
}

// Quest Selection
document.querySelectorAll('.quest-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.quest-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        
        selectedChapter = this.dataset.chapter;
        document.getElementById('selectedQuestName').textContent = this.querySelector('h3').textContent;
        document.getElementById('selectedQuestDisplay').style.display = 'block';
        document.getElementById('startQuestBtn').disabled = false;
    });
});

// Start Quest Button
document.getElementById('startQuestBtn').addEventListener('click', () => {
    if (!selectedChapter) {
        alert('กรุณาเลือกเควสก่อน');
        return;
    }

    // บันทึก chapter ที่เลือก
    localStorage.setItem('currentChapter', selectedChapter);
    window.location.href = 'timer.html';
});

// Logout Button
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentPlayer');
    window.location.href = 'index.html';
});

// Quest Log Button
document.getElementById('questLogBtn').addEventListener('click', () => {
    const history = currentPlayer.readingHistory || [];
    if (history.length === 0) {
        alert('ยังไม่มีประวัติการอ่าน');
        return;
    }

    let log = 'ประวัติการอ่าน:\n\n';
    history.slice(-5).reverse().forEach((record, idx) => {
        log += `${idx + 1}. ${record.chapter} - เวลา: ${record.readingTime} นาที (คะแนน: ${record.score}/10)\n`;
    });

    alert(log);
});
