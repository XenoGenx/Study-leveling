/* ========================================
   FIREBASE CONFIGURATION
   Cloud Storage & Authentication
   ======================================== */

// Firebase SDK
const firebaseConfig = {
    apiKey: "AIzaSyB2mL9x8pQr3vN5kL2jH4gD6fX9wE1yZ3K",
    authDomain: "study-leveling-system.firebaseapp.com",
    projectId: "study-leveling-system",
    storageBucket: "study-leveling-system.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456ghi789jkl"
};

// Initialize Firebase - Wait until Firebase SDK is loaded
let db, auth;

function initializeFirebase() {
    if (typeof firebase === 'undefined') {
        console.warn('⚠️ Firebase SDK not loaded yet, retrying...');
        setTimeout(initializeFirebase, 100);
        return;
    }
    
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.firestore();
        auth = firebase.auth();
        console.log('✅ Firebase initialized successfully');
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
    }
}

// Start initialization
initializeFirebase();

// Setup auth listener after a small delay to ensure initialization
setTimeout(setupAuthStateListener, 200);

// ========================================
// FIREBASE REALTIME SYNC
// ========================================

let currentUser = null;
let currentUserID = null;

// Setup auth state listener once Firebase is initialized
function setupAuthStateListener() {
    if (typeof auth === 'undefined') {
        console.warn('⚠️ Auth not ready, retrying auth listener setup...');
        setTimeout(setupAuthStateListener, 100);
        return;
    }
    
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user.email;
            currentUserID = user.uid;
            console.log('✅ ล็อกอินอยู่:', user.email);
            
            // อัปเดต UI ให้ดูเหมือนล็อกอินแล้ว
            const nameInput = document.getElementById('hunterNameInput');
            if (nameInput) {
                nameInput.value = user.displayName || user.email.split('@')[0];
                nameInput.disabled = true;
            }
        } else {
            currentUser = null;
            currentUserID = null;
            console.log('❌ ยังไม่ล็อกอิน');
        }
    });
}

/**
 * สมัครสมาชิก + ล็อกอินด้วย Email
 */
function registerAndLogin(hunterName, email = null) {
    return new Promise((resolve, reject) => {
        // Wait for auth to be initialized
        if (typeof auth === 'undefined') {
            console.warn('⚠️ Auth not initialized, retrying...');
            setTimeout(() => registerAndLogin(hunterName, email).then(resolve).catch(reject), 200);
            return;
        }
        
        // ถ้าไม่มี email ให้สร้างจากชื่อ
        const userEmail = email || hunterName.toLowerCase() + '@studyleveling.local';
        const userPassword = 'StudentHunter123!'; // Password ชั่วคราว
        
        // สมัครสมาชิก
        auth.createUserWithEmailAndPassword(userEmail, userPassword)
            .then(userCredential => {
                // ตั้งชื่อผู้ใช้
                return userCredential.user.updateProfile({
                    displayName: hunterName
                });
            })
            .then(() => {
                console.log('✅ สมัครสมาชิกสำเร็จ:', hunterName);
                resolve();
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    // ล็อกอินเข้าบัญชีเก่า
                    auth.signInWithEmailAndPassword(userEmail, userPassword)
                        .then(() => {
                            console.log('✅ ล็อกอินสำเร็จ:', hunterName);
                            resolve();
                        })
                        .catch(reject);
                } else {
                    reject(error);
                }
            });
    });
}

/**
 * ล็อกเอาท์
 */
function logoutUser() {
    return new Promise((resolve, reject) => {
        // Wait for auth to be initialized
        if (typeof auth === 'undefined') {
            console.warn('⚠️ Auth not initialized, retrying...');
            setTimeout(() => logoutUser().then(resolve).catch(reject), 200);
            return;
        }
        
        auth.signOut().then(() => {
            currentUser = null;
            currentUserID = null;
            console.log('❌ ล็อกเอาท์สำเร็จ');
            resolve();
        }).catch(reject);
    });
}
