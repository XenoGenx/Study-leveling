/* ========================================
   DASHBOARD PAGE - MAIN HUB
   Quest Creator, Profile Display, Goal Setting
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initializeStorage();
    loadDashboard();
    setupEventListeners();
});

/**
 * โหลด Dashboard
 */
function loadDashboard() {
    const currentPlayer = localStorage.getItem('currentPlayer');
    
    if (!currentPlayer) {
        window.location.href = 'index.html';
        return;
    }
    
    const player = getPlayerData(currentPlayer);
    
    if (!player) {
        window.location.href = 'index.html';
        return;
    }
    
    // แสดงข้อมูลผู้ใช้
    displayPlayerProfile(player);
    displayStats(player);
    displayRecentQuests(player);
    displayBadgesAndSkills(player);
    displayQuestForm();
}

/**
 * แสดงโปรไฟล์ผู้ใช้
 */
function displayPlayerProfile(player) {
    const headerUserName = document.getElementById('headerUserName') || createHeaderElement('headerUserName');
    const headerUserRank = document.getElementById('headerUserRank') || createHeaderElement('headerUserRank');
    const levelDisplay = document.getElementById('levelDisplay') || createHeaderElement('levelDisplay');
    
    headerUserName.textContent = player.name;
    headerUserRank.textContent = `${player.rank} Rank - Level ${player.level}`;
    levelDisplay.textContent = `EXP: ${player.exp} / ${getNextLevelExp(player.level)}`;
}

/**
 * แสดง Status Statistics
 */
function displayStats(player) {
    let statsHtml = `
        <div class="card">
            <div class="card-title">📊 PLAYER STATS</div>
            <div class="profile-row">
                <span class="profile-label">Rank:</span>
                <span class="profile-value">${player.rank} - ${getRankName(player.rank)}</span>
            </div>
            <div class="profile-row">
                <span class="profile-label">Level:</span>
                <span class="profile-value">${player.level}</span>
            </div>
            <div class="profile-row">
                <span class="profile-label">EXP:</span>
                <span class="profile-value">${player.exp}</span>
            </div>
            <div class="exp-bar">
                <div class="exp-fill" style="width: ${(player.exp % 300) / 3}%"></div>
            </div>
            <div class="profile-row">
                <span class="profile-label">Quests Completed:</span>
                <span class="profile-value">${player.questsCompleted}</span>
            </div>
            <div class="profile-row">
                <span class="profile-label">Total Study Time:</span>
                <span class="profile-value">${Math.floor(player.totalStudyTime || 0)} min</span>
            </div>
            <div class="profile-row">
                <span class="profile-label">Streak:</span>
                <span class="profile-value">🔥 ${calculateStudyStreak(player)} days</span>
            </div>
        </div>
    `;
    
    const statsContainer = document.getElementById('statsContainer');
    if (statsContainer) statsContainer.innerHTML = statsHtml;
}

/**
 * แสดง Status Grid
 */
function displayStatusGrid(player) {
    const statuses = ['focus', 'memory', 'understanding', 'accuracy', 'mastery'];
    const statusLabels = {
        focus: 'Focus',
        memory: 'Memory',
        understanding: 'Understanding',
        accuracy: 'Accuracy',
        mastery: 'Mastery'
    };
    
    let gridHtml = '<div class="status-grid">';
    
    statuses.forEach(status => {
        const value = player[status] || 0;
        gridHtml += `
            <div class="status-box">
                <div class="status-name">${statusLabels[status]}</div>
                <div class="status-value">${value}</div>
            </div>
        `;
    });
    
    gridHtml += '</div>';
    
    const statusContainer = document.getElementById('statusContainer');
    if (statusContainer) statusContainer.innerHTML = gridHtml;
}

/**
 * แสดง Recent Quests Log
 */
function displayRecentQuests(player) {
    const history = player.readingHistory || [];
    
    if (history.length === 0) {
        const container = document.getElementById('recentQuestsContainer');
        if (container) {
            container.innerHTML = `
                <div class="card">
                    <div class="card-title">📚 QUEST LOG</div>
                    <p style="color: var(--text-secondary); text-align: center;">No quests completed yet. Start your journey!</p>
                </div>
            `;
        }
        return;
    }
    
    // แสดง 5 เควสล่าสุด
    const recentQuests = history.slice(-5).reverse();
    
    let html = `
        <div class="card">
            <div class="card-title">📚 QUEST LOG</div>
            <table style="width: 100%; font-size: 0.9rem;">
                <tr style="border-bottom: 1px solid rgba(0, 212, 255, 0.2); padding: 10px 0;">
                    <th style="text-align: left; padding: 10px 0; color: var(--cyan);">Quest</th>
                    <th style="text-align: center; color: var(--cyan);">Time</th>
                    <th style="text-align: center; color: var(--cyan);">Score</th>
                    <th style="text-align: center; color: var(--cyan);">EXP</th>
                </tr>
    `;
    
    recentQuests.forEach(quest => {
        html += `
            <tr style="border-bottom: 1px solid rgba(0, 212, 255, 0.1); padding: 10px 0;">
                <td style="padding: 10px 0; color: var(--text-secondary);">${quest.questName || 'Chapter ' + quest.chapter}</td>
                <td style="text-align: center; color: var(--text-secondary);">${quest.readingTime} min</td>
                <td style="text-align: center; color: ${quest.quizPercentage >= 80 ? '#00ff64' : 'var(--text-secondary)'};">${quest.quizPercentage || '-'}%</td>
                <td style="text-align: center; color: var(--cyan); font-weight: 700;">+${quest.expGained || 0}</td>
            </tr>
        `;
    });
    
    html += '</table></div>';
    
    const container = document.getElementById('recentQuestsContainer');
    if (container) container.innerHTML = html;
}

/**
 * แสดง Badges และ Skill Cards
 */
function displayBadgesAndSkills(player) {
    const badges = player.badges || [];
    const skills = player.skillCards || [];
    
    let html = '<div class="card"><div class="card-title">🏆 BADGES & SKILLS</div>';
    
    if (badges.length === 0 && skills.length === 0) {
        html += '<p style="color: var(--text-secondary); text-align: center;">Complete quests to earn badges and skills!</p>';
    } else {
        if (badges.length > 0) {
            html += '<div style="margin-bottom: 15px;"><p style="font-size: 0.9rem; color: var(--purple); margin-bottom: 10px;">🏅 Badges</p>';
            html += '<div class="badges-grid">';
            badges.forEach(badge => {
                html += `<div class="badge-item"><div class="badge-icon">${badge.icon || '🎖️'}</div><div class="badge-name">${badge.name}</div></div>`;
            });
            html += '</div></div>';
        }
        
        if (skills.length > 0) {
            html += '<div><p style="font-size: 0.9rem; color: var(--cyan); margin-bottom: 10px;">⚡ Skill Cards</p>';
            html += '<div class="badges-grid">';
            skills.forEach(skill => {
                html += `<div class="badge-item" style="background: rgba(74, 144, 255, 0.15); border-color: rgba(74, 144, 255, 0.3);"><div class="badge-icon">${skill.icon || '⚔️'}</div><div class="badge-name">${skill.name}</div></div>`;
            });
            html += '</div></div>';
        }
    }
    
    html += '</div>';
    
    const container = document.getElementById('badgesContainer');
    if (container) container.innerHTML = html;
}

/**
 * แสดง Quest Creator Form
 */
function displayQuestForm() {
    const formContainer = document.getElementById('questFormContainer');
    if (!formContainer) return;
    
    const formHtml = `
        <div class="card">
            <div class="card-title">⚔️ CREATE QUEST</div>
            <form id="questForm" class="quest-creator-form">
                <div class="form-group">
                    <label class="form-label">Quest Name</label>
                    <input 
                        type="text" 
                        id="questName" 
                        class="form-input" 
                        placeholder="Enter quest or chapter name"
                        maxlength="50"
                        required
                    >
                </div>
                
                <div class="form-group">
                    <label class="form-label">Reading Time Goal (minutes)</label>
                    <select id="questTime" class="form-select form-input" required>
                        <option value="">Select time...</option>
                        <option value="10">10 minutes</option>
                        <option value="15">15 minutes</option>
                        <option value="20">20 minutes</option>
                        <option value="25">25 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">60 minutes</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Difficulty</label>
                    <select id="questDifficulty" class="form-select form-input" required>
                        <option value="">Select difficulty...</option>
                        <option value="easy">Easy (0.8x EXP)</option>
                        <option value="normal">Normal (1.0x EXP)</option>
                        <option value="hard">Hard (1.5x EXP)</option>
                        <option value="boss">Boss (2.0x EXP)</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Notes (Optional)</label>
                    <textarea 
                        id="questNotes" 
                        class="form-input" 
                        placeholder="What are you studying about?"
                        maxlength="200"
                        rows="3"
                    ></textarea>
                </div>
                
                <div class="btn-group">
                    <button type="submit" class="btn-primary">CREATE & START</button>
                    <button type="reset" class="btn-secondary">RESET</button>
                </div>
            </form>
        </div>
    `;
    
    formContainer.innerHTML = formHtml;
    
    // Event listener for form
    const form = document.getElementById('questForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleQuestCreation();
        });
    }
}

/**
 * จัดการการสร้างเควส
 */
function handleQuestCreation() {
    const questName = document.getElementById('questName').value.trim();
    const questTime = parseInt(document.getElementById('questTime').value);
    const questDifficulty = document.getElementById('questDifficulty').value;
    const questNotes = document.getElementById('questNotes').value.trim();
    
    // Validation
    if (!questName || !questTime || !questDifficulty) {
        alert('⚠️ Please fill in all required fields!');
        return;
    }
    
    // เก็บข้อมูลเควสใน sessionStorage
    const questData = {
        questName,
        questTime,
        questDifficulty,
        questNotes,
        startTime: new Date().getTime()
    };
    
    sessionStorage.setItem('currentQuest', JSON.stringify(questData));
    
    console.log('✓ Quest created:', questData);
    
    // Navigate to timer
    setTimeout(() => {
        window.location.href = 'timer.html';
    }, 500);
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    const changeHunterBtn = document.getElementById('changeHunterBtn');
    const resetDataBtn = document.getElementById('resetDataBtn');
    
    if (changeHunterBtn) {
        changeHunterBtn.addEventListener('click', () => {
            localStorage.removeItem('currentPlayer');
            window.location.href = 'index.html';
        });
    }
    
    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', () => {
            const currentPlayer = localStorage.getItem('currentPlayer');
            if (currentPlayer && confirm(`⚠️ Delete all data for ${currentPlayer}? This action cannot be undone!`)) {
                deletePlayerData(currentPlayer);
                localStorage.removeItem('currentPlayer');
                window.location.href = 'index.html';
            }
        });
    }
}

/**
 * Create header element if not exists
 */
function createHeaderElement(id) {
    const element = document.createElement('span');
    element.id = id;
    element.style.display = 'none';
    document.body.appendChild(element);
    return element;
}
