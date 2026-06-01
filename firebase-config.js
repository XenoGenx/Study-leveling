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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firestore reference
const db = firebase.firestore();
const auth = firebase.auth();

// ========================================
// FIREBASE REALTIME SYNC
// ========================================

let currentUser = null;
let currentUserID = null;

/**
 * ตั้งค่า Auto Login เมื่อเข้าเว็บ
 */
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

/**
 * สมัครสมาชิก + ล็อกอินด้วย Email
 */
function registerAndLogin(hunterName, email = null) {
    return new Promise((resolve, reject) => {
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
    return auth.signOut().then(() => {
        currentUser = null;
        currentUserID = null;
        console.log('❌ ล็อกเอาท์สำเร็จ');
    });
}
