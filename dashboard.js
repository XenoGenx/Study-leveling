/* ========================================
   DASHBOARD - SYSTEM INTERFACE
   3 Hologram Panels Layout
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Start booting sequence
    bootSequence();
});

function bootSequence() {
    // Stage 1: SYSTEM BOOTING
    setTimeout(() => {
        document.getElementById('bootLine2').style.display = 'block';
    }, 800);
    
    // Stage 2: PLAYER DATA LOADED
    setTimeout(() => {
        document.getElementById('bootLine3').style.display = 'block';
    }, 1600);
    
    // Stage 3: Load dashboard and hide overlay
    setTimeout(() => {
        loadDashboard();
        setupEventListeners();
        hideBootOverlay();
    }, 2400);
}

function hideBootOverlay() {
    const overlay = document.getElementById('bootOverlay');
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    
    setTimeout(() => {
        overlay.style.display = 'none';
        // Trigger panel animations
        animatePanels();
    }, 500);
}

function animatePanels() {
    const panelLeft = document.getElementById('panelLeft');
    const panelCenter = document.getElementById('panelCenter');
    const panelRight = document.getElementById('panelRight');
    
    // Add animation classes
    panelLeft.classList.add('panel-slide-left');
    panelCenter.classList.add('panel-slide-center');
    panelRight.classList.add('panel-slide-right');
}

function loadDashboard() {
    const currentPlayer = localStorage.getItem('currentPlayer');
    
    if (!currentPlayer) {
        window.location.href = 'index.html';
        return;
    }
    
    // Get player data synchronously from localStorage
    const players = JSON.parse(localStorage.getItem('players')) || {};
    const player = players[currentPlayer];
    
    if (!player) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update player name
    document.getElementById('welcomeName').textContent = player.name;
    
    // Render all panels
    displaySkillsPanel(player);
    displayQuestForm(player);
    displayStatusPanel(player);
}

function displaySkillsPanel(player) {
    const skillsContainer = document.getElementById('skillsContainer');
    
    let html = `
        <div class="skill-item">
            <strong>🏆 Badges:</strong> ${player.badges.length}
        </div>
        <div class="skill-item">
            <strong>⚡ Skills:</strong> ${player.skillCards.length}
        </div>
        <div class="skill-item">
            <strong>🔥 Streak:</strong> ${player.streak} days
        </div>
        <div class="skill-item">
            <strong>📚 Study Time:</strong> ${player.totalStudyTime}h
        </div>
    `;
    
    if (player.badges.length > 0) {
        html += `<hr style="border-color: rgba(0,229,255,0.2); margin: 15px 0;">
        <div><strong>Recent Badges:</strong></div>`;
        player.badges.slice(-3).forEach(badge => {
            html += `<div class="skill-badge">${badge.icon || '🏅'} ${badge.name}</div>`;
        });
    }
    
    // Display Skill Cards
    if (player.skillCards && player.skillCards.length > 0) {
        html += `<hr style="border-color: rgba(0,229,255,0.2); margin: 15px 0;">
        <div><strong>Skills Unlocked:</strong></div>
        <div class="skill-cards-grid">`;
        
        player.skillCards.forEach(skillObj => {
            // Handle both string and object formats
            const skillName = typeof skillObj === 'string' ? skillObj : skillObj.name;
            const skillData = getSkillCardDetails(skillName);
            if (skillData) {
                const rarityClass = getRarityClass(skillData.rarity);
                const displayIcon = typeof skillObj === 'object' ? (skillObj.icon || skillData.icon) : skillData.icon;
                html += `
                    <div class="skill-card-item ${rarityClass}" onclick="openSkillCardModal('${skillName}')" style="cursor: pointer;">
                        <div class="skill-card-icon">${displayIcon}</div>
                        <div class="skill-card-name">${skillName}</div>
                        <div class="skill-card-type">${skillData.type}</div>
                    </div>`;
            }
        });
        
        html += `</div>`;
    } else {
        // No Skill Cards message
        html += `<hr style="border-color: rgba(0,229,255,0.2); margin: 15px 0;">
        <div class="no-skills-message">
            <div class="message-title">No Skill Card Acquired Yet</div>
            <div class="message-subtitle">Complete quests to obtain your first skill card.</div>
        </div>`;
    }
    
    skillsContainer.innerHTML = html;
}

function getRarityClass(rarity) {
    const rarityMap = {
        'Common': 'card-common',
        'Rare': 'card-rare',
        'Epic': 'card-epic',
        'Legendary': 'card-legendary'
    };
    return rarityMap[rarity] || 'card-common';
}

function getReadingTimeByDifficulty(difficulty) {
    const timeMap = {
        'easy': 10,
        'normal': 30,
        'hard': 60,
        'boss': 120
    };
    return timeMap[difficulty] || 30;
}

function displayQuestForm(player) {
    const questFormContainer = document.getElementById('questFormContainer');
    
    let html = `
        <div class="form-group">
            <label class="form-label">Hunt Name</label>
            <input type="text" id="questName" class="form-input" placeholder="Create your hunt name..." maxlength="50">
        </div>
        
        <div class="form-group">
            <label class="form-label">Difficulty Level</label>
            <select id="questDifficulty" class="form-select">
                <option value="easy">Easy - 10 min</option>
                <option value="normal" selected>Normal - 30 min</option>
                <option value="hard">Hard - 1 hour</option>
                <option value="boss">Boss - 2 hours</option>
            </select>
        </div>
        
        <div class="form-group">
            <label class="form-label">Reading Time</label>
            <div id="readingTimeDisplay" class="reading-time-display">30 min</div>
        </div>
        
        <button id="startQuestBtn" class="btn-quest-start">ACCEPT QUEST</button>
        <button id="focusModeBtn" class="btn-focus-mode">START FOCUS MODE</button>
    `;
    
    questFormContainer.innerHTML = html;
    
    // Add event listener for difficulty changes
    const difficultySelect = document.getElementById('questDifficulty');
    const readingTimeDisplay = document.getElementById('readingTimeDisplay');
    
    difficultySelect.addEventListener('change', (e) => {
        const time = getReadingTimeByDifficulty(e.target.value);
        readingTimeDisplay.textContent = time + ' min';
    });
    
    document.getElementById('startQuestBtn').addEventListener('click', handleQuestStart);
    document.getElementById('focusModeBtn').addEventListener('click', handleFocusMode);
}

function handleFocusMode() {
    const questName = document.getElementById('questName').value.trim();
    const questDifficulty = document.getElementById('questDifficulty').value;
    const questTime = getReadingTimeByDifficulty(questDifficulty);
    
    if (!questName) {
        alert('⚠️ Enter quest name!');
        return;
    }
    
    // Store in sessionStorage with calculated time based on difficulty
    sessionStorage.setItem('currentQuest', JSON.stringify({
        questName,
        questTime,
        questDifficulty
    }));
    
    window.location.href = 'timer.html';
}

function handleQuestStart() {
    const questName = document.getElementById('questName').value.trim();
    const questDifficulty = document.getElementById('questDifficulty').value;
    const questTime = getReadingTimeByDifficulty(questDifficulty);
    
    if (!questName) {
        alert('⚠️ Enter quest name!');
        return;
    }
    
    // Store in sessionStorage with calculated time based on difficulty
    sessionStorage.setItem('currentQuest', JSON.stringify({
        questName,
        questTime,
        questDifficulty
    }));
    
    // Navigate to timer
    window.location.href = 'timer.html';
}

function displayStatusPanel(player) {
    const statusContainer = document.getElementById('statusContainer');
    
    let html = `
        <div class="stat-item">
            <div class="stat-label">Rank</div>
            <div class="stat-value">${player.rank}</div>
        </div>
        
        <div class="stat-item">
            <div class="stat-label">Level</div>
            <div class="stat-value">${player.level}</div>
        </div>
        
        <div class="stat-item">
            <div class="stat-label">EXP</div>
            <div style="font-size: 0.9rem; color: var(--neon-cyan);">${player.exp}</div>
            <div class="progress-bar"><div class="progress-fill" style="width: ${(player.exp % 100)}%"></div></div>
        </div>
        
        <hr style="border-color: rgba(0,229,255,0.2); margin: 15px 0;">
        
        <div class="stat-item">
            <div class="stat-label">🎯 Focus</div>
            <div class="stat-value">${player.focus}</div>
            <div class="progress-bar"><div class="progress-fill" style="width: ${Math.min(player.focus * 2, 100)}%"></div></div>
        </div>
        
        <div class="stat-item">
            <div class="stat-label">🧠 Memory</div>
            <div class="stat-value">${player.memory}</div>
            <div class="progress-bar"><div class="progress-fill" style="width: ${Math.min(player.memory * 2, 100)}%"></div></div>
        </div>
        
        <div class="stat-item">
            <div class="stat-label">📚 Understanding</div>
            <div class="stat-value">${player.understanding}</div>
            <div class="progress-bar"><div class="progress-fill" style="width: ${Math.min(player.understanding * 2, 100)}%"></div></div>
        </div>
        
        <div class="stat-item">
            <div class="stat-label">✅ Accuracy</div>
            <div class="stat-value">${player.accuracy}</div>
            <div class="progress-bar"><div class="progress-fill" style="width: ${Math.min(player.accuracy * 2, 100)}%"></div></div>
        </div>
        
        <div class="stat-item">
            <div class="stat-label">👑 Mastery</div>
            <div class="stat-value">${player.mastery}</div>
            <div class="progress-bar"><div class="progress-fill" style="width: ${Math.min(player.mastery * 2, 100)}%"></div></div>
        </div>
    `;
    
    statusContainer.innerHTML = html;
}

function setupEventListeners() {
    const leaderboardBtn = document.getElementById('leaderboardBtn');
    leaderboardBtn.addEventListener('click', () => {
        window.location.href = 'leaderboard.html';
    });

    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentPlayer');
        window.location.href = 'index.html';
    });

    // Setup Skill Card Modal Listeners
    setupSkillCardModalListeners();
}
