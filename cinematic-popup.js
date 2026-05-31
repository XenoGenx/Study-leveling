/* ========================================
   CINEMATIC ACHIEVEMENT POPUP SYSTEM
   Hologram RPG Style Notifications
   ======================================== */

let popupQueue = [];
let isPopupDisplaying = false;

/**
 * Display a cinematic achievement popup
 * @param {object} popupData - Popup configuration
 */
function displayCinematicPopup(popupData) {
    // Add to queue
    popupQueue.push(popupData);
    
    // Process queue
    if (!isPopupDisplaying) {
        processPopupQueue();
    }
}

/**
 * Process popup queue one by one
 */
function processPopupQueue() {
    if (popupQueue.length === 0) {
        isPopupDisplaying = false;
        return;
    }
    
    isPopupDisplaying = true;
    const popupData = popupQueue.shift();
    
    // Create and show popup
    const popup = createPopupElement(popupData);
    document.body.appendChild(popup);
    
    // Trigger animation
    setTimeout(() => {
        popup.classList.add('popup-active');
    }, 10);
    
    // Auto-close or wait for user interaction
    const displayDuration = popupData.rarity === 'legendary' ? 4000 : 3000;
    
    setTimeout(() => {
        popup.classList.remove('popup-active');
        setTimeout(() => {
            popup.remove();
            processPopupQueue(); // Process next in queue
        }, 500);
    }, displayDuration);
}

/**
 * Create popup element
 */
function createPopupElement(data) {
    const popup = document.createElement('div');
    popup.className = `cinematic-popup popup-${data.type}`;
    if (data.rarity === 'legendary') {
        popup.classList.add('popup-legendary');
    }
    
    let content = '';
    
    if (data.type === 'badge') {
        content = `
            <div class="popup-overlay"></div>
            <div class="popup-window">
                <div class="popup-glow"></div>
                
                <div class="popup-header">
                    <span class="popup-line"></span>
                    <span class="popup-label">${data.title}</span>
                    <span class="popup-line"></span>
                </div>
                
                <div class="popup-content">
                    <div class="popup-icon" style="color: ${data.color}; font-size: 60px;">
                        ${data.icon}
                    </div>
                    
                    <div class="popup-badge-info">
                        <h2 class="popup-badge-name">${data.badgeName}</h2>
                        <div class="popup-badge-rarity" style="color: ${data.color};">
                            ${data.rarity.toUpperCase()}
                        </div>
                        <p class="popup-badge-description">${data.description}</p>
                    </div>
                </div>
                
                <div class="popup-footer">
                    <button class="popup-continue-btn">CONTINUE</button>
                </div>
                
                <div class="glitch glitch-1"></div>
                <div class="glitch glitch-2"></div>
            </div>
        `;
    } else if (data.type === 'rankup') {
        content = `
            <div class="popup-overlay"></div>
            <div class="popup-window">
                <div class="popup-glow"></div>
                
                <div class="popup-header">
                    <span class="popup-line"></span>
                    <span class="popup-label">RANK UP</span>
                    <span class="popup-line"></span>
                </div>
                
                <div class="popup-content rank-up-content">
                    <div class="rank-progression">
                        <div class="rank-from">${data.fromRank}</div>
                        <div class="rank-arrow">→</div>
                        <div class="rank-to" style="color: ${data.rankColor};">${data.toRank}</div>
                    </div>
                    <p class="popup-message">${data.message}</p>
                </div>
                
                <div class="popup-footer">
                    <button class="popup-continue-btn">CONTINUE</button>
                </div>
                
                <div class="glitch glitch-1"></div>
                <div class="glitch glitch-2"></div>
            </div>
        `;
    } else if (data.type === 'perfect-clear') {
        content = `
            <div class="popup-overlay"></div>
            <div class="popup-window">
                <div class="popup-glow"></div>
                
                <div class="popup-header">
                    <span class="popup-line"></span>
                    <span class="popup-label">PERFECT CLEAR</span>
                    <span class="popup-line"></span>
                </div>
                
                <div class="popup-content perfect-clear-content">
                    <div class="popup-icon" style="color: #FFD700; font-size: 60px;">
                        ✨
                    </div>
                    <p class="popup-message">No mistake detected.</p>
                    <p class="popup-message-secondary">Your mastery has increased.</p>
                </div>
                
                <div class="popup-footer">
                    <button class="popup-continue-btn">CONTINUE</button>
                </div>
                
                <div class="glitch glitch-1"></div>
                <div class="glitch glitch-2"></div>
            </div>
        `;
    } else if (data.type === 'quest-clear') {
        content = `
            <div class="popup-overlay"></div>
            <div class="popup-window">
                <div class="popup-glow"></div>
                
                <div class="popup-header">
                    <span class="popup-line"></span>
                    <span class="popup-label">${data.title}</span>
                    <span class="popup-line"></span>
                </div>
                
                <div class="popup-content quest-clear-content">
                    <p class="popup-message">${data.message}</p>
                </div>
                
                <div class="popup-footer">
                    <button class="popup-continue-btn">CONTINUE</button>
                </div>
                
                <div class="glitch glitch-1"></div>
                <div class="glitch glitch-2"></div>
            </div>
        `;
    }
    
    popup.innerHTML = content;
    
    // Add click handler
    const continueBtn = popup.querySelector('.popup-continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            popup.classList.remove('popup-active');
        });
    }
    
    return popup;
}

/**
 * Display Badge Unlock Popup
 */
function showBadgeUnlockPopup(badgeId) {
    const badge = BADGE_DEFINITIONS[badgeId];
    if (!badge) return;
    
    displayCinematicPopup({
        type: 'badge',
        title: 'ACHIEVEMENT UNLOCKED',
        badgeName: badge.name,
        description: badge.description,
        rarity: badge.rarity,
        icon: badge.icon,
        color: badge.color
    });
}

/**
 * Display Rank Up Popup
 */
function showRankUpPopup(fromRank, toRank) {
    const rankColors = {
        'E': '#64B5F6',
        'D': '#BB86FC',
        'C': '#00BCD4',
        'B': '#7C3AED',
        'A': '#FFD700',
        'S': '#00FFFF'
    };
    
    displayCinematicPopup({
        type: 'rankup',
        fromRank: `Rank ${fromRank}`,
        toRank: `Rank ${toRank}`,
        rankColor: rankColors[toRank] || '#00FFFF',
        message: 'Your study power has evolved.'
    });
}

/**
 * Display Perfect Clear Popup
 */
function showPerfectClearPopup() {
    displayCinematicPopup({
        type: 'perfect-clear',
        title: 'PERFECT CLEAR'
    });
}

/**
 * Display Boss Quest Complete Popup
 */
function showBossQuestCompletePopup() {
    displayCinematicPopup({
        type: 'quest-clear',
        title: 'BOSS QUEST CLEARED',
        message: 'You have overcome a high-level quest.'
    });
}
