/* ========================================
   RESULT - QUEST COMPLETE REWARDS
   Display quest completion rewards
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    displayResults();
    setupEventListeners();
});

function displayResults() {
    const currentPlayer = localStorage.getItem('currentPlayer');
    
    if (!currentPlayer) {
        window.location.href = 'index.html';
        return;
    }
    
    const player = getPlayerData(currentPlayer);
    const readingTime = parseInt(sessionStorage.getItem('readingTime')) || 0;
    const quizPercentage = parseInt(sessionStorage.getItem('quizPercentage')) || 0;
    const quizSkipped = sessionStorage.getItem('quizSkipped') === 'true';
    const questData = JSON.parse(sessionStorage.getItem('currentQuest')) || {};
    
    // Calculate rewards
    const rewards = calculateQuestExp(readingTime, questData.questTime, questData.questDifficulty, quizPercentage, player.streak || 0);
    const newBadges = checkBadgeUnlock(player, readingTime, questData.questTime, quizPercentage, player.streak || 0);
    const newSkills = checkSkillUnlock(player, quizPercentage);
    const rankUpInfo = checkRankUp(player.exp, player.exp + rewards.totalExp);
    
    // Store for claiming
    sessionStorage.setItem('pendingRewards', JSON.stringify({
        readingTime,
        questData,
        quizPercentage,
        rewards,
        newBadges,
        newSkills,
        rankUpInfo
    }));
    
    // Display results
    const container = document.getElementById('resultContainer');
    if (!container) return;
    
    let html = `
        <div class="reward-card">
            <div style="text-align: center; margin-bottom: 15px;">
                <h2 style="color: var(--neon-green); font-size: 1.5rem; margin-bottom: 10px;">${questData.questName}</h2>
                <p style="color: var(--neon-purple);">Difficulty: ${questData.questDifficulty.toUpperCase()}</p>
            </div>
            
            <div class="reward-item">
                <span class="reward-label">⏱️ Reading Time:</span>
                <span class="reward-value">${readingTime} / ${questData.questTime} min</span>
            </div>
            
            <div class="reward-item">
                <span class="reward-label">📊 Quiz Score:</span>
                <span class="reward-value">${quizSkipped ? 'SKIPPED' : quizPercentage + '%'}</span>
            </div>
        </div>
        
        <div class="reward-card">
            <h3 style="color: var(--neon-cyan); margin-bottom: 15px; font-size: 1.1rem;">🏆 REWARDS EARNED</h3>
            
            <div class="reward-item">
                <span class="reward-label">💰 Base EXP:</span>
                <span class="reward-value">+${rewards.baseExp}</span>
            </div>
            
            <div class="reward-item">
                <span class="reward-label">⭐ Bonus EXP:</span>
                <span class="reward-value" style="color: var(--neon-green);">+${rewards.bonusExp}</span>
            </div>
            
            <div class="reward-item" style="border-top: 2px solid rgba(0, 229, 255, 0.2); padding-top: 10px; margin-top: 10px;">
                <span class="reward-label">🎯 TOTAL EXP:</span>
                <span class="reward-value" style="font-size: 1.5rem; color: var(--neon-green);">+${rewards.totalExp}</span>
            </div>
        </div>
        
        <div class="reward-card">
            <h3 style="color: var(--neon-cyan); margin-bottom: 15px; font-size: 1.1rem;">📈 STATUS INCREASE</h3>
            
            <div class="reward-item">
                <span class="reward-label">🎯 Focus:</span>
                <span class="reward-value" style="color: var(--neon-green);">+${Math.ceil(readingTime / 5)}</span>
            </div>
            
            <div class="reward-item">
                <span class="reward-label">🧠 Memory:</span>
                <span class="reward-value" style="color: var(--neon-green);">+${Math.ceil(quizPercentage / 10)}</span>
            </div>
            
            <div class="reward-item">
                <span class="reward-label">📚 Understanding:</span>
                <span class="reward-value" style="color: var(--neon-green);">+${Math.ceil(quizPercentage / 8)}</span>
            </div>
            
            <div class="reward-item">
                <span class="reward-label">✅ Accuracy:</span>
                <span class="reward-value" style="color: var(--neon-green);">+${Math.ceil(quizPercentage / 12)}</span>
            </div>
            
            <div class="reward-item">
                <span class="reward-label">👑 Mastery:</span>
                <span class="reward-value" style="color: var(--neon-green);">+${Math.ceil(quizPercentage / 15)}</span>
            </div>
        </div>
    `;
    
    // Badges
    if (newBadges.length > 0) {
        html += `
            <div class="reward-card">
                <h3 style="color: var(--neon-purple); margin-bottom: 15px; font-size: 1.1rem;">🏅 NEW BADGES UNLOCKED!</h3>
                <div class="badge-grid">
        `;
        
        newBadges.forEach(badge => {
            html += `
                <div class="badge-item">
                    <div class="badge-icon">${badge.icon || '🎖️'}</div>
                    <div class="badge-name">${badge.name}</div>
                </div>
            `;
        });
        
        html += `</div></div>`;
    }
    
    // Skills
    if (newSkills.length > 0) {
        html += `
            <div class="reward-card">
                <h3 style="color: var(--neon-blue); margin-bottom: 15px; font-size: 1.1rem;">⚡ NEW SKILLS UNLOCKED!</h3>
                <div class="badge-grid">
        `;
        
        newSkills.forEach(skill => {
            html += `
                <div class="badge-item" style="background: rgba(0, 102, 255, 0.15); border-color: rgba(0, 102, 255, 0.3);">
                    <div class="badge-icon">${skill.icon || '⚔️'}</div>
                    <div class="badge-name">${skill.name}</div>
                </div>
            `;
        });
        
        html += `</div></div>`;
    }
    
    // Rank Up
    if (rankUpInfo.rankedUp) {
        html += `
            <div class="rank-up-alert">
                <div style="font-size: 1.5rem; color: var(--neon-green); font-weight: 900; margin-bottom: 10px;">🎊 RANK UP! 🎊</div>
                <p style="color: var(--text-secondary); margin-bottom: 5px;">You've been promoted from</p>
                <p style="color: var(--neon-purple); font-size: 1.1rem; font-weight: 700; margin-bottom: 5px;">Rank ${rankUpInfo.oldRank}</p>
                <p style="color: var(--text-secondary); margin-bottom: 5px;">to</p>
                <p style="color: var(--neon-green); font-size: 1.3rem; font-weight: 900;">${rankUpInfo.newRankName}</p>
            </div>
        `;
    }
    
    // Motivation message
    const motivationMsg = getMotivationalMessage(quizPercentage, readingTime, questData.questTime, player.streak || 0);
    
    html += `
            <div style="background: linear-gradient(135deg, rgba(0, 229, 255, 0.1) 0%, rgba(217, 70, 239, 0.1) 100%); border-left: 4px solid var(--neon-cyan); padding: 20px; margin: 25px 0; border-radius: 2px; text-align: center; color: var(--text-secondary); font-style: italic; line-height: 1.6;">
                "${motivationMsg}"
            </div>
    `;
    
    container.innerHTML = html;
}

function setupEventListeners() {
    const claimBtn = document.querySelector('.btn-claim');
    const backBtn = document.querySelector('.btn-dashboard');
    
    if (claimBtn) {
        claimBtn.addEventListener('click', claimReward);
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
    }
}

function claimReward() {
    const currentPlayer = localStorage.getItem('currentPlayer');
    const player = getPlayerData(currentPlayer);
    const rewards = JSON.parse(sessionStorage.getItem('pendingRewards')) || {};
    
    if (!rewards.rewards) {
        console.error('No rewards to claim');
        return;
    }
    
    // Update EXP
    player.exp += rewards.rewards.totalExp;
    
    // Update Rank & Level
    player.rank = calculateRank(player.exp);
    player.level = calculateLevel(player.exp);
    
    // Update Status
    player.focus += Math.ceil(rewards.readingTime / 5);
    player.memory += Math.ceil(rewards.quizPercentage / 10);
    player.understanding += Math.ceil(rewards.quizPercentage / 8);
    player.accuracy += Math.ceil(rewards.quizPercentage / 12);
    player.mastery += Math.ceil(rewards.quizPercentage / 15);
    
    // Add to quest history
    const questEntry = {
        questName: rewards.questData.questName,
        questDifficulty: rewards.questData.questDifficulty,
        readingTime: rewards.readingTime,
        targetTime: rewards.questData.questTime,
        quizPercentage: rewards.quizPercentage,
        expGained: rewards.rewards.totalExp,
        date: new Date().toISOString()
    };
    
    if (!player.readingHistory) player.readingHistory = [];
    player.readingHistory.push(questEntry);
    
    // Add badges
    if (rewards.newBadges && rewards.newBadges.length > 0) {
        if (!player.badges) player.badges = [];
        rewards.newBadges.forEach(badge => {
            if (!player.badges.find(b => b.id === badge.id)) {
                player.badges.push(badge);
            }
        });
    }
    
    // Add skills
    if (rewards.newSkills && rewards.newSkills.length > 0) {
        if (!player.skillCards) player.skillCards = [];
        rewards.newSkills.forEach(skill => {
            if (!player.skillCards.find(s => s.id === skill.id)) {
                player.skillCards.push(skill);
            }
        });
    }
    
    // Update quest count
    player.questsCompleted = (player.questsCompleted || 0) + 1;
    player.totalStudyTime = (player.totalStudyTime || 0) + rewards.readingTime;
    player.lastPlayedDate = new Date().toLocaleString('th-TH');
    
    // Save player
    savePlayerData(currentPlayer, player);
    
    console.log('✓ Reward claimed and player data updated');
    
    // Show success
    const claimBtn = document.querySelector('.btn-claim');
    if (claimBtn) {
        claimBtn.textContent = '✓ REWARD CLAIMED!';
        claimBtn.style.background = 'linear-gradient(135deg, #00ff99 0%, #00e5ff 100%)';
        claimBtn.disabled = true;
    }
    
    // Clear sessionStorage
    sessionStorage.removeItem('currentQuest');
    sessionStorage.removeItem('readingTime');
    sessionStorage.removeItem('quizPercentage');
    sessionStorage.removeItem('quizData');
    
    // Redirect
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 2000);
}
