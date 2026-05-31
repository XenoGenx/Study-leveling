/* ========================================
   ACHIEVEMENT & BADGE SYSTEM
   20 Unique Badges with Unlock Conditions
   ======================================== */

// ========================================
// BADGE DEFINITIONS
// ========================================

const BADGE_DEFINITIONS = {
    // 1. First Awakening
    'first-awakening': {
        id: 'first-awakening',
        name: 'First Awakening',
        description: 'จุดเริ่มต้นของ Hunter คนใหม่',
        rarity: 'common', // common, rare, epic, legendary
        icon: '🌅',
        color: '#64B5F6',
        condition: 'completeFirstQuest',
        conditionDescription: 'ทำเควสแรกสำเร็จ'
    },
    
    // 2. Egoist
    'egoist': {
        id: 'egoist',
        name: 'Egoist',
        description: 'ผู้ที่เลือกพัฒนาตัวเองเหนือข้ออ้าง',
        rarity: 'rare',
        icon: '💪',
        color: '#BB86FC',
        condition: 'totalStudyTime',
        conditionValue: 10, // in hours
        conditionDescription: 'อ่านรวมเกิน 10 ชั่วโมง'
    },
    
    // 3. Deep Focus
    'deep-focus': {
        id: 'deep-focus',
        name: 'Deep Focus',
        description: 'เข้าสู่โหมดสมาธิขั้นลึก',
        rarity: 'rare',
        icon: '🎯',
        color: '#BB86FC',
        condition: 'continuousReading',
        conditionValue: 60, // in minutes
        conditionDescription: 'อ่านต่อเนื่อง 60 นาทีโดยไม่หยุด'
    },
    
    // 4. No Exit
    'no-exit': {
        id: 'no-exit',
        name: 'No Exit',
        description: 'ไม่ถอย ไม่พัก จนกว่าจะจบภารกิจ',
        rarity: 'rare',
        icon: '🚫',
        color: '#BB86FC',
        condition: 'completeQuestNoPause',
        conditionDescription: 'อ่านครบเควสโดยไม่กด Pause'
    },
    
    // 5. Perfect Clear
    'perfect-clear': {
        id: 'perfect-clear',
        name: 'Perfect Clear',
        description: 'เคลียร์แบบไร้ข้อผิดพลาด',
        rarity: 'epic',
        icon: '✨',
        color: '#7C3AED',
        condition: 'perfectQuizScore',
        conditionValue: 100,
        conditionDescription: 'ทำ Quiz ได้ 100%'
    },
    
    // 6. Streak Demon
    'streak-demon': {
        id: 'streak-demon',
        name: 'Streak Demon',
        description: 'ปีศาจแห่งความสม่ำเสมอ',
        rarity: 'epic',
        icon: '👹',
        color: '#7C3AED',
        condition: 'studyStreak',
        conditionValue: 7, // days
        conditionDescription: 'อ่านต่อเนื่อง 7 วัน'
    },
    
    // 7. Boss Challenger
    'boss-challenger': {
        id: 'boss-challenger',
        name: 'Boss Challenger',
        description: 'กล้าท้าทายภารกิจระดับสูง',
        rarity: 'epic',
        icon: '👹',
        color: '#7C3AED',
        condition: 'completeBossQuest',
        conditionDescription: 'ทำเควสระดับ Boss สำเร็จ'
    },
    
    // 8. Rank Breaker
    'rank-breaker': {
        id: 'rank-breaker',
        name: 'Rank Breaker',
        description: 'ขีดจำกัดแรกถูกทำลาย',
        rarity: 'rare',
        icon: '💥',
        color: '#BB86FC',
        condition: 'firstRankUp',
        conditionDescription: 'Rank Up ครั้งแรก'
    },
    
    // 9. Still Standing
    'still-standing': {
        id: 'still-standing',
        name: 'Still Standing',
        description: 'ล้มได้ แต่ยังยืนขึ้นมาใหม่',
        rarity: 'rare',
        icon: '🛡️',
        color: '#BB86FC',
        condition: 'returnAfterBreak',
        conditionValue: 3, // days
        conditionDescription: 'กลับมาอ่านหลังจากหยุดไปหลายวัน'
    },
    
    // 10. Monarch of Study
    'monarch-of-study': {
        id: 'monarch-of-study',
        name: 'Monarch of Study',
        description: 'ผู้ปกครองสนามแห่งการเรียนรู้',
        rarity: 'legendary',
        icon: '👑',
        color: '#FFD700',
        condition: 'rankS',
        conditionDescription: 'ถึง Rank S'
    },
    
    // 11. Shadow Reader
    'shadow-reader': {
        id: 'shadow-reader',
        name: 'Shadow Reader',
        description: 'นักอ่านแห่งเงามืด',
        rarity: 'epic',
        icon: '🌙',
        color: '#7C3AED',
        condition: 'nightTimeReading',
        conditionValue: 10, // sessions at night
        conditionDescription: 'อ่านตอนกลางคืนครบ 10 ครั้ง'
    },
    
    // 12. Limit Breaker
    'limit-breaker': {
        id: 'limit-breaker',
        name: 'Limit Breaker',
        description: 'ทะลุขีดจำกัดของตัวเอง',
        rarity: 'epic',
        icon: '🔥',
        color: '#7C3AED',
        condition: 'exceedTimeGoal',
        conditionValue: 2, // 2x multiplier
        conditionDescription: 'อ่านเกินเป้าหมายเวลาที่ตั้งไว้ 2 เท่า'
    },
    
    // 13. Time Devourer
    'time-devourer': {
        id: 'time-devourer',
        name: 'Time Devourer',
        description: 'ผู้กลืนกินเวลาเพื่อเพิ่มพลังความรู้',
        rarity: 'epic',
        icon: '⏱️',
        color: '#7C3AED',
        condition: 'totalStudyTime',
        conditionValue: 30, // in hours
        conditionDescription: 'อ่านรวมเกิน 30 ชั่วโมง'
    },
    
    // 14. Void Focus
    'void-focus': {
        id: 'void-focus',
        name: 'Void Focus',
        description: 'สมาธิเข้าสู่ห้วงว่าง',
        rarity: 'legendary',
        icon: '🌌',
        color: '#FFD700',
        condition: 'continuousReading',
        conditionValue: 90, // in minutes
        conditionDescription: 'อ่าน 90 นาทีขึ้นไปในครั้งเดียว'
    },
    
    // 15. Egoist King
    'egoist-king': {
        id: 'egoist-king',
        name: 'Egoist King',
        description: 'ผู้เดินเส้นทางของตัวเองจนถึงจุดสูงสุด',
        rarity: 'legendary',
        icon: '♔',
        color: '#FFD700',
        condition: 'totalStudyTime',
        conditionValue: 50, // in hours
        conditionDescription: 'อ่านรวมเกิน 50 ชั่วโมง'
    },
    
    // 16. Comeback Brain
    'comeback-brain': {
        id: 'comeback-brain',
        name: 'Comeback Brain',
        description: 'เปลี่ยนความพลาดเป็นพลัง',
        rarity: 'epic',
        icon: '🧠',
        color: '#7C3AED',
        condition: 'comebackScore',
        conditionDescription: 'เคยได้คะแนน Quiz ต่ำกว่า 50% แล้วกลับมาทำได้เกิน 80%'
    },
    
    // 17. Knowledge Sniper
    'knowledge-sniper': {
        id: 'knowledge-sniper',
        name: 'Knowledge Sniper',
        description: 'แม่นยำเหมือนล็อกเป้า',
        rarity: 'rare',
        icon: '🎯',
        color: '#BB86FC',
        condition: 'consecutiveCorrect',
        conditionValue: 5, // correct answers in a row
        conditionDescription: 'ตอบ Quiz ถูก 5 ข้อติด'
    },
    
    // 18. Zero Excuse
    'zero-excuse': {
        id: 'zero-excuse',
        name: 'Zero Excuse',
        description: 'ไม่มีข้ออ้างใดหยุดได้',
        rarity: 'legendary',
        icon: '📅',
        color: '#FFD700',
        condition: 'studyStreak',
        conditionValue: 7, // consecutive days meeting goal
        conditionDescription: 'อ่านครบเป้าหมาย 7 วันติด'
    },
    
    // 19. Mind Forge
    'mind-forge': {
        id: 'mind-forge',
        name: 'Mind Forge',
        description: 'หลอมสมองด้วยการฝึกซ้ำ',
        rarity: 'rare',
        icon: '🔨',
        color: '#BB86FC',
        condition: 'reviewImprovement',
        conditionDescription: 'ทบทวนเควสเดิมซ้ำและทำคะแนนดีขึ้น'
    },
    
    // 20. Final Form
    'final-form': {
        id: 'final-form',
        name: 'Final Form',
        description: 'ร่างสมบูรณ์ของนักอ่าน',
        rarity: 'legendary',
        icon: '⭐',
        color: '#FFD700',
        condition: 'finalForm',
        conditionDescription: 'Rank S และ Mastery เฉลี่ยเกิน 90%'
    }
};

// ========================================
// ACHIEVEMENT UNLOCK LOGIC
// ========================================

/**
 * ตรวจสอบและปลดล็อก Achievement ใหม่
 * @param {object} player - ข้อมูลผู้ใช้
 * @param {object} questData - ข้อมูลเควส
 * @returns {array} Badge ใหม่ที่ปลดล็อก
 */
function checkAndUnlockAchievements(player, questData) {
    const newBadges = [];
    
    if (!player.unlockedBadges) {
        player.unlockedBadges = {};
    }
    
    // First Awakening - ทำเควสแรกสำเร็จ
    if (!player.unlockedBadges['first-awakening'] && (player.questsCompleted || 0) === 1) {
        newBadges.push('first-awakening');
        player.unlockedBadges['first-awakening'] = new Date().toISOString();
    }
    
    // Egoist - อ่านรวมเกิน 10 ชั่วโมง
    if (!player.unlockedBadges['egoist'] && (player.totalStudyTime || 0) >= 10) {
        newBadges.push('egoist');
        player.unlockedBadges['egoist'] = new Date().toISOString();
    }
    
    // Deep Focus - อ่านต่อเนื่อง 60 นาทีโดยไม่หยุด
    if (!player.unlockedBadges['deep-focus'] && questData.readingTime >= 60 && !questData.noPause) {
        newBadges.push('deep-focus');
        player.unlockedBadges['deep-focus'] = new Date().toISOString();
    }
    
    // No Exit - อ่านครบเควสโดยไม่กด Pause
    if (!player.unlockedBadges['no-exit'] && questData.noPause && questData.readingTime >= questData.questTime) {
        newBadges.push('no-exit');
        player.unlockedBadges['no-exit'] = new Date().toISOString();
    }
    
    // Perfect Clear - ทำ Quiz ได้ 100%
    if (!player.unlockedBadges['perfect-clear'] && questData.quizPercentage === 100) {
        newBadges.push('perfect-clear');
        player.unlockedBadges['perfect-clear'] = new Date().toISOString();
    }
    
    // Boss Challenger - ทำเควสระดับ Boss สำเร็จ
    if (!player.unlockedBadges['boss-challenger'] && questData.difficulty === 'boss') {
        newBadges.push('boss-challenger');
        player.unlockedBadges['boss-challenger'] = new Date().toISOString();
    }
    
    // Rank Breaker - Rank Up ครั้งแรก
    if (!player.unlockedBadges['rank-breaker'] && questData.isFirstRankUp) {
        newBadges.push('rank-breaker');
        player.unlockedBadges['rank-breaker'] = new Date().toISOString();
    }
    
    // Limit Breaker - อ่านเกินเป้าหมาย 2 เท่า
    if (!player.unlockedBadges['limit-breaker'] && questData.readingTime >= questData.questTime * 2) {
        newBadges.push('limit-breaker');
        player.unlockedBadges['limit-breaker'] = new Date().toISOString();
    }
    
    // Time Devourer - อ่านรวมเกิน 30 ชั่วโมง
    if (!player.unlockedBadges['time-devourer'] && (player.totalStudyTime || 0) >= 30) {
        newBadges.push('time-devourer');
        player.unlockedBadges['time-devourer'] = new Date().toISOString();
    }
    
    // Egoist King - อ่านรวมเกิน 50 ชั่วโมง
    if (!player.unlockedBadges['egoist-king'] && (player.totalStudyTime || 0) >= 50) {
        newBadges.push('egoist-king');
        player.unlockedBadges['egoist-king'] = new Date().toISOString();
    }
    
    // Knowledge Sniper - ตอบ Quiz ถูก 5 ข้อติด
    if (!player.unlockedBadges['knowledge-sniper'] && questData.consecutiveCorrect >= 5) {
        newBadges.push('knowledge-sniper');
        player.unlockedBadges['knowledge-sniper'] = new Date().toISOString();
    }
    
    // Mind Forge - ทบทวนเควสเดิมซ้ำและทำคะแนนดีขึ้น
    if (!player.unlockedBadges['mind-forge'] && questData.isReview && questData.improvedScore) {
        newBadges.push('mind-forge');
        player.unlockedBadges['mind-forge'] = new Date().toISOString();
    }
    
    // Monarch of Study - ถึง Rank S
    if (!player.unlockedBadges['monarch-of-study'] && player.rank === 'S') {
        newBadges.push('monarch-of-study');
        player.unlockedBadges['monarch-of-study'] = new Date().toISOString();
    }
    
    // Void Focus - อ่าน 90 นาทีขึ้นไปในครั้งเดียว
    if (!player.unlockedBadges['void-focus'] && questData.readingTime >= 90) {
        newBadges.push('void-focus');
        player.unlockedBadges['void-focus'] = new Date().toISOString();
    }
    
    // Final Form - Rank S และ Mastery เฉลี่ยเกิน 90%
    if (!player.unlockedBadges['final-form'] && player.rank === 'S' && calculateAverageMastery(player) >= 90) {
        newBadges.push('final-form');
        player.unlockedBadges['final-form'] = new Date().toISOString();
    }
    
    return newBadges;
}

/**
 * คำนวณ Average Mastery
 */
function calculateAverageMastery(player) {
    if (!player.readingHistory || player.readingHistory.length === 0) return 0;
    const sum = player.readingHistory.reduce((acc, h) => acc + (h.percentage || 0), 0);
    return Math.round(sum / player.readingHistory.length);
}

/**
 * สร้าง Popup Message สำหรับ Badge
 */
function createBadgePopupMessage(badgeId) {
    const badge = BADGE_DEFINITIONS[badgeId];
    if (!badge) return null;
    
    return {
        type: 'badge',
        title: 'ACHIEVEMENT UNLOCKED',
        badgeName: badge.name,
        description: badge.description,
        rarity: badge.rarity,
        icon: badge.icon,
        color: badge.color
    };
}
