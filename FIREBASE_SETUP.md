## 🎉 Firebase Integration - Setup Guide

โปรแกรมของคุณตอนนี้ได้ใช้ **Firebase** สำหรับการซิงค์ข้อมูลข้ามอุปกรณ์แล้ว!

---

## 📋 ขั้นตอนติดตั้ง (Setup)

### **ขั้นตอนที่ 1: สร้าง Firebase Project**

1. ไปที่ https://console.firebase.google.com
2. คลิก **"Create a new project"**
3. ตั้งชื่อ: `study-leveling-system`
4. ปิด Google Analytics (ไม่จำเป็น)
5. คลิก **"Create project"** แล้วรอ 1-2 นาที

---

### **ขั้นตอนที่ 2: สร้าง Web App**

1. ใน Firebase Console ให้คลิก **"< >"** (Web app)
2. ตั้งชื่อแอป: `study-leveling-web`
3. คลิก **"Register app"**
4. Firebase จะแสดง **Configuration Code** แบบนี้:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "study-leveling-system.firebaseapp.com",
    projectId: "study-leveling-system",
    storageBucket: "study-leveling-system.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456ghi789jkl"
};
```

---

### **ขั้นตอนที่ 3: นำ Config ไปใส่ใน firebase-config.js**

1. เปิดไฟล์ `firebase-config.js` ในโปรแกรมของคุณ
2. แทนที่ `firebaseConfig` ด้วย Config ที่คัดลอกมาจาก Firebase Console

```javascript
const firebaseConfig = {
    apiKey: "ใส่ของจริงตรงนี้",
    authDomain: "ใส่ของจริงตรงนี้",
    // ... และอื่นๆ
};
```

3. บันทึกไฟล์

---

### **ขั้นตอนที่ 4: เปิด Authentication**

1. ใน Firebase Console ไปที่ **"Authentication"**
2. คลิก **"Get started"**
3. หา **"Email/Password"** และคลิก Enable
4. คลิก **"Save"**

---

### **ขั้นตอนที่ 5: เปิด Firestore Database**

1. ไปที่ **"Firestore Database"** ใน Firebase Console
2. คลิก **"Create database"**
3. เลือก **"Start in test mode"** (สำหรับทดลอง)
4. เลือก Region ที่ใกล้ที่สุด
5. คลิก **"Create"**

---

### **ขั้นตอนที่ 6: ตั้งค่า Security Rules (ข้ามได้หากอยู่ Test Mode)**

ถ้าต้องการความปลอดภัยสูงขึ้น ให้ไปที่ **Rules** tab และแทนที่ด้วย:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // อนุญาตให้ user ปัจจุบันเท่านั้นอ่าน/เขียนข้อมูลตัวเอง
    match /players/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // อนุญาตทุกคนอ่าน leaderboard
    match /leaderboard/{document=**} {
      allow read: if true;
    }
  }
}
```

---

## ✅ ตรวจสอบว่า Setup สำเร็จ

1. รัน `python -m http.server 8000` ในโฟลเดอร์โปรแกรม
2. เข้าไป http://localhost:8000
3. กรอกชื่อผู้ใช้และคลิก "Enter Gate"
4. ถ้า**ไม่มี Error** ในหน้า Console → ✅ สำเร็จ!

---

## 📱 ทดสอบการซิงค์ข้อมูล

1. เล่นใน Desktop → ได้ประสบการณ์และเสริมสกิล
2. เปิดเว็บใน Mobile → **ข้อมูลจะอัปเดตแบบ Real-time** ✨

---

## 🔒 Security Tips

- 🚫 **อย่า**เปิด Public ก่อนตั้ง Security Rules ที่เหมาะสม
- ✅ ใช้ Test Mode สำหรับการทดลอง
- 🔐 เมื่อ Production ให้ตั้ง Custom Rules

---

## 💰 ค่าใช้จ่าย

**Firebase Spark Plan (ฟรี):**
- ✅ Authentication Unlimited
- ✅ Firestore 1GB Storage
- ✅ 50,000 ครั้ง/วัน
- ✅ ไม่ต้องบัตรเครดิต

---

## ❓ FAQ

**Q: ข้อมูลเก่า localStorage หายไปหรือไม่?**
A: ไม่ข้อมูลเก่ายังอยู่ใน localStorage โปรแกรมจะใช้ Firebase เป็นลำดับแรก ถ้าไม่ได้ล็อกอิน จะ Fallback ไป localStorage

**Q: ต้องสมัครสมาชิกหรือไม่?**
A: ไม่ต้อง! คุณสามารถล็อกอินด้วยชื่อผู้ใช้เพียงชื่อเดียว (ระบบจะสร้างบัญชี Firebase โดยอัตโนมัติ)

**Q: สามารถเปลี่ยน Config ใหม่ได้หรือไม่?**
A: ได้ เพียงแก้ไข `firebaseConfig` ใน `firebase-config.js` และรีเฟรชเว็บ

---

## 🆘 Troubleshooting

**เข้าเว็บแล้ว Error: "auth/invalid-api-key"**
- ✅ ตรวจสอบว่า apiKey ถูกต้องใน firebase-config.js

**ข้อมูลไม่บันทึก**
- ✅ ตรวจสอบ Console (F12) มี Error หรือไม่
- ✅ ตรวจสอบว่า Firestore Database สร้างแล้ว
- ✅ ตรวจสอบ Internet Connection

**ต้องการเปลี่ยนกลับไป localStorage**
- แปลง `script.js` กลับตามปกติ (เอา Firebase ออก)

---

🎉 **เสร็จแล้ว! ข้อมูลของคุณตอนนี้ซิงค์ทั้งมือถือและคอมแล้ว!**
