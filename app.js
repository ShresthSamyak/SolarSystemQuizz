// DOM Elements
const landingPage = document.getElementById('landing-page');
const quizInterface = document.getElementById('quiz-interface');
const scoreSummary = document.getElementById('score-summary');
const leaderboardScreen = document.getElementById('leaderboard');
const adminPanel = document.getElementById('admin-panel');

// Landing Page Elements
const planetButtons = document.querySelectorAll('.planet-btn');
const planetObjects = document.querySelectorAll('.planet-object');
const viewLeaderboardBtn = document.getElementById('view-leaderboard');
const startUsernameInput = document.getElementById('start-username');

// Quiz Interface Elements
const quizTopicElement = document.getElementById('quiz-topic');
const questionCounter = document.getElementById('current-question');
const timerElement = document.getElementById('timer');
const questionText = document.getElementById('question-text');
const optionsContainer = document.querySelector('.options-container');
const optionButtons = document.querySelectorAll('.option-btn');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackText = document.getElementById('feedback-text');
const progressFill = document.querySelector('.progress-fill');

// Score Summary Elements
const finalScoreElement = document.getElementById('final-score');
const correctCountElement = document.getElementById('correct-count');
const incorrectCountElement = document.getElementById('incorrect-count');
const displayUsernameElement = document.getElementById('display-username');
const submitScoreBtn = document.getElementById('submit-score');

// Leaderboard Elements
const leaderboardBody = document.getElementById('leaderboard-body');
const playAgainBtn = document.getElementById('play-again');

// Admin Panel Elements
const replaceQuestionsBtn = document.getElementById('replace-questions');
const confirmationDialog = document.getElementById('confirmation-dialog');
const confirmReplaceBtn = document.getElementById('confirm-replace');
const cancelReplaceBtn = document.getElementById('cancel-replace');
const adminStatus = document.getElementById('admin-status');
const backToLandingBtn = document.getElementById('back-to-landing');

// Game State Variables
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let timer;
let timeLeft = 30;
let currentUserName = '';
let currentPlanet = 'all'; // Default to all planets
let questions = []; // Will be populated based on planet selection

// Map of planets to their display names
const planetNames = {
    'sun': 'The Sun',
    'mercury': 'Mercury',
    'venus': 'Venus',
    'earth': 'Earth',
    'mars': 'Mars',
    'jupiter': 'Jupiter',
    'saturn': 'Saturn',
    'uranus': 'Uranus',
    'neptune': 'Neptune',
    'all': 'Solar System'
};

// Secret Admin Access - Press 'A' key three times to access
let adminKeyPresses = [];
const adminCode = ['a', 'a', 'a'];
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'a') {
        adminKeyPresses.push('a');
        if (adminKeyPresses.length > 3) {
            adminKeyPresses.shift();
        }
        if (adminKeyPresses.join('') === adminCode.join('')) {
            showScreen(adminPanel);
        }
    }
});

// Show a specific screen and hide others
function showScreen(screenToShow) {
    [landingPage, quizInterface, scoreSummary, leaderboardScreen, adminPanel].forEach(screen => {
        screen.classList.remove('active');
    });
    screenToShow.classList.add('active');
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Start the quiz for a specific planet
function startQuiz(planet = 'all') {
    // Get and validate username
    const username = startUsernameInput.value.trim();
    if (!username) {
        alert('Please enter your name before starting the quiz!');
        startUsernameInput.focus();
        return;
    }
    
    // Save username and planet for later
    currentUserName = username;
    currentPlanet = planet;
    
    // Reset game state
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    
    // Filter questions if a specific planet is selected
    if (planet === 'all') {
        questions = shuffleArray([...solarSystemQuestions]);
    } else {
        // For this demo, we'll just use all questions, but in a real app you could filter by planet
        // This would be where you'd implement planet-specific question filtering
        questions = shuffleArray([...solarSystemQuestions]);
        
        // Use all 25 questions instead of a smaller subset
        // No slice applied - all questions will be used
    }
    
    // Update quiz topic based on selected planet
    quizTopicElement.textContent = `${planetNames[planet]} Quiz`;
    
    // Show the quiz interface with a fade-in animation
    showScreen(quizInterface);
    
    // Load the first question
    loadQuestion();
}

// Load current question
function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    
    // Update question counter
    questionCounter.textContent = currentQuestionIndex + 1;
    
    // Update progress bar
    const progressPercentage = (currentQuestionIndex / questions.length) * 100;
    progressFill.style.width = `${progressPercentage}%`;
    
    // Set question text with a subtle animation
    questionText.classList.remove('fade-in');
    setTimeout(() => {
        questionText.textContent = currentQuestion.question;
        questionText.classList.add('fade-in');
    }, 50);
    
    // Reset option buttons
    optionButtons.forEach(button => {
        button.classList.remove('correct', 'incorrect', 'disabled', 'fade-in');
        setTimeout(() => {
            const option = button.getAttribute('data-option');
            button.textContent = `${option}: ${currentQuestion.options[option]}`;
            button.classList.add('fade-in');
        }, 100);
    });
    
    // Hide feedback
    feedbackContainer.classList.add('hidden');
    feedbackContainer.classList.remove('correct', 'incorrect');
    
    // Start the timer
    startTimer();
}

// Start the countdown timer
function startTimer() {
    // Reset timer
    clearInterval(timer);
    timeLeft = 30;
    timerElement.textContent = timeLeft;
    
    // Start countdown
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 10) {
            timerElement.style.color = '#ff1744';
        } else {
            timerElement.style.color = '#ff9800';
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleAnswer(null); // No answer selected, treat as incorrect
        }
    }, 1000);
}

// Handle answer selection
function handleAnswer(selectedOption) {
    clearInterval(timer);
    
    const currentQuestion = questions[currentQuestionIndex];
    const correctOption = currentQuestion.correctAnswer;
    
    optionButtons.forEach(button => {
        button.classList.add('disabled');
        const option = button.getAttribute('data-option');
        
        if (option === correctOption) {
            button.classList.add('correct');
        } else if (option === selectedOption && selectedOption !== correctOption) {
            button.classList.add('incorrect');
        }
    });
    
    // Show feedback
    feedbackContainer.classList.remove('hidden');
    
    if (selectedOption === correctOption) {
        feedbackText.textContent = "Correct! +4 points";
        feedbackContainer.classList.add('correct');
        score += 4;
        correctAnswers++;
    } else {
        feedbackText.textContent = selectedOption ? 
            "Incorrect! -1 point" : 
            "Time's up! -1 point";
        feedbackContainer.classList.add('incorrect');
        score -= 1;
        incorrectAnswers++;
    }
    
    // Ensure score doesn't go below 0
    score = Math.max(0, score);
    
    // Move to next question after delay
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 2000);
}

// End the quiz and show score summary
function endQuiz() {
    showScreen(scoreSummary);
    
    finalScoreElement.textContent = score;
    correctCountElement.textContent = correctAnswers;
    incorrectCountElement.textContent = incorrectAnswers;
    
    // Display the username that was captured at the start
    displayUsernameElement.textContent = currentUserName || 'Anonymous';
}

// Submit score to leaderboard
function submitScore() {
    // Username was already captured at the start of the quiz
    // No need to get it from an input field again
    
    // Get existing leaderboard from local storage
    let leaderboard = JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
    
    // Add new score
    leaderboard.push({ name: currentUserName, score: score });
    
    // Sort by score (highest first)
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top scores
    if (leaderboard.length > 100) {
        leaderboard = leaderboard.slice(0, 100);
    }
    
    // Save to local storage
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
    
    // Show leaderboard
    displayLeaderboard();
}

// Display the leaderboard
function displayLeaderboard() {
    // Clear previous entries
    leaderboardBody.innerHTML = '';
    
    // Get leaderboard data
    const leaderboard = JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
    
    // Create and append rows
    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        
        // Highlight current user
        if (entry.name === currentUserName) {
            row.classList.add('current-user');
        }
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
        `;
        
        leaderboardBody.appendChild(row);
    });
    
    // Show leaderboard screen
    showScreen(leaderboardScreen);
}

// Admin function: Replace questions
function replaceQuestions() {
    // Show confirmation dialog
    confirmationDialog.classList.remove('hidden');
}

function confirmReplaceQuestions() {
    // In a real app, this would make an API call to replace questions
    // Here we'll simulate it by updating local storage
    
    // Update quiz version to trigger replacement
    localStorage.setItem(QUIZ_VERSION_KEY, "1.0-new");
    
    // Reset leaderboard since we're changing the quiz
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboardData));
    
    // Hide confirmation and show success
    confirmationDialog.classList.add('hidden');
    adminStatus.classList.remove('hidden');
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
        adminStatus.classList.add('hidden');
    }, 3000);
}

// Event Listeners for Planet Navigation and Objects
planetButtons.forEach(button => {
    const planet = button.getAttribute('data-planet');
    button.addEventListener('click', () => {
        startQuiz(planet);
    });
    
    // Highlight active button on hover
    button.addEventListener('mouseenter', () => {
        // Highlight corresponding planet
        const planetObject = document.querySelector(`.planet-object[data-planet="${planet}"]`);
        if (planetObject) {
            planetObject.style.transform = 'translate(-50%, -50%) scale(1.2)';
            planetObject.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.7)';
            planetObject.style.zIndex = '10';
        }
    });
    
    button.addEventListener('mouseleave', () => {
        // Reset planet highlight
        const planetObject = document.querySelector(`.planet-object[data-planet="${planet}"]`);
        if (planetObject) {
            planetObject.style.transform = 'translate(-50%, -50%)';
            planetObject.style.boxShadow = '';
            planetObject.style.zIndex = '';
        }
    });
});

planetObjects.forEach(planet => {
    const planetName = planet.getAttribute('data-planet');
    planet.addEventListener('click', () => {
        startQuiz(planetName);
    });
});

viewLeaderboardBtn.addEventListener('click', displayLeaderboard);

optionButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (!button.classList.contains('disabled')) {
            const selectedOption = button.getAttribute('data-option');
            handleAnswer(selectedOption);
        }
    });
});

submitScoreBtn.addEventListener('click', submitScore);
playAgainBtn.addEventListener('click', () => showScreen(landingPage));

// Admin panel event listeners
replaceQuestionsBtn.addEventListener('click', replaceQuestions);
confirmReplaceBtn.addEventListener('click', confirmReplaceQuestions);
cancelReplaceBtn.addEventListener('click', () => confirmationDialog.classList.add('hidden'));
backToLandingBtn.addEventListener('click', () => showScreen(landingPage));

// Initialize the app on load
window.addEventListener('DOMContentLoaded', () => {
    // Start at the landing page
    showScreen(landingPage);
});
