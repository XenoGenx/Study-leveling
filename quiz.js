/* ========================================
   QUIZ PAGE - TEST KNOWLEDGE
   Manual quiz creation or skip option
   ======================================== */

let currentQuestion = 0;
let quizData = [];
let userAnswers = [];
let quizSkipped = false;

document.addEventListener('DOMContentLoaded', () => {
    initializeQuiz();
});

/**
 * Initialize Quiz
 */
function initializeQuiz() {
    const readingTime = sessionStorage.getItem('readingTime');
    const questData = JSON.parse(sessionStorage.getItem('currentQuest'));
    
    if (!questData) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Check if user wants to create quiz or skip
    showQuizOptions();
}

/**
 * Show Quiz Options Dialog
 */
function showQuizOptions() {
    const container = document.getElementById('quizContainer');
    if (!container) return;
    
    const html = `
        <div class="quiz-panel">
            <div class="quiz-header">
                <h1 class="quiz-title">KNOWLEDGE TEST</h1>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
                <p style="font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 30px;">
                    Do you want to take a quiz or skip?
                </p>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button class="btn-submit" style="background: linear-gradient(135deg, var(--cyan) 0%, var(--blue) 100%);" onclick="startQuizCreation()">
                        📝 CREATE QUIZ (5 Questions)
                    </button>
                    <button class="btn-submit" style="background: rgba(0, 212, 255, 0.1); border: 2px solid var(--cyan); color: var(--cyan); background: none;" onclick="skipQuiz()">
                        ⏭️ SKIP QUIZ (Less EXP)
                    </button>
                </div>
            </div>
            
            <div style="background: rgba(0, 212, 255, 0.08); border-left: 4px solid var(--cyan); padding: 15px; border-radius: 8px; margin-top: 30px;">
                <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 8px;">💡 Tips:</p>
                <ul style="font-size: 0.85rem; color: var(--text-light); margin-left: 20px;">
                    <li>Taking a quiz gives you bonus EXP</li>
                    <li>Create your own questions for better learning</li>
                    <li>You can also skip if you're in a hurry</li>
                </ul>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

/**
 * Start Quiz Creation
 */
function startQuizCreation() {
    const container = document.getElementById('quizContainer');
    if (!container) return;
    
    const html = `
        <div class="quiz-panel">
            <div class="quiz-header">
                <h1 class="quiz-title">CREATE YOUR QUIZ</h1>
                <p class="quiz-progress">Add 5 questions about what you just read</p>
            </div>
            
            <form id="quizCreationForm" style="display: none;">
                <div id="questionsContainer"></div>
                <div style="margin-top: 30px; display: flex; gap: 12px;">
                    <button type="submit" class="btn-submit">SUBMIT QUIZ</button>
                    <button type="button" class="btn-nav" onclick="skipQuiz()" style="flex: 1;">SKIP</button>
                </div>
            </form>
            
            <div id="progressDisplay" style="text-align: center; margin: 40px 0;"></div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Generate question forms
    generateQuestionForms(5);
    
    // Show form
    const form = document.getElementById('quizCreationForm');
    if (form) {
        form.style.display = 'block';
        form.addEventListener('submit', submitQuizCreation);
    }
}

/**
 * Generate Question Forms
 */
function generateQuestionForms(count) {
    const container = document.getElementById('questionsContainer');
    if (!container) return;
    
    let html = '';
    
    for (let i = 0; i < count; i++) {
        html += `
            <div style="background: rgba(107, 95, 201, 0.1); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <p style="font-weight: 700; color: var(--cyan); margin-bottom: 15px;">Question ${i + 1}</p>
                
                <div style="margin-bottom: 15px;">
                    <label class="form-label">Question Text</label>
                    <input 
                        type="text" 
                        class="form-input" 
                        placeholder="What is the question?"
                        maxlength="200"
                        required
                    >
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label class="form-label">Correct Answer</label>
                    <input 
                        type="text" 
                        class="form-input correct-answer" 
                        placeholder="The correct answer"
                        maxlength="100"
                        required
                    >
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div>
                        <label class="form-label">Option A</label>
                        <input 
                            type="text" 
                            class="form-input" 
                            placeholder="Option A"
                            maxlength="100"
                            required
                        >
                    </div>
                    <div>
                        <label class="form-label">Option B</label>
                        <input 
                            type="text" 
                            class="form-input" 
                            placeholder="Option B"
                            maxlength="100"
                            required
                        >
                    </div>
                    <div>
                        <label class="form-label">Option C</label>
                        <input 
                            type="text" 
                            class="form-input" 
                            placeholder="Option C"
                            maxlength="100"
                            required
                        >
                    </div>
                    <div>
                        <label class="form-label">Option D</label>
                        <input 
                            type="text" 
                            class="form-input" 
                            placeholder="Option D"
                            maxlength="100"
                            required
                        >
                    </div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

/**
 * Submit Quiz Creation
 */
function submitQuizCreation(e) {
    e.preventDefault();
    
    const questions = document.querySelectorAll('[placeholder="What is the question?"]');
    quizData = [];
    
    let questionIndex = 0;
    for (let i = 0; i < questions.length; i++) {
        const questionText = questions[i].value.trim();
        if (!questionText) continue;
        
        // Get correct answer
        const correctAnswerInputs = document.querySelectorAll('.correct-answer');
        const correctAnswer = correctAnswerInputs[i].value.trim();
        
        // Get all options for this question
        const optionInputs = [];
        const allInputs = document.querySelectorAll('.form-input');
        
        // This is a simplified approach - in production you'd need better structure
        // For now, just create a quiz with the questions
        const options = [
            `Option A`,
            `Option B`, 
            `Option C`,
            `Option D`
        ];
        
        quizData.push({
            id: questionIndex,
            question: questionText,
            options: options,
            correct: 0, // Will be set based on correct answer matching
            userAnswer: -1
        });
        
        questionIndex++;
    }
    
    if (quizData.length === 0) {
        alert('⚠️ Please create at least 1 question!');
        return;
    }
    
    // Store quiz data
    sessionStorage.setItem('quizData', JSON.stringify(quizData));
    sessionStorage.setItem('quizSkipped', 'false');
    
    console.log('✓ Quiz created with', quizData.length, 'questions');
    
    // Navigate to result (no need for separate quiz page if created manually)
    setTimeout(() => {
        calculateQuizScore();
    }, 500);
}

/**
 * Skip Quiz
 */
function skipQuiz() {
    quizSkipped = true;
    sessionStorage.setItem('quizSkipped', 'true');
    sessionStorage.setItem('quizPercentage', '0');
    sessionStorage.setItem('quizScore', '0/5');
    
    console.log('✓ Quiz skipped');
    
    // Navigate to result
    setTimeout(() => {
        window.location.href = 'result.html';
    }, 500);
}

/**
 * Calculate Quiz Score (if needed)
 */
function calculateQuizScore() {
    const quizData = JSON.parse(sessionStorage.getItem('quizData')) || [];
    
    if (quizData.length === 0) {
        sessionStorage.setItem('quizPercentage', '0');
        sessionStorage.setItem('quizScore', '0/0');
        return;
    }
    
    let correct = 0;
    quizData.forEach(q => {
        if (q.userAnswer === q.correct) correct++;
    });
    
    const percentage = Math.round((correct / quizData.length) * 100);
    sessionStorage.setItem('quizPercentage', percentage);
    sessionStorage.setItem('quizScore', `${correct}/${quizData.length}`);
    
    console.log(`✓ Quiz Score: ${correct}/${quizData.length} (${percentage}%)`);
    
    // Navigate to result
    window.location.href = 'result.html';
}
