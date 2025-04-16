// Solar System Quiz Questions
const solarSystemQuestions = [
    {
        question: "Which planet is closest to the Sun?",
        options: {
            A: "Venus",
            B: "Mercury",
            C: "Earth",
            D: "Mars"
        },
        correctAnswer: "B"
    },
    {
        question: "What is the largest planet in our solar system?",
        options: {
            A: "Earth",
            B: "Mars",
            C: "Jupiter",
            D: "Saturn"
        },
        correctAnswer: "C"
    },
    {
        question: "Which planet is known as the 'Red Planet'?",
        options: {
            A: "Jupiter",
            B: "Venus",
            C: "Mars",
            D: "Mercury"
        },
        correctAnswer: "C"
    },
    {
        question: "What is the name of Earth's natural satellite?",
        options: {
            A: "Sun",
            B: "Moon",
            C: "Titan",
            D: "Europa"
        },
        correctAnswer: "B"
    },
    {
        question: "What is the hottest planet in our solar system?",
        options: {
            A: "Mercury",
            B: "Venus",
            C: "Mars",
            D: "Jupiter"
        },
        correctAnswer: "B"
    },
    {
        question: "Which planet has the most visible rings?",
        options: {
            A: "Jupiter",
            B: "Uranus",
            C: "Neptune",
            D: "Saturn"
        },
        correctAnswer: "D"
    },
    {
        question: "What is the second smallest planet in our solar system?",
        options: {
            A: "Mars",
            B: "Mercury",
            C: "Venus",
            D: "Earth"
        },
        correctAnswer: "A"
    },
    {
        question: "Which planet rotates on its side, with its axis of rotation tilted over 90 degrees?",
        options: {
            A: "Neptune",
            B: "Saturn",
            C: "Uranus",
            D: "Jupiter"
        },
        correctAnswer: "C"
    },
    {
        question: "How many recognized planets are in our solar system?",
        options: {
            A: "7",
            B: "8",
            C: "9",
            D: "10"
        },
        correctAnswer: "B"
    },
    {
        question: "What is the great red spot on Jupiter?",
        options: {
            A: "A volcano",
            B: "A lake",
            C: "A storm",
            D: "A mountain"
        },
        correctAnswer: "C"
    },
    {
        question: "What is the largest moon in our solar system?",
        options: {
            A: "Europa",
            B: "Titan",
            C: "Ganymede",
            D: "Callisto"
        },
        correctAnswer: "C"
    },
    {
        question: "What is the main component of the Sun?",
        options: {
            A: "Helium",
            B: "Oxygen",
            C: "Carbon",
            D: "Hydrogen"
        },
        correctAnswer: "D"
    },
    {
        question: "Which planet has the longest day?",
        options: {
            A: "Venus",
            B: "Mercury",
            C: "Earth",
            D: "Mars"
        },
        correctAnswer: "A"
    },
    {
        question: "Which planet has the Great Dark Spot?",
        options: {
            A: "Uranus",
            B: "Jupiter",
            C: "Neptune",
            D: "Saturn"
        },
        correctAnswer: "C"
    },
    {
        question: "What is the asteroid belt located between?",
        options: {
            A: "Earth and Mars",
            B: "Mars and Jupiter",
            C: "Jupiter and Saturn",
            D: "Saturn and Uranus"
        },
        correctAnswer: "B"
    },
    {
        question: "What is the approximate age of our solar system?",
        options: {
            A: "4.6 billion years",
            B: "2.3 billion years",
            C: "13.8 billion years",
            D: "8.7 billion years"
        },
        correctAnswer: "A"
    },
    {
        question: "Which dwarf planet was once considered the ninth planet?",
        options: {
            A: "Ceres",
            B: "Eris",
            C: "Pluto",
            D: "Haumea"
        },
        correctAnswer: "C"
    },
    {
        question: "What is the smallest planet in our solar system?",
        options: {
            A: "Mars",
            B: "Mercury",
            C: "Venus",
            D: "Pluto"
        },
        correctAnswer: "B"
    },
    {
        question: "Which planet has the strongest magnetic field?",
        options: {
            A: "Earth",
            B: "Mercury",
            C: "Jupiter",
            D: "Neptune"
        },
        correctAnswer: "C"
    },
    {
        question: "What causes the Earth's seasons?",
        options: {
            A: "Distance from the Sun",
            B: "Earth's rotation",
            C: "Earth's axial tilt",
            D: "Moon's gravity"
        },
        correctAnswer: "C"
    },
    {
        question: "Which planet was the first to be discovered using a telescope?",
        options: {
            A: "Uranus",
            B: "Neptune",
            C: "Pluto",
            D: "Saturn"
        },
        correctAnswer: "A"
    },
    {
        question: "What is the largest structure in our solar system?",
        options: {
            A: "Jupiter",
            B: "Saturn's rings",
            C: "The Oort Cloud",
            D: "The Sun"
        },
        correctAnswer: "C"
    },
    {
        question: "What is the Kuiper Belt?",
        options: {
            A: "A ring around Mars",
            B: "A region of icy bodies beyond Neptune",
            C: "A series of moons around Jupiter",
            D: "A cloud of gas near the Sun"
        },
        correctAnswer: "B"
    },
    {
        question: "Approximately how long does it take light from the Sun to reach Earth?",
        options: {
            A: "8 minutes",
            B: "8 hours",
            C: "8 seconds",
            D: "8 days"
        },
        correctAnswer: "A"
    },
    {
        question: "What is the name of NASA's space telescope that studies the universe in infrared light?",
        options: {
            A: "Hubble Space Telescope",
            B: "Chandra X-ray Observatory",
            C: "James Webb Space Telescope",
            D: "Spitzer Space Telescope"
        },
        correctAnswer: "C"
    }
];

// Leaderboard data (simulated initial data)
const leaderboardData = [
    { name: "Galileo", score: 92 },
    { name: "Newton", score: 88 },
    { name: "Einstein", score: 84 },
    { name: "Copernicus", score: 80 },
    { name: "Kepler", score: 76 }
];

// Local storage keys
const LEADERBOARD_KEY = "solarSystemQuizLeaderboard";
const QUIZ_VERSION_KEY = "solarSystemQuizVersion";

// Initialize local storage with default data if not present
function initializeLocalStorage() {
    // Check if quiz version is set to the current version
    const currentVersion = "1.0";
    const storedVersion = localStorage.getItem(QUIZ_VERSION_KEY);
    
    // If version doesn't match or doesn't exist, update the questions and leaderboard
    if (storedVersion !== currentVersion) {
        localStorage.setItem(QUIZ_VERSION_KEY, currentVersion);
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboardData));
    }
}

// Call initialization function
initializeLocalStorage();
