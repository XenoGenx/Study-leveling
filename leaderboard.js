/* ========================================
   STUDY GATE SYSTEM - LEADERBOARD
   Hunter Ranking & Leaderboard System
   ======================================== */

let currentSort = 'exp';
let allHunters = [];
let sortedHunters = [];
let currentPlayerName = '';
let huntersCache = null; // Cache parsed data

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
        if (bootOverlay) {
            bootOverlay.style.opacity = '0';
            bootOverlay.style.pointerEvents = 'none';
            bootOverlay.style.transition = 'opacity 0.5s ease-out';
        }
        initializeLeaderboard();
    }, 2400);
    
    // Force remove overlay after animation
    setTimeout(() => {
        if (bootOverlay) {
            bootOverlay.style.display = 'none';
        }
    }, 2900);
}

function initializeLeaderboard() {
    // Get current player name from localStorage or session
    currentPlayerName = localStorage.getItem('currentPlayer') || 'Unknown';
    
    // Load all hunters data
    loadAllHuntersData();
    
    // Initialize UI
    setupEventListeners();
    
    // Display leaderboard (always sorted by study hours + rank)
    displayLeaderboard();
    
    // Update my ranking
    updateMyRanking();
    
    // Update stats
    updateLeaderboardStats();
}

// ========================================
// DATA LOADING & PROCESSING
// ========================================

/**
 * Load all hunters from localStorage (with caching)
 * Only loads players object data from Study Leveling
 */
function loadAllHuntersData() {
    // Use cache if available
    if (huntersCache) {
        allHunters = huntersCache;
        return;
    }

    const playersData = JSON.parse(localStorage.getItem('players')) || {};
    allHunters = [];

    // Pre-allocate array with size
    const hunterNames = Object.keys(playersData);
    
    for (const playerName of hunterNames) {
        const data = playersData[playerName];
        
        const hunter = createHunterObject(playerName, data);
        allHunters.push(hunter);
    }
    
    // Cache the result
    huntersCache = allHunters;
}

/**
 * Create hunter object from player data (optimized)
 */
function createHunterObject(playerName, data) {
    const exp = data.exp || 0;
    return {
        name: playerName,
        exp: exp,
        rank: calculateRank(exp),
        level: calculateLevel(exp),
        completedQuests: data.completedQuests || 0,
        totalStudyTime: data.totalStudyTime || 0,
        mastery: calculateAverageMastery(data),
        streak: data.streak || 0,
        lastBadge: getLatestBadge(data.badges || []),
        focus: data.focus || 0,
        memory: data.memory || 0,
        understanding: data.understanding || 0,
        accuracy: data.accuracy || 0
    };
}

/**
 * Calculate average mastery from player stats (optimized)
 */
function calculateAverageMastery(playerData) {
    const focus = playerData.focus || 0;
    const memory = playerData.memory || 0;
    const understanding = playerData.understanding || 0;
    const accuracy = playerData.accuracy || 0;
    const mastery = playerData.mastery || 0;
    
    return Math.round((focus + memory + understanding + accuracy + mastery) / 5);
}

/**
 * Get latest badge from player
 */
function getLatestBadge(badges) {
    return Array.isArray(badges) && badges.length > 0 ? badges[badges.length - 1] : 'None';
}

// ========================================
// SORTING & RANKING LOGIC
// ========================================

/**
 * Sort hunters by Study Hours first, then Rank (optimized)
 */
function sortHunters(sortBy) {
    sortedHunters = [...allHunters];
    
    // Single optimized sort function - prioritize study hours and rank
    sortedHunters.sort((a, b) => {
        // Primary: Study Hours (descending)
        let comparison = b.totalStudyTime - a.totalStudyTime;
        if (comparison !== 0) return comparison;

        // Secondary: Rank (E=0, D=1, C=2, B=3, A=4, S=5)
        const rankOrder = { 'E': 0, 'D': 1, 'C': 2, 'B': 3, 'A': 4, 'S': 5 };
        const rankDiff = (rankOrder[b.rank] || 0) - (rankOrder[a.rank] || 0);
        if (rankDiff !== 0) return rankDiff;

        // Tertiary: EXP (for same rank)
        return b.exp - a.exp;
    });
}

/**
 * Get ranking position for a hunter name (optimized with cache)
 */
function getHunterRank(hunterName) {
    // Linear search is faster than findIndex for small arrays
    for (let i = 0; i < sortedHunters.length; i++) {
        if (sortedHunters[i].name === hunterName) {
            return i + 1;
        }
    }
    return -1;
}

// ========================================
// UI RENDERING (OPTIMIZED)
// ========================================

/**
 * Display leaderboard (simplified - always sorted by study hours + rank)
 */
function displayLeaderboard() {
    sortHunters();

    const container = document.getElementById('leaderboardContainer');
    
    if (sortedHunters.length === 0) {
        container.innerHTML = '<div class="empty-state">No hunters registered yet</div>';
        return;
    }

    // Build HTML string once
    let html = '';
    const top3Count = Math.min(3, sortedHunters.length);

    // Render Top 3
    for (let i = 0; i < top3Count; i++) {
        const hunter = sortedHunters[i];
        const isCurrentPlayer = hunter.name === currentPlayerName;
        html += renderTopHunterCard(hunter, i + 1, isCurrentPlayer);
    }

    // Render remaining hunters
    if (sortedHunters.length > 3) {
        html += '<div class="hunters-list">';
        for (let i = 3; i < sortedHunters.length; i++) {
            const hunter = sortedHunters[i];
            const isCurrentPlayer = hunter.name === currentPlayerName;
            html += renderHunterRow(hunter, i + 1, isCurrentPlayer);
        }
        html += '</div>';
    }

    // Set all HTML at once
    container.innerHTML = html;
    
    // Animate rows using RAF
    requestAnimationFrame(() => {
        animateLeaderboardRows();
    });
}

/**
 * Render Top 3 hunter cards (simplified)
 */
function renderTopHunterCard(hunter, rank, isCurrentPlayer) {
    const badgeData = [
        { emoji: '👑', label: 'TOP HUNTER', color: '#FFD700' },
        { emoji: '⭐', label: 'ELITE HUNTER', color: '#C0C0C0' },
        { emoji: '🚀', label: 'RISING HUNTER', color: '#CD7F32' }
    ];

    const badge = badgeData[rank - 1];
    const rankClass = `rank-${rank}`;
    const highlightClass = isCurrentPlayer ? 'current-player' : '';
    const studyHours = Math.floor(hunter.totalStudyTime / 60);
    const hunterNameEsc = escapeHtml(hunter.name);

    return `<div class="top-hunter-card ${rankClass} ${highlightClass}" style="animation-delay: ${(rank - 1) * 0.15}s;">
        <div class="hunter-badge">
            <span class="badge-emoji">${badge.emoji}</span>
            <span class="badge-label">${badge.label}</span>
        </div>
        <div class="hunter-info">
            <h3 class="hunter-name">${hunterNameEsc}</h3>
            <div class="hunter-details">
                <div class="detail-item">
                    <span class="detail-label">Rank</span>
                    <span class="detail-value rank-symbol">${hunter.rank}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Study Hours</span>
                    <span class="detail-value">${studyHours}h</span>
                </div>
            </div>
        </div>
        <div class="glow-effect"></div>
    </div>`;
}

/**
 * Render regular hunter row (simplified)
 */
function renderHunterRow(hunter, rank, isCurrentPlayer) {
    const studyHours = Math.floor(hunter.totalStudyTime / 60);
    const highlightClass = isCurrentPlayer ? 'current-player' : '';
    const hunterNameEsc = escapeHtml(hunter.name);

    return `<div class="hunter-row ${highlightClass}" style="animation-delay: ${0.45 + (rank - 4) * 0.05}s;">
        <div class="rank-number">#${rank}</div>
        <div class="rank-name">${hunterNameEsc}</div>
        <div class="rank-stat"><span class="rank-badge">${hunter.rank}</span></div>
        <div class="rank-stat">${studyHours}h</div>
    </div>`;
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
 * Add animation to leaderboard rows using RAF
 */
function animateLeaderboardRows() {
    const rows = document.querySelectorAll('.hunter-row, .top-hunter-card');
    rows.forEach((row) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
    });

    // Use RAF to stagger animations
    let animatedCount = 0;
    const animateNextBatch = () => {
        const batchSize = 5;
        for (let i = 0; i < batchSize && animatedCount < rows.length; i++) {
            rows[animatedCount].style.animation = `slideInRow 0.6s ease-out forwards`;
            rows[animatedCount].style.animationDelay = `${animatedCount * 0.03}s`;
            animatedCount++;
        }

        if (animatedCount < rows.length) {
            requestAnimationFrame(animateNextBatch);
        }
    };

    animateNextBatch();
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

    const myRankCard = document.querySelector('.my-rank-card');
    if (position > 0 && position <= 3) {
        myRankCard.classList.add('top-3-highlight');
    }
}

// ========================================
// STATISTICS (OPTIMIZED)
// ========================================

/**
 * Update leaderboard statistics (pre-computed)
 */
function updateLeaderboardStats() {
    const totalHunters = sortedHunters.length;
    const topExp = totalHunters > 0 ? sortedHunters[0].exp : 0;
    
    // Pre-compute average in single pass
    let totalLevel = 0;
    let totalQuests = 0;

    for (let i = 0; i < totalHunters; i++) {
        totalLevel += sortedHunters[i].level;
        totalQuests += sortedHunters[i].completedQuests;
    }

    const avgLevel = totalHunters > 0 ? Math.round(totalLevel / totalHunters) : 0;

    document.getElementById('totalHunters').textContent = totalHunters;
    document.getElementById('topExp').textContent = topExp.toLocaleString();
    document.getElementById('avgLevel').textContent = avgLevel;
    document.getElementById('totalQuests').textContent = totalQuests;
}

// ========================================
// EVENT LISTENERS
// ========================================

/**
 * Setup all event listeners (simplified)
 */
function setupEventListeners() {
    document.getElementById('backBtn').addEventListener('click', goBackToDashboard);
    document.getElementById('refreshBtn').addEventListener('click', refreshLeaderboard);
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
    // Clear cache to force reload
    huntersCache = null;
    
    loadAllHuntersData();
    displayLeaderboard();
    updateMyRanking();
    updateLeaderboardStats();
    
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.style.animation = 'spin 0.6s ease-in-out';
    setTimeout(() => {
        refreshBtn.style.animation = 'none';
    }, 600);
}
