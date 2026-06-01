/* ========================================
   WELCOME PAGE - LOGIN & AUTHENTICATION
   ========================================*/

document.addEventListener('DOMContentLoaded', () => {
    // Initialize storage
    initializeStorage();
    
    const hunterNameInput = document.getElementById('hunterNameInput');
    const acceptQuestBtn = document.getElementById('acceptQuestBtn');
    const enterGateBtn = document.getElementById('enterGateBtn');
    const messageBox = document.getElementById('messageBox');
    const statusRank = document.getElementById('statusRank');
    const statusMsg = document.getElementById('statusMsg');
    const questAccess = document.getElementById('questAccess');
    
    // Set initial input focus z-index high
    hunterNameInput.style.position = 'relative';
    hunterNameInput.style.zIndex = '15';
    
    // Event Listeners
    hunterNameInput.addEventListener('input', updateStatusDisplay);
    hunterNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') enterGate();
    });
    acceptQuestBtn.addEventListener('click', enterGate);
    enterGateBtn.addEventListener('click', enterGate);
    
    /**
     * อัปเดตการแสดงสถานะเมื่อกรอกชื่อ
     */
    function updateStatusDisplay() {
        const hunterName = hunterNameInput.value.trim();
        
        if (hunterName.length === 0) {
            statusRank.textContent = 'Unregistered';
            statusMsg.textContent = 'Awaiting Awakening...';
            questAccess.textContent = 'Locked';
            messageBox.innerHTML = '';
            return;
        }
        
        // ✅ Synchronous access from localStorage
        const existingPlayer = getPlayerData(hunterName);
        
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
        const hunterName = hunterNameInput.value.trim();
        
        // Validation
        if (hunterName.length === 0) {
            showMessage('⚠️ กรุณาป้อนชื่อผู้ใช้', 'warning');
            return;
        }
        
        if (hunterName.length < 3) {
            showMessage('⚠️ ชื่อต้องไม่น้อยกว่า 3 ตัวอักษร', 'warning');
            return;
        }
        
        if (hunterName.length > 20) {
            showMessage('⚠️ ชื่อไม่ควรเกิน 20 ตัวอักษร', 'warning');
            return;
        }
        
        // Lock inputs
        hunterNameInput.disabled = true;
        acceptQuestBtn.disabled = true;
        enterGateBtn.disabled = true;
        
        // ล็อกอินด้วย localStorage
        registerAndLogin(hunterName)
            .then(() => {
                // ✅ Synchronous access from localStorage
                const existingPlayer = getPlayerData(hunterName);
                
                if (existingPlayer) {
                    // Welcome Back
                    showMessage(`✨ Welcome Back, ${hunterName}!`, 'welcome');
                    console.log(`🎯 ผู้ใช้เก่า: ${hunterName} (Rank ${existingPlayer.rank})`);
                } else {
                    // New Hunter Registered
                    showMessage(`🌟 New Hunter Registered: ${hunterName}`, 'welcome');
                    console.log(`✨ ผู้ใช้ใหม่: ${hunterName}`);
                    createNewPlayer(hunterName);
                }
                
                // Navigate after animation
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            })
            .catch(error => {
                showMessage(`❌ Error: ${error.message}`, 'error');
                hunterNameInput.disabled = false;
                acceptQuestBtn.disabled = false;
                enterGateBtn.disabled = false;
            });
    }
    
    /**
     * สร้างผู้ใช้ใหม่
     */
    function createNewPlayer(hunterName) {
        const newPlayer = {
            name: hunterName,
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
        
        // ✅ Synchronous save to localStorage
        savePlayerData(hunterName, newPlayer);
        localStorage.setItem('currentPlayer', hunterName);
        
        console.log('✓ ผู้ใช้ใหม่ถูกสร้างสำเร็จ:', newPlayer);
    }
    
    /**
     * เข้าสู่ระบบสำหรับผู้ใช้เก่า
     */
    function loginExistingPlayer(hunterName) {
        const player = getPlayerData(hunterName);
        
        if (player) {
            // อัปเดตวันที่เล่นครั้งสุดท้าย
            player.lastPlayedDate = new Date().toLocaleString('th-TH');
            
            // ✅ Synchronous save to localStorage
            savePlayerData(hunterName, player);
        }
        
        localStorage.setItem('currentPlayer', hunterName);
        console.log('✓ ผู้ใช้เข้าสู่ระบบสำเร็จ:', hunterName);
    }
    
    /**
     * แสดงข้อความ
     */
    function showMessage(message, type = 'info') {
        messageBox.textContent = message;
        messageBox.className = `alert-message ${type}`;
        messageBox.style.animation = 'messageSlide 0.5s ease-out';
    }
    
    /**
     * Initialize Storage
     */
    function initializeStorage() {
        if (!localStorage.getItem('players')) {
            localStorage.setItem('players', JSON.stringify({}));
        }
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
