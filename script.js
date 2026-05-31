/* ========================================
   STUDY LEVELING - MAIN SCRIPT
   Shared functions and utilities
   ======================================== */

// ========================================
// INITIALIZATION & UTILITY FUNCTIONS
// ========================================

/**
 * ตรวจสอบและสร้างสต์ localStorage สำหรับเก็บข้อมูลผู้ใช้
 */
function initializeStorage() {
    if (!localStorage.getItem('players')) {
        localStorage.setItem('players', JSON.stringify({}));
    }
}

/**
 * โหลดข้อมูลผู้ใช้จาก localStorage
 * @param {string} playerName - ชื่อผู้ใช้
 * @returns {object} ข้อมูลผู้ใช้ หรือ null ถ้าไม่พบ
 */
function getPlayerData(playerName) {
    const players = JSON.parse(localStorage.getItem('players')) || {};
    return players[playerName] || null;
}

/**
 * บันทึกข้อมูลผู้ใช้ลง localStorage
 * @param {string} playerName - ชื่อผู้ใช้
 * @param {object} data - ข้อมูลผู้ใช้
 */
function savePlayerData(playerName, data) {
    const players = JSON.parse(localStorage.getItem('players')) || {};
    players[playerName] = data;
    localStorage.setItem('players', JSON.stringify(players));
}

/**
 * ลบข้อมูลผู้ใช้
 * @param {string} playerName - ชื่อผู้ใช้
 */
function deletePlayerData(playerName) {
    const players = JSON.parse(localStorage.getItem('players')) || {};
    delete players[playerName];
    localStorage.setItem('players', JSON.stringify(players));
}

/**
 * ดึงรายชื่อผู้ใช้ทั้งหมด
 * @returns {array} อาร์เรย์ชื่อผู้ใช้
 */
function getAllPlayers() {
    const players = JSON.parse(localStorage.getItem('players')) || {};
    return Object.keys(players);
}

// ========================================
// RANK CALCULATION FUNCTIONS
// ========================================

/**
 * คำนวณ Rank จาก EXP
 * @param {number} exp - ค่า EXP
 * @returns {string} Rank (E, D, C, B, A, S)
 */
function calculateRank(exp) {
    if (exp >= 3000) return 'S';
    if (exp >= 2000) return 'A';
    if (exp >= 1200) return 'B';
    if (exp >= 700) return 'C';
    if (exp >= 300) return 'D';
    return 'E';
}

/**
 * คำนวณ Level จาก EXP
 * @param {number} exp - ค่า EXP
 * @returns {number} Level
 */
function calculateLevel(exp) {
    return Math.floor(exp / 300) + 1;
}

/**
 * คำนวณ EXP ที่ต้องการสำหรับ Level ถัดไป
 * @param {number} currentLevel - Level ปัจจุบัน
 * @returns {number} EXP ที่ต้องการ
 */
function getNextLevelExp(currentLevel) {
    return currentLevel * 300;
}

// ========================================
// STATUS FUNCTIONS
// ========================================

/**
 * อัปเดต Status ของผู้ใช้
 * @param {object} player - ข้อมูลผู้ใช้
 * @param {object} statusChanges - การเปลี่ยนแปลง Status
 */
function updatePlayerStatus(player, statusChanges) {
    player.focus = Math.min(100, (player.focus || 10) + (statusChanges.focus || 0));
    player.memory = Math.min(100, (player.memory || 10) + (statusChanges.memory || 0));
    player.understanding = Math.min(100, (player.understanding || 10) + (statusChanges.understanding || 0));
    player.accuracy = Math.min(100, (player.accuracy || 10) + (statusChanges.accuracy || 0));
    player.mastery = Math.min(100, (player.mastery || 10) + (statusChanges.mastery || 0));
}

/**
 * คำนวณ Mastery Level จากเปอร์เซนต์
 * @param {number} percentage - เปอร์เซนต์ (0-100)
 * @returns {string} Mastery Level
 */
function getMasteryLevel(percentage) {
    if (percentage >= 95) return 'Perfect Clear';
    if (percentage >= 80) return 'Mastered';
    if (percentage >= 60) return 'Skilled';
    if (percentage >= 40) return 'Basic';
    return 'Not Cleared';
}

// ========================================
// BADGE & SKILL FUNCTIONS
// ========================================

/**
 * ตรวจสอบและอัปเดต Badge
 * @param {object} player - ข้อมูลผู้ใช้
 * @param {object} conditions - เงื่อนไขสำหรับ Badge
 * @returns {array} Badge ใหม่ที่ได้รับ
 */
function checkAndAwardBadges(player, conditions) {
    let newBadges = [];
    
    if (!player.badges) player.badges = [];

    // First Clear Badge
    if (conditions.isFirstClear && !player.badges.includes('First Clear')) {
        newBadges.push('First Clear');
    }

    // Focus Hunter Badge
    if (conditions.readingTime >= 25 && !player.badges.includes('Focus Hunter')) {
        newBadges.push('Focus Hunter');
    }

    // No Pause Badge
    if (conditions.noPause && !player.badges.includes('No Pause Clear')) {
        newBadges.push('No Pause Clear');
    }

    // Perfect Memory Badge
    if (conditions.perfectScore && !player.badges.includes('Perfect Memory')) {
        newBadges.push('Perfect Memory');
    }

    // Knowledge Seeker Badge
    if (conditions.totalQuests >= 5 && !player.badges.includes('Knowledge Seeker')) {
        newBadges.push('Knowledge Seeker');
    }

    // เพิ่ม Badge ใหม่
    player.badges = [...new Set([...player.badges, ...newBadges])];
    
    return newBadges;
}

/**
 * ตรวจสอบและอัปเดต Skill Card
 * @param {object} player - ข้อมูลผู้ใช้
 * @param {object} conditions - เงื่อนไขสำหรับ Skill Card
 * @returns {array} Skill Card ใหม่ที่ได้รับ
 */
function checkAndAwardSkills(player, conditions) {
    let newSkills = [];
    
    if (!player.skillCards) player.skillCards = [];

    // Concentration Boost
    if (conditions.streak >= 3 && !player.skillCards.includes('Concentration Boost')) {
        newSkills.push('Concentration Boost');
    }

    // Memory Spark
    if (conditions.quizPercentage >= 70 && !player.skillCards.includes('Memory Spark')) {
        newSkills.push('Memory Spark');
    }

    // Deep Focus
    if (conditions.quizPercentage >= 80 && !player.skillCards.includes('Deep Focus')) {
        newSkills.push('Deep Focus');
    }

    // Knowledge Blade
    if (conditions.quizPercentage >= 90 && !player.skillCards.includes('Knowledge Blade')) {
        newSkills.push('Knowledge Blade');
    }

    // Review Shield
    if (conditions.reviewBonus && !player.skillCards.includes('Review Shield')) {
        newSkills.push('Review Shield');
    }

    // เพิ่ม Skill Card ใหม่
    player.skillCards = [...new Set([...player.skillCards, ...newSkills])];
    
    return newSkills;
}

// ========================================
// REWARD CALCULATION FUNCTIONS
// ========================================

/**
 * คำนวณ EXP ที่ได้จากการทำเควส
 * @param {object} questData - ข้อมูลเควส
 * @returns {object} EXP breakdown
 */
function calculateQuestRewards(questData) {
    const {
        readingTime = 0,
        quizScore = 0,
        quizTotal = 10,
        noPause = false,
        isFirstClear = false
    } = questData;

    let expGain = 50; // Base EXP

    // EXP จากเวลาอ่าน
    if (readingTime >= 25) expGain += 30;
    else if (readingTime >= 20) expGain += 20;
    else if (readingTime >= 15) expGain += 10;

    // EXP จากคะแนนสอบ
    const percentage = (quizScore / quizTotal) * 100;
    if (percentage >= 90) expGain += 50;
    else if (percentage >= 80) expGain += 40;
    else if (percentage >= 70) expGain += 25;
    else if (percentage >= 60) expGain += 15;
    else if (percentage >= 40) expGain += 8;

    // Bonus EXP
    if (noPause) expGain += 15;
    if (isFirstClear) expGain += 25;

    return {
        total: expGain,
        base: 50,
        timeBonus: readingTime >= 25 ? 30 : (readingTime >= 20 ? 20 : 10),
        scoreBonus: Math.floor((percentage / 100) * 50),
        specialBonus: (noPause ? 15 : 0) + (isFirstClear ? 25 : 0)
    };
}

/**
 * คำนวณ Status Changes
 * @param {object} questData - ข้อมูลเควส
 * @returns {object} Status changes
 */
function calculateStatusChanges(questData) {
    const {
        readingTime = 0,
        quizScore = 0,
        quizTotal = 10,
        noPause = false
    } = questData;

    const percentage = (quizScore / quizTotal) * 100;

    return {
        focus: Math.ceil(readingTime / 5),
        memory: Math.ceil((percentage / 100) * 15),
        understanding: Math.ceil((percentage / 100) * 15),
        accuracy: quizScore,
        mastery: Math.ceil(percentage / 10),
        bonus: noPause ? 5 : 0
    };
}

// ========================================
// READING HISTORY & STATS FUNCTIONS
// ========================================

/**
 * เพิ่มบันทึกการอ่าน
 * @param {object} player - ข้อมูลผู้ใช้
 * @param {object} readingRecord - บันทึกการอ่าน
 */
function addReadingHistory(player, readingRecord) {
    if (!player.readingHistory) player.readingHistory = [];
    
    player.readingHistory.push({
        chapter: readingRecord.chapter,
        readingTime: readingRecord.readingTime,
        score: readingRecord.score,
        date: new Date().toLocaleString('th-TH'),
        percentage: readingRecord.percentage
    });

    // เก็บแต่ 20 บันทึกล่าสุด
    if (player.readingHistory.length > 20) {
        player.readingHistory = player.readingHistory.slice(-20);
    }
}

/**
 * ดึงสถิติผู้ใช้
 * @param {object} player - ข้อมูลผู้ใช้
 * @returns {object} สถิติ
 */
function getPlayerStats(player) {
    const history = player.readingHistory || [];
    
    return {
        totalSessions: history.length,
        averageReadTime: history.length > 0 
            ? Math.round(history.reduce((sum, h) => sum + h.readingTime, 0) / history.length)
            : 0,
        averageScore: history.length > 0
            ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length)
            : 0,
        bestScore: history.length > 0
            ? Math.max(...history.map(h => h.score))
            : 0,
        totalQuests: player.questsCompleted || 0,
        totalBadges: (player.badges || []).length,
        totalSkills: (player.skillCards || []).length
    };
}

// ========================================
// EXPORT / IMPORT DATA FUNCTIONS
// ========================================

/**
 * ส่งออกข้อมูลผู้ใช้ทั้งหมด (JSON)
 */
function exportAllPlayersData() {
    const players = JSON.parse(localStorage.getItem('players')) || {};
    const dataStr = JSON.stringify(players, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'study-gate-backup-' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
}

/**
 * นำเข้าข้อมูลผู้ใช้
 * @param {object} importedData - ข้อมูลที่นำเข้า
 */
function importPlayersData(importedData) {
    localStorage.setItem('players', JSON.stringify(importedData));
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * แปลงวินาทีเป็นรูปแบบ MM:SS
 * @param {number} seconds - จำนวนวินาที
 * @returns {string} รูปแบบ MM:SS
 */
function formatSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * สุ่มสายมีเสกจำนวนหนึ่ง
 * @param {array} array - อาร์เรย์
 * @param {number} count - จำนวน
 * @returns {array} สายมีเสกที่สุ่มมา
 */
function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

/**
 * ตรวจสอบชื่อผู้ใช้ว่าถูกต้องหรือไม่
 * @param {string} name - ชื่อผู้ใช้
 * @returns {boolean} ถูกต้อง/ไม่ถูกต้อง
 */
function isValidPlayerName(name) {
    if (!name || name.trim().length === 0) return false;
    if (name.length > 20) return false;
    return true;
}

/**
 * คำนวณ Study Streak
 * @param {object} player - ข้อมูลผู้ใช้
 * @returns {number} จำนวนวันติดต่อกัน
 */
function calculateStudyStreak(player) {
    const history = player.readingHistory || [];
    if (history.length === 0) return 0;

    let streak = 1;
    let lastDate = new Date(history[history.length - 1].date);

    for (let i = history.length - 2; i >= 0; i--) {
        const currentDate = new Date(history[i].date);
        const dayDiff = Math.floor((lastDate - currentDate) / (1000 * 60 * 60 * 24));

        if (dayDiff === 1) {
            streak++;
            lastDate = currentDate;
        } else {
            break;
        }
    }

    return streak;
}

// ========================================
// DEBUG FUNCTIONS (สำหรับพัฒนา)
// ========================================

/**
 * แสดงข้อมูลผู้ใช้ทั้งหมดใน Console
 */
function debugShowAllPlayers() {
    const players = JSON.parse(localStorage.getItem('players')) || {};
    console.log('=== ALL PLAYERS DATA ===');
    console.table(players);
}

/**
 * ล้างข้อมูลทั้งหมด
 */
function debugClearAllData() {
    if (confirm('⚠️ คุณแน่ใจหรือว่าต้องการล้างข้อมูลทั้งหมด? การกระทำนี้ไม่สามารถยกเลิกได้')) {
        localStorage.clear();
        alert('✓ ล้างข้อมูลทั้งหมดเรียบร้อย');
        location.reload();
    }
}

// ========================================
// QUEST & REWARD SYSTEM FUNCTIONS
// ========================================

/**
 * คำนวณ EXP จากเควส
 * @param {number} readingTime - เวลาอ่านจริงในหน่วยนาที
 * @param {number} targetTime - เวลาเป้าหมายในหน่วยนาที
 * @param {string} difficulty - ระดับความยาก (Easy, Normal, Hard, Boss)
 * @param {number} quizScore - คะแนน Quiz (0-100) หรือ 0 ถ้าไม่ทำ
 * @param {number} streak - Streak ปัจจุบัน
 * @returns {object} {baseExp, bonusExp, totalExp}
 */
function calculateQuestExp(readingTime, targetTime, difficulty, quizScore, streak) {
    // Base EXP = 50
    let baseExp = 50;
    
    // Difficulty Multiplier
    const difficultyMultiplier = {
        'easy': 0.8,
        'normal': 1,
        'hard': 1.5,
        'boss': 2
    };
    
    const multiplier = difficultyMultiplier[difficulty.toLowerCase()] || 1;
    baseExp *= multiplier;
    
    let bonusExp = 0;
    
    // Time Bonus (ถ้าอ่านครบเป้าหมาย)
    if (readingTime >= targetTime) {
        bonusExp += 30;
    } else if (readingTime >= targetTime * 0.8) {
        bonusExp += 20;
    } else if (readingTime >= targetTime * 0.6) {
        bonusExp += 10;
    }
    
    // Quiz Score Bonus
    if (quizScore > 0) {
        if (quizScore >= 90) bonusExp += 40;
        else if (quizScore >= 80) bonusExp += 30;
        else if (quizScore >= 70) bonusExp += 20;
        else if (quizScore >= 60) bonusExp += 15;
    }
    
    // Streak Bonus
    if (streak >= 7) bonusExp += 25;
    else if (streak >= 3) bonusExp += 15;
    
    const totalExp = baseExp + bonusExp;
    
    return {
        baseExp: Math.floor(baseExp),
        bonusExp: Math.floor(bonusExp),
        totalExp: Math.floor(totalExp)
    };
}

/**
 * ข้อความให้กำลังใจตามผลลัพธ์
 * @param {number} quizScore - คะแนน (0-100)
 * @param {number} readingTime - เวลาอ่าน (นาที)
 * @param {number} targetTime - เวลาเป้าหมาย (นาที)
 * @param {number} streak - Streak ปัจจุบัน
 * @returns {string} ข้อความให้กำลังใจ
 */
function getMotivationalMessage(quizScore, readingTime, targetTime, streak) {
    const messages = {
        // เมื่อ Score ต่ำ
        lowScore: [
            '💪 ไม่เป็นไร! ทุกครั้งเป็นการเรียนรู้ มาพยายามอีกครั้งเพื่อปรับปรุงตัวเอง',
            '🌟 คะแนนนี้แค่จุดเริ่มต้นของการเดินทางของเรา ยังมีช่องว่างที่จะพัฒนา',
            '⚡ อย่าท้อแท้! นักวิจัยยอดเยี่ยมทั้งหลายก็เคยผ่านช่วงเช่นนี้มา'
        ],
        // เมื่อ Score ปานกลาง
        mediumScore: [
            '👍 ไม่เลว! คุณอยู่บนเส้นทางที่ถูก เพียงแค่ต้องมีความต่อเนื่อง',
            '🎯 ดีจริง! ถ้าเพิ่มความเข้าใจเพียงเล็กน้อย คุณจะบรรลุเป้าหมาย',
            '✨ ความพยายามของคุณจะเห็นผล ค่อยๆ พัฒนาตัวเองให้ดีขึ้น'
        ],
        // เมื่อ Score ดี
        highScore: [
            '🏆 ยอดเยี่ยม! ความเข้าใจของคุณแยมมากขึ้นแต่ละครั้ง',
            '⭐ พerfect! คุณแสดงให้เห็นถึงจิตสำนึกที่แน่วแน่ ทำให้ได้คะแนนสูง',
            '🚀 เก่งมากๆ! ขยับสู่ระดับ Legend ของความเป็นนักเรียน'
        ],
        // เมื่อ Score Perfect
        perfectScore: [
            '👑 PERFECT! คุณเป็น Master ที่แท้จริงของหัวข้อนี้!',
            '🌠 ยอดเยี่ยมอย่างไม่มีที่สิ้นสุด! สูตรสำเร็จคือการศึกษาอย่างตั้งใจ',
            '💎 ระดับ S Rank! เทพสามารถเดินแบบนี้เช่นกัน!'
        ],
        // เมื่ออ่านครบเวลา
        focusedHunter: [
            '🎯 โฟกัสครบ! ความพยายามของคุณไม่สูญหาย',
            '💯 วินัยแบบนักสุดยอด! คุณเคารพเวลาที่ตั้งไว้',
            '🔥 Focus Meter ของคุณเต็มท้อม! ทำให้งานสำเร็จ'
        ],
        // เมื่อ Streak สูง
        streakKeeper: [
            `🔥 Streak ${streak} วัน! ความสม่ำเสมอคือกุญแจสู่ความสำเร็จ`,
            `⛓️ ใจดี ${streak} วันต่อเนื่อง! ห้ามหยุด ที่นี่เป็นจุดเริ่มต้น`,
            `✨ Combo ${streak} ครั้ง! คุณได้สร้างนิสัยที่ดีแล้ว`
        ]
    };
    
    let messageCategory = 'mediumScore';
    
    if (quizScore === 100) messageCategory = 'perfectScore';
    else if (quizScore >= 85) messageCategory = 'highScore';
    else if (quizScore >= 60) messageCategory = 'mediumScore';
    else if (quizScore > 0) messageCategory = 'lowScore';
    
    // เลือกข้อความแบบสุ่ม
    const categoryMessages = messages[messageCategory];
    const randomMessage = categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
    
    let finalMessage = randomMessage;
    
    // เพิ่มข้อความตามเวลาอ่าน
    if (readingTime >= targetTime) {
        const focusMessages = messages.focusedHunter;
        finalMessage += '\n\n' + focusMessages[Math.floor(Math.random() * focusMessages.length)];
    }
    
    // เพิ่มข้อความตาม Streak
    if (streak >= 3) {
        const streakMessages = messages.streakKeeper;
        finalMessage += '\n\n' + streakMessages[Math.floor(Math.random() * streakMessages.length)];
    }
    
    return finalMessage;
}

/**
 * ตรวจสอบ Badge ที่ปลดล็อก
 * @param {object} player - ข้อมูลผู้ใช้
 * @param {number} readingTime - เวลาอ่าน
 * @param {number} targetTime - เวลาเป้าหมาย
 * @param {number} quizScore - คะแนน
 * @param {number} streak - Streak ปัจจุบัน
 * @returns {array} อาร์เรย์ Badge ที่เพิ่งปลดล็อก
 */
function checkBadgeUnlock(player, readingTime, targetTime, quizScore, streak) {
    const newBadges = [];
    const existingBadges = player.badges || [];
    
    // First Clear - ทำเควสครั้งแรก
    if (player.questsCompleted === 1 && !existingBadges.includes('First Clear')) {
        newBadges.push({ id: 'first-clear', name: 'First Clear', icon: '🗝️' });
    }
    
    // Focus Hunter - อ่านครบเป้าหมายเวลา
    if (readingTime >= targetTime && !existingBadges.includes('Focus Hunter')) {
        newBadges.push({ id: 'focus-hunter', name: 'Focus Hunter', icon: '🎯' });
    }
    
    // Perfect Memory - ทำคะแนน 100%
    if (quizScore === 100 && !existingBadges.includes('Perfect Memory')) {
        newBadges.push({ id: 'perfect-memory', name: 'Perfect Memory', icon: '💯' });
    }
    
    // Streak Keeper - Streak 7 วัน
    if (streak >= 7 && !existingBadges.includes('Streak Keeper')) {
        newBadges.push({ id: 'streak-keeper', name: 'Streak Keeper', icon: '🔥' });
    }
    
    // Knowledge Seeker - ทำเควส 10 ครั้ง
    if (player.questsCompleted >= 10 && !existingBadges.includes('Knowledge Seeker')) {
        newBadges.push({ id: 'knowledge-seeker', name: 'Knowledge Seeker', icon: '📚' });
    }
    
    // Night Scholar - ทำเควสในเวลากลางคืน (22:00 - 06:00)
    const hour = new Date().getHours();
    if ((hour >= 22 || hour < 6) && !existingBadges.includes('Night Scholar')) {
        newBadges.push({ id: 'night-scholar', name: 'Night Scholar', icon: '🌙' });
    }
    
    return newBadges;
}

/**
 * ตรวจสอบ Skill Card ที่ปลดล็อก
 * @param {object} player - ข้อมูลผู้ใช้
 * @param {number} quizScore - คะแนน
 * @returns {array} อาร์เรย์ Skill Card ที่เพิ่งปลดล็อก
 */
function checkSkillUnlock(player, quizScore) {
    const newSkills = [];
    const existingSkills = player.skillCards || [];
    
    // Concentration Boost - Score 70%
    if (quizScore >= 70 && !existingSkills.includes('Concentration Boost')) {
        newSkills.push({ id: 'concentration', name: 'Concentration Boost', icon: '🧠' });
    }
    
    // Memory Spark - Score 80%
    if (quizScore >= 80 && !existingSkills.includes('Memory Spark')) {
        newSkills.push({ id: 'memory', name: 'Memory Spark', icon: '⚡' });
    }
    
    // Deep Focus - Score 85%
    if (quizScore >= 85 && !existingSkills.includes('Deep Focus')) {
        newSkills.push({ id: 'deep-focus', name: 'Deep Focus', icon: '🔮' });
    }
    
    // Knowledge Blade - Score 90%
    if (quizScore >= 90 && !existingSkills.includes('Knowledge Blade')) {
        newSkills.push({ id: 'knowledge-blade', name: 'Knowledge Blade', icon: '⚔️' });
    }
    
    // Review Shield - 5 เควสสำเร็จ
    if (player.questsCompleted >= 5 && !existingSkills.includes('Review Shield')) {
        newSkills.push({ id: 'review-shield', name: 'Review Shield', icon: '🛡️' });
    }
    
    return newSkills;
}

/**
 * ตรวจสอบการ Rank Up
 * @param {number} oldExp - EXP เดิม
 * @param {number} newExp - EXP ใหม่
 * @returns {object} {rankedUp: boolean, oldRank, newRank}
 */
function checkRankUp(oldExp, newExp) {
    const oldRank = calculateRank(oldExp);
    const newRank = calculateRank(newExp);
    
    return {
        rankedUp: oldRank !== newRank,
        oldRank,
        newRank,
        newRankName: getRankName(newRank)
    };
}

/**
 * ดึงชื่อ Rank แบบเต็ม
 * @param {string} rank - Rank (E, D, C, B, A, S)
 * @returns {string} ชื่อเต็ม
 */
function getRankName(rank) {
    const rankNames = {
        'E': 'Rank E - Novice',
        'D': 'Rank D - Apprentice',
        'C': 'Rank C - Warrior',
        'B': 'Rank B - Elite',
        'A': 'Rank A - Master',
        'S': 'Rank S - Legend'
    };
    return rankNames[rank] || 'Unknown';
}

/**
 * สร้างผู้ใช้ Test
 */
function debugCreateTestPlayer() {
    const testPlayer = {
        name: 'TestHunter',
        rank: 'D',
        level: 5,
        exp: 450,
        focus: 25,
        memory: 22,
        understanding: 28,
        accuracy: 20,
        mastery: 18,
        questsCompleted: 3,
        readingHistory: [
            {
                chapter: 'respiratory',
                readingTime: 25,
                score: 8,
                percentage: 80,
                date: new Date().toLocaleString('th-TH')
            }
        ],
        quizScores: [8, 7, 9],
        badges: ['First Clear', 'Focus Hunter'],
        skillCards: ['Deep Focus'],
        studyStreak: 3,
        lastReadDate: new Date().toLocaleString('th-TH'),
        chapterMastery: {
            respiratory: 65,
            chemical: 0,
            probability: 0,
            vocabulary: 45
        }
    };

    const players = JSON.parse(localStorage.getItem('players')) || {};
    players['TestHunter'] = testPlayer;
    localStorage.setItem('players', JSON.stringify(players));
    alert('✓ สร้างผู้ใช้ Test เรียบร้อย');
}

// ========================================
// INITIALIZATION
// ========================================

// เริ่มต้น Storage เมื่อ Script โหลด
document.addEventListener('DOMContentLoaded', () => {
    initializeStorage();
});

// ========================================
// NOTES FOR DEVELOPERS
// ========================================

/*
โครงสร้างข้อมูลผู้ใช้ (Player Object):
{
    name: string,              // ชื่อผู้ใช้
    rank: string,              // Rank (E, D, C, B, A, S)
    level: number,             // Level
    exp: number,               // Experience Points
    focus: number,             // Status: Focus (0-100)
    memory: number,            // Status: Memory (0-100)
    understanding: number,     // Status: Understanding (0-100)
    accuracy: number,          // Status: Accuracy (0-100)
    mastery: number,           // Status: Overall Mastery (0-100)
    questsCompleted: number,   // จำนวนเควสที่ทำสำเร็จ
    readingHistory: array,     // ประวัติการอ่าน
    quizScores: array,         // คะแนนสอบ
    badges: array,             // Badge ที่ได้รับ
    skillCards: array,         // Skill Card ที่ได้รับ
    studyStreak: number,       // จำนวนวันติดต่อกัน
    lastReadDate: string,      // วันอ่านครั้งล่าสุด
    chapterMastery: object     // Mastery ของแต่ละบท
}

localStorage keys ที่ใช้:
- players: JSON ของผู้ใช้ทั้งหมด
- currentPlayer: ชื่อผู้ใช้ปัจจุบัน
- currentChapter: บทที่เลือก
- sessionChapter: บทของ Session ปัจจุบัน
- readingTime: เวลาอ่าน (นาที)
- quizScore: คะแนนสอบ
- quizTotal: จำนวนข้อสอบทั้งหมด
- quizPercentage: เปอร์เซนต์คะแนน
*/
