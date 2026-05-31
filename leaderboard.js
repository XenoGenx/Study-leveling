/* ========================================
   STUDY GATE SYSTEM - LEADERBOARD
   Hunter Ranking & Leaderboard System
   ======================================== */

let currentSort = 'exp';
let allHunters = [];
let sortedHunters = [];
let currentPlayerName = '';

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    startBootSequence();
});

function startBootSequence() {
    const bootOverlay = document.getElementById('bootOverlay');
    const bootLine1 = document.getElementById('bootLine1');
    const bootLine2 = document.getElementById('bootLine2');
    const bootLine3 = document.getElementById('bootLine3');

    setTimeout(() => {
        bootLine2.style.display = 'block';
    }, 800);

    setTimeout(() => {
        bootLine3.style.display = 'block';
    }, 1600);

    setTimeout(() => {
        bootOverlay.classList.add('fade-out');
        initializeLeaderboard();
    }, 2400);
}

function initializeLeaderboard() {
    // Get current player name from localStorage or session
    currentPlayerName = localStorage.getItem('currentPlayer') || 'Unknown';
    
    // Load all hunters data
    loadAllHuntersData();
    
    // Initialize UI
    setupEventListeners();
    
    // Display leaderboard with default sort (EXP)
    displayLeaderboard('exp');
    
    // Update my ranking
    updateMyRanking();
    
    // Update stats
    updateLeaderboardStats();
}

// ========================================
// DATA LOADING & PROCESSING
// ========================================

/**
 * Load all hunters from localStorage
 * Only loads players object data from Study Leveling
 */
function loadAllHuntersData() {
    const playersData = JSON.parse(localStorage.getItem('players')) || {};
    allHunters = [];

    for (const [playerName, data] of Object.entries(playersData)) {
        const hunter = {
            name: playerName,
            exp: data.exp || 0,
            rank: calculateRank(data.exp || 0),
            level: calculateLevel(data.exp || 0),
            completedQuests: data.completedQuests || 0,
            totalStudyTime: data.totalStudyTime || 0, // in minutes
            mastery: calculateAverageMastery(data),
            streak: data.streak || 0,
            lastBadge: getLatestBadge(data.badges || []),
            focus: data.focus || 0,
            memory: data.memory || 0,
            understanding: data.understanding || 0,
            accuracy: data.accuracy || 0
        };

        allHunters.push(hunter);
    }
}

/**
 * Calculate average mastery from player stats
 */
function calculateAverageMastery(playerData) {
    const stats = [
        playerData.focus || 0,
        playerData.memory || 0,
        playerData.understanding || 0,
        playerData.accuracy || 0,
        playerData.mastery || 0
    ];
    const avg = Math.round(stats.reduce((a, b) => a + b) / stats.length);
    return avg;
}

/**
 * Get latest badge from player
 */
function getLatestBadge(badges) {
    if (!Array.isArray(badges) || badges.length === 0) {
        return 'None';
    }
    return badges[badges.length - 1];
}

// ========================================
// SORTING & RANKING LOGIC
// ========================================

/**
 * Sort hunters by specified criteria
 * Priority: EXP > Level > Quests > Mastery > Study Time
 */
function sortHunters(sortBy) {
    sortedHunters = [...allHunters].sort((a, b) => {
        let result = 0;

        // Primary sort
        switch (sortBy) {
            case 'exp':
                result = b.exp - a.exp;
                if (result !== 0) return result;
                break;
            case 'level':
                result = b.level - a.level;
                if (result !== 0) return result;
                result = b.exp - a.exp;
                if (result !== 0) return result;
                break;
            case 'quests':
                result = b.completedQuests - a.completedQuests;
                if (result !== 0) return result;
                result = b.exp - a.exp;
                if (result !== 0) return result;
                break;
            case 'study':
                result = b.totalStudyTime - a.totalStudyTime;
                if (result !== 0) return result;
                result = b.exp - a.exp;
                if (result !== 0) return result;
                break;
            case 'mastery':
                result = b.mastery - a.mastery;
                if (result !== 0) return result;
                result = b.exp - a.exp;
                if (result !== 0) return result;
                break;
            case 'streak':
                result = b.streak - a.streak;
                if (result !== 0) return result;
                result = b.exp - a.exp;
                if (result !== 0) return result;
                break;
        }

        // Secondary sort chain if primary is equal
        result = b.exp - a.exp;
        if (result !== 0) return result;

        result = b.level - a.level;
        if (result !== 0) return result;

        result = b.completedQuests - a.completedQuests;
        if (result !== 0) return result;

        result = b.mastery - a.mastery;
        if (result !== 0) return result;

        return b.totalStudyTime - a.totalStudyTime;
    });
}

/**
 * Get ranking position for a hunter name
 */
function getHunterRank(hunterName) {
    const index = sortedHunters.findIndex(h => h.name === hunterName);
    return index >= 0 ? index + 1 : -1;
}

// ========================================
// UI RENDERING
// ========================================

/**
 * Display leaderboard with specified sort
 */
function displayLeaderboard(sortBy) {
    currentSort = sortBy;
    sortHunters(sortBy);

    const container = document.getElementById('leaderboardContainer');
    
    if (sortedHunters.length === 0) {
        container.innerHTML = '<div class="empty-state">No hunters registered yet</div>';
        return;
    }

    let html = '';

    // Display Top 3 specially
    for (let i = 0; i < Math.min(3, sortedHunters.length); i++) {
        const hunter = sortedHunters[i];
        const isCurrentPlayer = hunter.name === currentPlayerName;
        
        html += renderTopHunterCard(hunter, i + 1, isCurrentPlayer);
    }

    // Display remaining hunters as list
    if (sortedHunters.length > 3) {
        html += '<div class="hunters-list">';
        for (let i = 3; i < sortedHunters.length; i++) {
            const hunter = sortedHunters[i];
            const isCurrentPlayer = hunter.name === currentPlayerName;
            
            html += renderHunterRow(hunter, i + 1, isCurrentPlayer);
        }
        html += '</div>';
    }

    container.innerHTML = html;
    
    // Add animations
    animateLeaderboardRows();
}

/**
 * Render Top 3 hunter cards
 */
function renderTopHunterCard(hunter, rank, isCurrentPlayer) {
    const badgeColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // Gold, Silver, Bronze
    const badgeLabels = ['TOP HUNTER', 'ELITE HUNTER', 'RISING HUNTER'];
    const badgeEmojis = ['👑', '⭐', '🚀'];

    const rankClass = `rank-${rank}`;
    const highlightClass = isCurrentPlayer ? 'current-player' : '';
    const studyTimeStr = formatStudyTime(hunter.totalStudyTime);

    return `
        <div class="top-hunter-card ${rankClass} ${highlightClass}" style="animation-delay: ${(rank - 1) * 0.15}s;">
            <div class="hunter-badge">
                <span class="badge-emoji">${badgeEmojis[rank - 1]}</span>
                <span class="badge-label">${badgeLabels[rank - 1]}</span>
            </div>
            <div class="hunter-info">
                <h3 class="hunter-name">${escapeHtml(hunter.name)}</h3>
                <div class="hunter-details">
                    <div class="detail-item">
                        <span class="detail-label">Rank</span>
                        <span class="detail-value rank-symbol">${hunter.rank}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Level</span>
                        <span class="detail-value">${hunter.level}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">EXP</span>
                        <span class="detail-value">${hunter.exp.toLocaleString()}</span>
                    </div>
                </div>
                <div class="hunter-stats">
                    <div class="stat">
                        <span class="stat-icon">⚔️</span>
                        <span>${hunter.completedQuests} Quests</span>
                    </div>
                    <div class="stat">
                        <span class="stat-icon">📖</span>
                        <span>${studyTimeStr}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-icon">🎯</span>
                        <span>${hunter.mastery}% Mastery</span>
                    </div>
                    <div class="stat">
                        <span class="stat-icon">🔥</span>
                        <span>${hunter.streak} Streak</span>
                    </div>
                </div>
                <div class="hunter-badge-item">
                    <span class="badge-text">${hunter.lastBadge}</span>
                </div>
            </div>
            <div class="glow-effect"></div>
        </div>
    `;
}

/**
 * Render regular hunter row
 */
function renderHunterRow(hunter, rank, isCurrentPlayer) {
    const studyTimeStr = formatStudyTime(hunter.totalStudyTime);
    const highlightClass = isCurrentPlayer ? 'current-player' : '';

    return `
        <div class="hunter-row ${highlightClass}" style="animation-delay: ${0.45 + (rank - 4) * 0.05}s;">
            <div class="rank-number">#${rank}</div>
            <div class="rank-name">${escapeHtml(hunter.name)}</div>
            <div class="rank-stat">
                <span class="rank-badge">${hunter.rank}</span>
            </div>
            <div class="rank-stat">Lv ${hunter.level}</div>
            <div class="rank-stat">${hunter.exp.toLocaleString()} EXP</div>
            <div class="rank-stat">${hunter.completedQuests} ⚔️</div>
            <div class="rank-stat">${studyTimeStr}</div>
            <div class="rank-stat">${hunter.mastery}%</div>
            <div class="rank-stat">${hunter.streak}🔥</div>
        </div>
    `;
}

/**
 * Format study time from minutes to readable format
 */
function formatStudyTime(minutes) {
    if (minutes === 0) return '0m';
    if (minutes < 60) return `${minutes}m`;
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Add animation to leaderboard rows
 */
function animateLeaderboardRows() {
    const rows = document.querySelectorAll('.hunter-row, .top-hunter-card');
    rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        row.style.animation = `slideInRow 0.6s ease-out forwards`;
        row.style.animationDelay = `${0.45 + index * 0.05}s`;
    });
}

// ========================================
// MY RANKING UPDATE
// ========================================

/**
 * Update current player's ranking display
 */
function updateMyRanking() {
    const playerData = getPlayerData(currentPlayerName);

    if (!playerData) {
        document.getElementById('myHunterName').textContent = 'Not Found';
        document.getElementById('myPosition').textContent = '#--';
        document.getElementById('myExp').textContent = '0';
        document.getElementById('myRank').textContent = 'E';
        document.getElementById('myLevel').textContent = '1';
        return;
    }

    const position = getHunterRank(currentPlayerName);
    const exp = playerData.exp || 0;
    const rank = calculateRank(exp);
    const level = calculateLevel(exp);

    document.getElementById('myHunterName').textContent = currentPlayerName;
    document.getElementById('myPosition').textContent = position > 0 ? `#${position}` : '#--';
    document.getElementById('myExp').textContent = exp.toLocaleString();
    document.getElementById('myRank').textContent = rank;
    document.getElementById('myLevel').textContent = level;

    // Highlight my ranking section if in top 3
    const myRankCard = document.querySelector('.my-rank-card');
    if (position > 0 && position <= 3) {
        myRankCard.classList.add('top-3-highlight');
    }
}

// ========================================
// STATISTICS
// ========================================

/**
 * Update leaderboard statistics
 */
function updateLeaderboardStats() {
    const totalHunters = sortedHunters.length;
    const topExp = sortedHunters.length > 0 ? sortedHunters[0].exp : 0;
    const avgLevel = sortedHunters.length > 0 
        ? Math.round(sortedHunters.reduce((sum, h) => sum + h.level, 0) / sortedHunters.length)
        : 0;
    const totalQuests = sortedHunters.reduce((sum, h) => sum + h.completedQuests, 0);

    document.getElementById('totalHunters').textContent = totalHunters;
    document.getElementById('topExp').textContent = topExp.toLocaleString();
    document.getElementById('avgLevel').textContent = avgLevel;
    document.getElementById('totalQuests').textContent = totalQuests;
}

// ========================================
// EVENT LISTENERS
// ========================================

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Back button
    document.getElementById('backBtn').addEventListener('click', goBackToDashboard);

    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', refreshLeaderboard);

    // Sort buttons
    document.querySelectorAll('.btn-sort').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.btn-sort').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            displayLeaderboard(this.dataset.sort);
        });
    });
}

/**
 * Go back to dashboard
 */
function goBackToDashboard() {
    window.location.href = 'dashboard.html';
}

/**
 * Refresh leaderboard data
 */
function refreshLeaderboard() {
    loadAllHuntersData();
    displayLeaderboard(currentSort);
    updateMyRanking();
    updateLeaderboardStats();
    
    // Show refresh animation
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.style.transform = 'rotate(360deg)';
    refreshBtn.style.animation = 'spin 0.6s ease-in-out';
    setTimeout(() => {
        refreshBtn.style.animation = 'none';
        refreshBtn.style.transform = 'rotate(0deg)';
    }, 600);
}
