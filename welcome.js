/* ========================================
   WELCOME PAGE - LOGIN & AUTHENTICATION
   ========================================*/

document.addEventListener('DOMContentLoaded', () => {
    // Initialize storage
    initializeStorage();
    
    const playerNameInput = document.getElementById('playerName');
    const enterBtn = document.getElementById('enterBtn');
    const messageBox = document.getElementById('messageBox');
    const statusRank = document.getElementById('statusRank');
    const statusMsg = document.getElementById('statusMsg');
    const questAccess = document.getElementById('questAccess');
    
    // Event Listeners
    playerNameInput.addEventListener('input', updateStatusDisplay);
    playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') enterGate();
    });
    enterBtn.addEventListener('click', enterGate);
    
    /**
     * อัปเดตการแสดงสถานะเมื่อกรอกชื่อ
     */
    function updateStatusDisplay() {
        const playerName = playerNameInput.value.trim();
        
        if (playerName.length === 0) {
            statusRank.textContent = 'Unregistered';
            statusMsg.textContent = 'Awaiting Awakening...';
            questAccess.textContent = 'Locked';
            messageBox.innerHTML = '';
            return;
        }
        
        const existingPlayer = getPlayerData(playerName);
        
        if (existingPlayer) {
            // ผู้ใช้เก่า
            statusRank.textContent = existingPlayer.rank;
            statusMsg.textContent = `Level ${existingPlayer.level}`;
            questAccess.textContent = `${existingPlayer.questsCompleted} Quest Cleared`;
        } else {
            // ผู้ใช้ใหม่
            statusRank.textContent = 'Rank E';
            statusMsg.textContent = 'Ready to Start';
            questAccess.textContent = 'Unlocked';
        }
    }
    
    /**
     * ยูซารเข้าสู่ระบบ
     */
    function enterGate() {
        const playerName = playerNameInput.value.trim();
        
        // Validation
        if (playerName.length === 0) {
            showMessage('⚠️ กรุณาป้อนชื่อผู้ใช้', 'warning');
            return;
        }
        
        if (playerName.length < 3) {
            showMessage('⚠️ ชื่อต้องไม่น้อยกว่า 3 ตัวอักษร', 'warning');
            return;
        }
        
        if (playerName.length > 20) {
            showMessage('⚠️ ชื่อไม่ควรเกิน 20 ตัวอักษร', 'warning');
            return;
        }
        
        // ตรวจสอบผู้ใช้เก่า/ใหม่
        const existingPlayer = getPlayerData(playerName);
        
        if (existingPlayer) {
            // Welcome Back
            showMessage(`✨ Welcome Back, ${playerName}!`, 'welcome');
            console.log(`🎯 ผู้ใช้เก่า: ${playerName} (Rank ${existingPlayer.rank})`);
            loginExistingPlayer(playerName);
        } else {
            // New Hunter Registered
            showMessage(`🌟 New Hunter Registered: ${playerName}`, 'welcome');
            console.log(`✨ ผู้ใช้ใหม่: ${playerName}`);
            createNewPlayer(playerName);
        }
        
        // Lock inputs
        playerNameInput.disabled = true;
        enterBtn.disabled = true;
        
        // Navigate after animation
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }
    
    /**
     * สร้างผู้ใช้ใหม่
     */
    function createNewPlayer(playerName) {
        const newPlayer = {
            name: playerName,
            rank: 'E',
            level: 1,
            exp: 0,
            focus: 0,
            memory: 0,
            understanding: 0,
            accuracy: 0,
            mastery: 0,
            questsCompleted: 0,
            readingHistory: [],
            quizScores: [],
            badges: [],
            skillCards: [],
            streak: 0,
            totalStudyTime: 0,
            dailyGoal: {
                readingTime: 100, // นาที
                questsToComplete: 1
            },
            createdDate: new Date().toLocaleString('th-TH'),
            lastPlayedDate: new Date().toLocaleString('th-TH')
        };
        
        // บันทึกลง localStorage
        savePlayerData(playerName, newPlayer);
        localStorage.setItem('currentPlayer', playerName);
        
        console.log('✓ ผู้ใช้ใหม่ถูกสร้างสำเร็จ:', newPlayer);
    }
    
    /**
     * เข้าสู่ระบบสำหรับผู้ใช้เก่า
     */
    function loginExistingPlayer(playerName) {
        const player = getPlayerData(playerName);
        
        // อัปเดตวันที่เล่นครั้งสุดท้าย
        player.lastPlayedDate = new Date().toLocaleString('th-TH');
        
        // บันทึกกลับลง localStorage
        savePlayerData(playerName, player);
        localStorage.setItem('currentPlayer', playerName);
        
        console.log('✓ ผู้ใช้เข้าสู่ระบบสำเร็จ:', playerName);
    }
    
    /**
     * แสดงข้อความ
     */
    function showMessage(message, type = 'info') {
        messageBox.textContent = message;
        messageBox.className = `message-box ${type}`;
        messageBox.style.animation = 'messageSlide 0.5s ease-out';
    }
});

// ========================================
// DEBUG & TESTING FUNCTIONS
// ========================================

/**
 * สร้างผู้ใช้ Test สำหรับพัฒนา
 */
function debugCreateWelcomeTestPlayer() {
    const testPlayer = {
        name: 'DemoHunter',
        rank: 'B',
        level: 12,
        exp: 1500,
        focus: 85,
        memory: 78,
        understanding: 92,
        accuracy: 88,
        mastery: 72,
        questsCompleted: 8,
        readingHistory: [
            { title: 'Chapter 1', time: 25, score: 85, date: '2026-05-30' },
            { title: 'Chapter 2', time: 25, score: 90, date: '2026-05-29' }
        ],
        badges: ['First Clear', 'Focus Hunter'],
        skillCards: ['Concentration Boost', 'Memory Spark'],
        streak: 5,
        totalStudyTime: 200,
        createdDate: '2026-05-20'
    };
    
    savePlayerData('DemoHunter', testPlayer);
    console.log('✓ ผู้ใช้ Test สร้างสำเร็จ:', testPlayer);
}

/**
 * ลบผู้ใช้ทั้งหมด
 */
function debugClearAllWelcome() {
    if (confirm('⚠️ แน่ใจว่าต้องการล้างข้อมูลทั้งหมด?')) {
        localStorage.removeItem('players');
        localStorage.removeItem('currentPlayer');
        location.reload();
    }
}
