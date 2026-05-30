/* ========================================
   STUDY GATE SYSTEM - QUIZ PAGE SCRIPT
   ======================================== */

// Quiz System
let currentQuestionIndex = 0;
let userAnswers = {};
let currentPlayer = null;
let currentChapter = null;
let quizData = null;

// ข้อสอบแต่ละบท
const quizzes = {
    respiratory: {
        title: 'ระบบหายใจ - QUIZ',
        questions: [
            {
                q: 'ส่วนใดของระบบหายใจที่ทำหน้าที่แลกเปลี่ยนแก๊สออกซิเจนและคาร์บอนไดออกไซด์?',
                opts: ['หลอดลม', 'ปอด', 'เยื่อบุ', 'ลำคอ'],
                ans: 1
            },
            {
                q: 'กระบวนการไหลเข้าของอากาศเรียกว่า',
                opts: ['ออกแบบ', 'หายใจเข้า', 'หายใจออก', 'แลกเปลี่ยนแก๊ส'],
                ans: 1
            },
            {
                q: 'ส่วนใดที่ช่วยให้ปอดขยายตัวและหดตัว?',
                opts: ['หัวใจ', 'กะบังลม', 'ตับ', 'ม้ามธี่'],
                ans: 1
            },
            {
                q: 'ออกซิเจนที่แลกเปลี่ยนในปอดจะไปที่ส่วนไหน?',
                opts: ['เคราะห์', 'ม้าม', 'หัวใจ', 'สมอง'],
                ans: 2
            },
            {
                q: 'การหายใจแบบปกติในคนเต็มวัยเป็นครั้งต่อนาทีประมาณกี่ครั้ง?',
                opts: ['5-10 ครั้ง', '12-20 ครั้ง', '30-40 ครั้ง', '50-60 ครั้ง'],
                ans: 1
            }
        ]
    },
    chemical: {
        title: 'พันธะเคมี - QUIZ',
        questions: [
            {
                q: 'พันธะเคมีประเภทใดเกิดจากการแบ่งปันอิเล็กตรอน?',
                opts: ['พันธะโคเวเลนต์', 'พันธะไอออนิก', 'พันธะโลหะ', 'พันธะไฮโดรเจน'],
                ans: 0
            },
            {
                q: 'สารประกอบไหนเป็นอิเล็กโตรไลต์ที่แข็งแกร่ง?',
                opts: ['กลูโคส', 'เกลือแกง', 'เอธานอล', 'เบนซีน'],
                ans: 1
            },
            {
                q: 'พันธะไฮโดรเจนพบมากที่สุดในสารประกอบชนิดใด?',
                opts: ['เนื้อหา', 'โปรตีน', 'นิวคลีอาซิด', 'ลิปิด'],
                ans: 1
            },
            {
                q: 'อะตอมใดที่มีการรั่วไหลอิเล็กตรอนมากที่สุดในโมเลกุลน้ำ?',
                opts: ['ไฮโดรเจน', 'ออกซิเจน', 'เหล็ก', 'ไนโตรเจน'],
                ans: 1
            },
            {
                q: 'สูตรเคมีของเกลือแกงคือ',
                opts: ['H2O', 'NaCl', 'CO2', 'O2'],
                ans: 1
            }
        ]
    },
    probability: {
        title: 'ความน่าจะเป็น - QUIZ',
        questions: [
            {
                q: 'ความน่าจะเป็นของเหตุการณ์ที่แน่นอนว่าจะเกิดขึ้นคือเท่าใด?',
                opts: ['0', '0.5', '1', '2'],
                ans: 2
            },
            {
                q: 'การโยนลูกเต๋า 1 ลูก ความน่าจะเป็นที่ได้เลข 3 คือ',
                opts: ['1/6', '2/6', '3/6', '4/6'],
                ans: 0
            },
            {
                q: 'มีเหตุการณ์ A และ B ที่เป็นเหตุการณ์อิสระ P(A)=0.3 P(B)=0.4 P(A∩B) คือ',
                opts: ['0.12', '0.7', '0.34', '0.1'],
                ans: 0
            },
            {
                q: 'ความน่าจะเป็นของสหภาพของสองเหตุการณ์ P(A∪B) = ',
                opts: ['P(A) + P(B)', 'P(A) × P(B)', 'P(A) + P(B) - P(A∩B)', 'P(A∩B)'],
                ans: 2
            },
            {
                q: 'สุ่มหยิบการ์ดจากสำรับ 52 ใบ ความน่าจะเป็นที่ได้โพดำคือ',
                opts: ['1/52', '4/52', '13/52', '26/52'],
                ans: 2
            }
        ]
    },
    vocabulary: {
        title: 'Vocabulary - QUIZ',
        questions: [
            {
                q: 'คำว่า "Persevere" แปลว่า',
                opts: ['พยายามต่ออย่างเสียสละ', 'หนีไป', 'ลังเล', 'ทำลาย'],
                ans: 0
            },
            {
                q: 'คำตรงข้าม (Antonym) ของ "Abundant" คือ',
                opts: ['มากมาย', 'ขาดแคลน', 'ทันที', 'ง่ายดาย'],
                ans: 1
            },
            {
                q: '"Meticulous" หมายถึง',
                opts: ['ประมาท', 'ระมัดระวังและละเอียด', 'เร็ว', 'ยุ่งวุ่นวาย'],
                ans: 1
            },
            {
                q: 'คำว่า "Benevolent" แปลว่า',
                opts: ['ใจดี', 'โกรธ', 'ถูกต้อง', 'เปื่อยปลื้ม'],
                ans: 0
            },
            {
                q: '"Eloquent" หมายถึง',
                opts: ['ประเทือง', 'พูดได้สำนึก', 'นิ่งเงียบ', 'หยาบคาย'],
                ans: 1
            }
        ]
    }
};

// โหลดข้อมูล
window.addEventListener('load', () => {
    const playerName = localStorage.getItem('currentPlayer');
    const chapter = localStorage.getItem('sessionChapter');

    if (!playerName || !chapter) {
        window.location.href = 'dashboard.html';
        return;
    }

    const players = JSON.parse(localStorage.getItem('players')) || {};
    currentPlayer = players[playerName];
    currentChapter = chapter;

    if (!currentPlayer) {
        window.location.href = 'index.html';
        return;
    }

    // ตั้งค่า Quiz
    quizData = quizzes[chapter];
    if (!quizData) {
        alert('ไม่พบเควสนี้');
        window.location.href = 'dashboard.html';
        return;
    }

    document.getElementById('chapterTitle').textContent = quizData.title;
    document.getElementById('totalQuestions').textContent = quizData.questions.length;
    
    loadQuestion(0);
    updateProgressBar();
});

// โหลดคำถาม
function loadQuestion(index) {
    if (index < 0 || index >= quizData.questions.length) return;

    currentQuestionIndex = index;
    const question = quizData.questions[index];

    document.getElementById('currentQuestion').textContent = index + 1;
    document.getElementById('questionCounter').textContent = index + 1;
    document.getElementById('questionText').textContent = question.q;

    // ล้างการเลือกเก่า
    document.querySelectorAll('input[name="answer"]').forEach(input => input.checked = false);

    // โหลดตัวเลือก
    question.opts.forEach((opt, i) => {
        document.getElementById(`optLabel${i}`).textContent = opt;
    });

    // ตั้งค่าปุ่ม
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').style.display = index === quizData.questions.length - 1 ? 'none' : 'block';
    document.getElementById('submitBtn').style.display = index === quizData.questions.length - 1 ? 'block' : 'none';

    // ถ้าเคยตอบแล้ว ให้แสดงคำตอบเก่า
    if (userAnswers[index] !== undefined) {
        document.getElementById(`opt${userAnswers[index]}`).checked = true;
    }

    updateProgressBar();
}

// Previous Button
document.getElementById('prevBtn').addEventListener('click', () => {
    saveCurrentAnswer();
    loadQuestion(currentQuestionIndex - 1);
});

// Next Button
document.getElementById('nextBtn').addEventListener('click', () => {
    saveCurrentAnswer();
    loadQuestion(currentQuestionIndex + 1);
});

// Submit Button
document.getElementById('submitBtn').addEventListener('click', () => {
    saveCurrentAnswer();
    submitQuiz();
});

// บันทึกคำตอบ
function saveCurrentAnswer() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (selected) {
        userAnswers[currentQuestionIndex] = parseInt(selected.value);
    }
}

// ส่งข้อสอบ
function submitQuiz() {
    // คำนวณคะแนน
    let score = 0;
    quizData.questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.ans) {
            score++;
        }
    });

    const totalQuestions = quizData.questions.length;
    const percentage = (score / totalQuestions) * 100;

    // บันทึกข้อมูล
    localStorage.setItem('quizScore', score.toString());
    localStorage.setItem('quizTotal', totalQuestions.toString());
    localStorage.setItem('quizPercentage', percentage.toString());

    // ไปหน้า Result
    window.location.href = 'result.html';
}

// Update Progress Bar
function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}
