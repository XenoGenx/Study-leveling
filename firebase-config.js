/* ========================================
   STORAGE CONFIGURATION
   Uses localStorage for data persistence
   (No Firebase - works offline)
   ======================================== */

// Storage API - using localStorage
let db = null;
let auth = null;
let currentUser = null;
let currentUserID = null;

function initializeStorage() {
    console.log('✅ Storage initialized with localStorage');
}

// Setup auth state listener (localStorage-based)
function setupAuthStateListener() {
    console.log('✅ Storage system ready (localStorage mode)');
}

/**
 * สมัครสมาชิก + ล็อกอินด้วย localStorage
 */
function registerAndLogin(hunterName, email = null) {
    return new Promise((resolve, reject) => {
        try {
            // Store player name in localStorage
            localStorage.setItem('currentPlayer', hunterName);
            
            // Initialize player data if doesn't exist
            const players = JSON.parse(localStorage.getItem('players')) || {};
            if (!players[hunterName]) {
                players[hunterName] = {
                    name: hunterName,
                    level: 1,
                    exp: 0,
                    totalReadingTime: 0,
                    completedQuests: 0,
                    badges: [],
                    createdAt: new Date().toISOString()
                };
                localStorage.setItem('players', JSON.stringify(players));
            }
            
            console.log('✅ สมัครสมาชิกสำเร็จ:', hunterName);
            resolve();
        } catch (error) {
            console.error('❌ Error during registration:', error);
            reject(error);
        }
    });
}

/**
 * ล็อกเอาท์
 */
function logoutUser() {
    return new Promise((resolve, reject) => {
        try {
            localStorage.removeItem('currentPlayer');
            sessionStorage.clear();
            console.log('✅ ล็อกเอาท์สำเร็จ');
            resolve();
        } catch (error) {
            console.error('❌ Error during logout:', error);
            reject(error);
        }
    });
}
