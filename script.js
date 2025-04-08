let allQuestions = [];
let questions = [];

const CATEGORIES = [
    "Recht",
    "Jagdbetrieb, Hege und Brauchtum",
    "Waffenkunde, Waffenrecht",
    "Wildarten, Wildschutz, Landnutzung, Schadensverhütung"
];

// Hilfsfunktion zum Mischen eines Arrays (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Fragen laden & filtern
fetch("Fragenkatalog_Jaegerpruefung.json")
    .then((res) => res.json())
    .then((data) => {
        allQuestions = data;

        questions = CATEGORIES.flatMap(category => {
            const filtered = allQuestions.filter(q => q.category === category);
            return shuffleArray(filtered).slice(0, 25);
        });

        questions = shuffleArray(questions);
        startQuiz();
    });

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const highlightToggle = document.getElementById("highlight-toggle"); // Der Schalter

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    
    if (highlightToggle.checked) {  // Nur markieren, wenn der Schalter aktiv ist
        if (isCorrect) {
            selectedBtn.classList.add("correct");
            score++;
        } else {
            selectedBtn.classList.add("incorrect");
        }

        // Alle anderen Buttons deaktivieren
        Array.from(answerButtons.children).forEach(button => {
            if (button.dataset.correct === "true") {
                button.classList.add("correct");
            }
            button.disabled = true;
        });
    } else {
        // Wenn der Schalter deaktiviert ist, nur die Auswahl des Buttons
        selectedBtn.disabled = true;
        nextButton.style.display = "block";
    }
    
    nextButton.style.display = "block";
}

function showScore() {
    resetState();
    questionElement.innerHTML = `Du hast ${score} von ${questions.length} Fragen richtig beantwortet.`;
    nextButton.innerHTML = "Erneut starten";
    nextButton.style.display = "block";
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});
