/* ========================================
   STUDY GATE SYSTEM - RESULT PAGE SCRIPT
   ======================================== */

let currentPlayer = null;
let currentChapter = null;
let quizScore = 0;
let quizTotal = 10;
let quizPercentage = 0;
let readingTime = 0;

// โหลดข้อมูล
window.addEventListener('load', () => {
    const playerName = localStorage.getItem('currentPlayer');

    if (!playerName) {
        window.location.href = 'index.html';
        return;
    }

    const players = JSON.parse(localStorage.getItem('players')) || {};
    currentPlayer = players[playerName];
    currentChapter = localStorage.getItem('sessionChapter');

    if (!currentPlayer) {
        window.location.href = 'index.html';
        return;
    }

    // โหลดข้อมูลจากที่บันทึก
    quizScore = parseInt(localStorage.getItem('quizScore')) || 0;
    quizTotal = parseInt(localStorage.getItem('quizTotal')) || 10;
    quizPercentage = parseFloat(localStorage.getItem('quizPercentage')) || 0;
    readingTime = parseInt(localStorage.getItem('readingTime')) || 0;

    displayResults();
    calculateRewards();
    updatePlayerData();
});

function displayResults() {
    const chapterNames = {
        respiratory: 'ระบบหายใจ',
        chemical: 'พันธะเคมี',
        probability: 'ความน่าจะเป็น',
        vocabulary: 'Vocabulary'
    };

    document.getElementById('playerName').textContent = currentPlayer.name;
    document.getElementById('chapterName').textContent = chapterNames[currentChapter];
    document.getElementById('readingTime').textContent = readingTime + ' min';

    document.getElementById('scoreValue').textContent = quizScore;
    document.getElementById('scoreTotal').textContent = quizTotal;
    document.getElementById('percentageText').textContent = quizPercentage.toFixed(0) + '%';

    const scorePercent = (quizScore / quizTotal) * 100;
    document.getElementById('scoreFill').style.width = scorePercent + '%';
}

function calculateRewards() {
    // Base EXP จากการอ่านครบ
    let expGain = 50;

    // EXP เพิ่มจากคะแนนสอบ
    if (quizPercentage >= 80) expGain += 50;
    else if (quizPercentage >= 60) expGain += 30;
    else if (quizPercentage >= 40) expGain += 15;

    // EXP เพิ่มจากเวลา
    if (readingTime >= 25) expGain += 30;
    else if (readingTime >= 20) expGain += 20;

    // Status Changes
    let focusGain = Math.ceil(readingTime / 5);
    let memoryGain = Math.ceil((quizPercentage / 100) * 15);
    let understandingGain = Math.ceil((quizPercentage / 100) * 15);
    let accuracyGain = quizScore;
    let masteryGain = Math.ceil(quizPercentage / 10);

    // Mastery calculation
    const oldMastery = currentPlayer.chapterMastery[currentChapter] || 0;
    const newMastery = Math.min(100, oldMastery + masteryGain);

    // Display rewards
    document.getElementById('expAmount').textContent = expGain;
    document.getElementById('focusChange').textContent = '+' + focusGain;
    document.getElementById('memoryChange').textContent = '+' + memoryGain;
    document.getElementById('understandingChange').textContent = '+' + understandingGain;
    document.getElementById('accuracyChange').textContent = '+' + accuracyGain;
    document.getElementById('masteryChange').textContent = '+' + masteryGain;

    // Mastery display
    let masteryText = 'Not Cleared';
    if (newMastery >= 95) masteryText = 'Perfect Clear';
    else if (newMastery >= 80) masteryText = 'Mastered';
    else if (newMastery >= 60) masteryText = 'Skilled';
    else if (newMastery >= 40) masteryText = 'Basic';

    document.getElementById('masteryLevel').textContent = masteryText;
    document.getElementById('masteryPercent').textContent = newMastery + '%';
    document.getElementById('masteryBar').style.width = newMastery + '%';

    // บันทึกข้อมูลชั่วคราว
    localStorage.setItem('tempExpGain', expGain.toString());
    localStorage.setItem('tempFocusGain', focusGain.toString());
    localStorage.setItem('tempMemoryGain', memoryGain.toString());
    localStorage.setItem('tempUnderstandingGain', understandingGain.toString());
    localStorage.setItem('tempAccuracyGain', accuracyGain.toString());
    localStorage.setItem('tempMasteryGain', masteryGain.toString());
    localStorage.setItem('tempNewMastery', newMastery.toString());
    localStorage.setItem('tempOldMastery', oldMastery.toString());

    // Check for new badges and skills
    checkNewRewards(quizPercentage, readingTime, quizScore, quizTotal);

    // Set motivation message
    setMotivationMessage(quizPercentage, readingTime);
}

function checkNewRewards(percentage, time, score, total) {
    let newBadges = [];
    let newSkills = [];

    // Badge conditions
    if (!currentPlayer.badges.includes('First Clear') && currentPlayer.questsCompleted === 0) {
        newBadges.push('First Clear');
    }
    if (time >= 25 && !currentPlayer.badges.includes('Focus Hunter')) {
        newBadges.push('Focus Hunter');
    }
    if (percentage === 100 && !currentPlayer.badges.includes('Perfect Memory')) {
        newBadges.push('Perfect Memory');
    }

    // Skill conditions
    if (percentage >= 80 && !currentPlayer.skillCards.includes('Deep Focus')) {
        newSkills.push('Deep Focus');
    }
    if (percentage >= 90 && !currentPlayer.skillCards.includes('Knowledge Blade')) {
        newSkills.push('Knowledge Blade');
    }

    // Display new badges
    if (newBadges.length > 0) {
        document.getElementById('badgeSection').style.display = 'block';
        document.getElementById('newBadges').innerHTML = newBadges.map(b => 
            `<div class="new-badge">🏆 ${b}</div>`
        ).join('');
        localStorage.setItem('tempNewBadges', JSON.stringify(newBadges));
    }

    // Display new skills
    if (newSkills.length > 0) {
        document.getElementById('skillSection').style.display = 'block';
        document.getElementById('newSkills').innerHTML = newSkills.map(s => 
            `<div class="new-skill">✨ ${s}</div>`
        ).join('');
        localStorage.setItem('tempNewSkills', JSON.stringify(newSkills));
    }

    // Check rank up
    const oldExp = currentPlayer.exp;
    const tempExp = oldExp + parseInt(localStorage.getItem('tempExpGain') || 0);
    const oldRank = calculateRank(oldExp);
    const newRank = calculateRank(tempExp);
    
    if (newRank !== oldRank) {
        document.getElementById('rankUpSection').style.display = 'block';
        document.getElementById('oldRank').textContent = oldRank;
        document.getElementById('newRank').textContent = newRank;
        localStorage.setItem('tempRankUp', 'true');
    }
}

function calculateRank(exp) {
    if (exp >= 3000) return 'S';
    if (exp >= 2000) return 'A';
    if (exp >= 1200) return 'B';
    if (exp >= 700) return 'C';
    if (exp >= 300) return 'D';
    return 'E';
}

function setMotivationMessage(percentage, time) {
    let messages = [];

    if (percentage >= 80) {
        messages = [
            '✨ ยอดเยี่ยม Hunter! คุณเข้าใจบทเรียนนี้ในระดับสูงแล้ว',
            '🌟 ความพยายามของคุณเปลี่ยนเป็นพลัง ความรู้ของคุณแข็งแกร่งขึ้น',
            '⚡ Perfect Clear ใกล้แค่เอื้อม คุณกำลังพัฒนาเร็วมาก'
        ];
    } else if (percentage >= 60) {
        messages = [
            '💪 คุณทำได้ดีแล้ว เหลือเพียงทบทวนอีกเล็กน้อยก็จะชำนาญขึ้น',
            '🎯 ทุกเควสที่สำเร็จคือหลักฐานว่าคุณกำลังก้าวหน้า',
            '🔥 วันนี้คุณชนะความขี้เกียจได้แล้ว จงไปต่อ'
        ];
    } else {
        messages = [
            '🛡️ ไม่เป็นไร Hunter ความพ่ายแพ้ครั้งนี้คือข้อมูลสำหรับการกลับมาใหม่',
            '🌱 คะแนนยังไม่ใช่จุดจบ ลองทบทวนแล้วกลับมาท้าทายเควสนี้อีกครั้ง',
            '⭐ คุณยังได้รับ EXP จากความพยายาม และครั้งหน้าคุณจะแข็งแกร่งขึ้น'
        ];
    }

    if (time >= 25) {
        messages.push('🎖️ คุณอ่านครบตามเป้าหมายแล้ว วินัยของคุณเพิ่มขึ้น');
        messages.push('🧠 ภารกิจสำเร็จ สมาธิของคุณแข็งแกร่งกว่าก่อนเริ่มอ่าน');
    }

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    document.getElementById('motivationMsg').textContent = randomMsg;
}

function updatePlayerData() {
    const expGain = parseInt(localStorage.getItem('tempExpGain') || 0);
    const focusGain = parseInt(localStorage.getItem('tempFocusGain') || 0);
    const memoryGain = parseInt(localStorage.getItem('tempMemoryGain') || 0);
    const understandingGain = parseInt(localStorage.getItem('tempUnderstandingGain') || 0);
    const accuracyGain = parseInt(localStorage.getItem('tempAccuracyGain') || 0);
    const masteryGain = parseInt(localStorage.getItem('tempMasteryGain') || 0);
    const newMastery = parseInt(localStorage.getItem('tempNewMastery') || 0);
    const newBadges = JSON.parse(localStorage.getItem('tempNewBadges') || '[]');
    const newSkills = JSON.parse(localStorage.getItem('tempNewSkills') || '[]');

    // เก็บข้อมูลชั่วคราวไว้กด Claim
    localStorage.setItem('pendingUpdate', 'true');
}

// Claim Reward Button
document.getElementById('claimBtn').addEventListener('click', () => {
    const players = JSON.parse(localStorage.getItem('players')) || {};
    const expGain = parseInt(localStorage.getItem('tempExpGain') || 0);
    const focusGain = parseInt(localStorage.getItem('tempFocusGain') || 0);
    const memoryGain = parseInt(localStorage.getItem('tempMemoryGain') || 0);
    const understandingGain = parseInt(localStorage.getItem('tempUnderstandingGain') || 0);
    const accuracyGain = parseInt(localStorage.getItem('tempAccuracyGain') || 0);
    const masteryGain = parseInt(localStorage.getItem('tempMasteryGain') || 0);
    const newMastery = parseInt(localStorage.getItem('tempNewMastery') || 0);
    const newBadges = JSON.parse(localStorage.getItem('tempNewBadges') || '[]');
    const newSkills = JSON.parse(localStorage.getItem('tempNewSkills') || '[]');

    // อัปเดต EXP
    currentPlayer.exp += expGain;

    // อัปเดต Rank & Level
    currentPlayer.rank = calculateRank(currentPlayer.exp);
    currentPlayer.level = Math.floor(currentPlayer.exp / 300) + 1;

    // อัปเดต Status
    currentPlayer.focus += focusGain;
    currentPlayer.memory += memoryGain;
    currentPlayer.understanding += understandingGain;
    currentPlayer.accuracy += accuracyGain;
    currentPlayer.mastery += masteryGain;

    // อัปเดต Mastery
    currentPlayer.chapterMastery[currentChapter] = newMastery;

    // เพิ่ม Badge & Skills
    currentPlayer.badges = [...new Set([...currentPlayer.badges, ...newBadges])];
    currentPlayer.skillCards = [...new Set([...currentPlayer.skillCards, ...newSkills])];

    // บันทึก Reading History
    if (!currentPlayer.readingHistory) currentPlayer.readingHistory = [];
    currentPlayer.readingHistory.push({
        chapter: currentChapter,
        readingTime: readingTime,
        score: quizScore,
        date: new Date().toLocaleString('th-TH')
    });

    // เพิ่ม Quest Count
    currentPlayer.questsCompleted++;

    // บันทึก Players
    players[currentPlayer.name] = currentPlayer;
    localStorage.setItem('players', JSON.stringify(players));

    // ล้างข้อมูลชั่วคราว
    localStorage.removeItem('readingTime');
    localStorage.removeItem('sessionChapter');
    localStorage.removeItem('quizScore');
    localStorage.removeItem('quizTotal');
    localStorage.removeItem('quizPercentage');
    localStorage.removeItem('tempExpGain');
    localStorage.removeItem('tempFocusGain');
    localStorage.removeItem('tempMemoryGain');
    localStorage.removeItem('tempUnderstandingGain');
    localStorage.removeItem('tempAccuracyGain');
    localStorage.removeItem('tempMasteryGain');
    localStorage.removeItem('tempNewMastery');
    localStorage.removeItem('tempNewBadges');
    localStorage.removeItem('tempNewSkills');
    localStorage.removeItem('tempRankUp');
    localStorage.removeItem('pendingUpdate');

    alert('🎉 Rewards Claimed!');
    document.getElementById('claimBtn').disabled = true;
});

// Continue Button
document.getElementById('continueBtn').addEventListener('click', () => {
    window.location.href = 'dashboard.html';
});
