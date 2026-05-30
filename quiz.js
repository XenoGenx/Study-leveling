/* ========================================
   QUIZ - KNOWLEDGE TRIAL
   Manual quiz creation and scoring
   ======================================== */

let quizData = null;
let currentQuestionIndex = 0;
let userAnswers = [];

document.addEventListener('DOMContentLoaded', () => {
    initializeQuiz();
});

function initializeQuiz() {
    const currentQuest = JSON.parse(sessionStorage.getItem('currentQuest')) || {};
    const readingTime = parseInt(sessionStorage.getItem('readingTime')) || 0;
    
    if (!currentQuest.questName) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    const quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) return;
    
    // Check if quiz already created
    const existingQuiz = sessionStorage.getItem('quizData');
    
    if (existingQuiz) {
        // Display existing quiz
        quizData = JSON.parse(existingQuiz);
        displayQuiz();
    } else {
        // Show options to create or skip
        showQuizOptions(quizContainer);
    }
}

function showQuizOptions(container) {
    container.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <p style="font-size: 1.1rem; margin-bottom: 30px; color: var(--text-secondary);">
                Do you want to create a Knowledge Trial to test your understanding?
            </p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <button id="createQuizBtn" class="btn-quiz btn-submit">
                    CREATE TRIAL
                </button>
                <button id="skipQuizBtn" class="btn-quiz btn-skip">
                    SKIP TRIAL
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('createQuizBtn').addEventListener('click', startQuizCreation);
    document.getElementById('skipQuizBtn').addEventListener('click', skipQuiz);
}

function startQuizCreation() {
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = `
        <div id="quizForm">
            <p style="margin-bottom: 25px; color: var(--text-secondary);">
                Create 5 questions to test your knowledge:
            </p>
        </div>
    `;
    
    const form = document.getElementById('quizForm');
    
    for (let i = 1; i <= 5; i++) {
        form.innerHTML += `
            <div class="question-card" style="margin-bottom: 25px;">
                <div class="question-number">Question ${i}</div>
                <div class="form-group">
                    <label class="form-label">Question Text</label>
                    <input type="text" class="form-input question-text" placeholder="Ask a question..." maxlength="200">
                </div>
                <div class="form-group">
                    <label class="form-label">Correct Answer</label>
                    <input type="text" class="form-input correct-answer" placeholder="What is the correct answer?" maxlength="100">
                </div>
                <div class="form-group">
                    <label class="form-label">Options (A, B, C, D)</label>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <input type="text" class="form-input option-a" placeholder="Option A" maxlength="100">
                        <input type="text" class="form-input option-b" placeholder="Option B" maxlength="100">
                        <input type="text" class="form-input option-c" placeholder="Option C" maxlength="100">
                        <input type="text" class="form-input option-d" placeholder="Option D" maxlength="100">
                    </div>
                </div>
            </div>
        `;
    }
    
    form.innerHTML += `
        <div class="quiz-actions" style="margin-top: 30px;">
            <button id="submitQuizBtn" class="btn-quiz btn-submit">SUBMIT TRIAL</button>
            <button id="resetQuizBtn" class="btn-quiz btn-skip">RESET FORM</button>
        </div>
    `;
    
    document.getElementById('submitQuizBtn').addEventListener('click', submitQuizCreation);
    document.getElementById('resetQuizBtn').addEventListener('click', () => startQuizCreation());
}

function submitQuizCreation() {
    const questionCards = document.querySelectorAll('.question-card');
    quizData = { questions: [] };
    
    questionCards.forEach((card, index) => {
        const questionText = card.querySelector('.question-text').value.trim();
        const correctAnswer = card.querySelector('.correct-answer').value.trim();
        const optionA = card.querySelector('.option-a').value.trim();
        const optionB = card.querySelector('.option-b').value.trim();
        const optionC = card.querySelector('.option-c').value.trim();
        const optionD = card.querySelector('.option-d').value.trim();
        
        if (!questionText || !correctAnswer || !optionA || !optionB || !optionC || !optionD) {
            alert(`⚠️ Question ${index + 1} is incomplete!`);
            return;
        }
        
        quizData.questions.push({
            question: questionText,
            correctAnswer: correctAnswer,
            options: [optionA, optionB, optionC, optionD]
        });
    });
    
    if (quizData.questions.length === 5) {
        sessionStorage.setItem('quizData', JSON.stringify(quizData));
        displayQuiz();
    }
}

function displayQuiz() {
    if (!quizData || !quizData.questions) {
        window.location.href = 'result.html';
        return;
    }
    
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = '';
    
    quizData.questions.forEach((q, index) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.innerHTML = `
            <div class="question-number">Question ${index + 1} of ${quizData.questions.length}</div>
            <div class="question-text">${q.question}</div>
            <div class="options-group">
                ${q.options.map((opt, idx) => `
                    <button class="option-btn" data-index="${idx}" data-question="${index}" data-answer="${opt}">
                        ${String.fromCharCode(65 + idx)}. ${opt}
                    </button>
                `).join('')}
            </div>
        `;
        quizContainer.appendChild(card);
    });
    
    // Add action buttons
    const actions = document.createElement('div');
    actions.className = 'quiz-actions';
    actions.innerHTML = `
        <button id="submitAnswersBtn" class="btn-quiz btn-submit">SUBMIT ANSWERS</button>
        <button id="skipAnswersBtn" class="btn-quiz btn-skip">SKIP TRIAL</button>
    `;
    quizContainer.appendChild(actions);
    
    // Setup option selection
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const questionIndex = parseInt(this.dataset.question);
            const selectedAnswer = this.dataset.answer;
            
            // Deselect previous answer for this question
            document.querySelectorAll(`[data-question="${questionIndex}"]`).forEach(b => {
                b.classList.remove('selected');
            });
            
            // Select current answer
            this.classList.add('selected');
            userAnswers[questionIndex] = selectedAnswer;
        });
    });
    
    document.getElementById('submitAnswersBtn').addEventListener('click', calculateQuizScore);
    document.getElementById('skipAnswersBtn').addEventListener('click', skipQuiz);
}

function calculateQuizScore() {
    let correctCount = 0;
    
    quizData.questions.forEach((q, index) => {
        if (userAnswers[index] && userAnswers[index].toLowerCase() === q.correctAnswer.toLowerCase()) {
            correctCount++;
        }
    });
    
    const percentage = Math.round((correctCount / quizData.questions.length) * 100);
    sessionStorage.setItem('quizPercentage', percentage);
    
    console.log(`✅ Quiz completed! Score: ${percentage}%`);
    window.location.href = 'result.html';
}

function skipQuiz() {
    sessionStorage.setItem('quizPercentage', '0');
    sessionStorage.setItem('quizSkipped', 'true');
    console.log('⏭️ Quiz skipped');
    window.location.href = 'result.html';
}
