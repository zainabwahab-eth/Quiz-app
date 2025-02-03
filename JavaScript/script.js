//import questions from questions.js
import { questions } from "./questions.js"

//get html elements
const startBtn = document.querySelector(".start-btn");
const nextBtn = document.querySelector(".next-btn");
const resetBtn = document.querySelector(".playagain-btn");
const welcomeCntn = document.querySelector(".welcome-page");
const questionCntn = document.querySelector(".question-page");
const completeCntn = document.querySelector(".complete-page");
const questionText = document.querySelector(".question-p");
const questionDiv = document.querySelector(".question");
const result = document.querySelector(".result");
const timerCntn = document.querySelector(".time");
const finishLabel = document.querySelector(".finish-label");
const timeUpImage = document.querySelector(".time-up-img");
const doneImage = document.querySelector(".done-img");
const questionCountCntn = document.querySelector(".question-count");
const lineCounter = document.querySelector(".line2");

let currentQuestion = null;
let questionCount = 0;
let score = 0;
let counterLength = 100 / questions.length;
let timer;

// Reset Quiz
const resetQuiz = function () {
  currentQuestion = null;
  questionCount = 0;
  score = 0;
  counterLength = 100 / questions.length;

  welcomeCntn.classList.remove("hidden");
  questionCntn.classList.add("hidden");
  completeCntn.classList.add("hidden");
  timeUpImage.classList.add("hidden");
  doneImage.classList.add("hidden");
  nextBtn.classList.remove("submit-btn");
  nextBtn.textContent = "Next";
};

// Display the question
const displayQuestion = function () {
  currentQuestion = questions[questionCount];

  questionText.innerText = currentQuestion?.question;

  questionDiv.innerHTML = `
    <p class="question-p">${currentQuestion?.question}</p>
    <form>
      <legend>Pick one Option</legend>
      ${currentQuestion?.options
        .map(
          (option, index) => `
        <label>
          <input type="radio" name="answer" class="option" value="${index}">
          ${option}
        </label>
      `
        )
        .join("")}
    </form>
  `;
  questionCountCntn.textContent = `Question ${questionCount + 1} of ${questions.length}`;
  lineCounter.style.width = `${counterLength}%`;
};

// Calculate and display final score
const displayFinishScore = function (timeup = false) {
  completeCntn.classList.remove("hidden");
  questionCntn.classList.add("hidden");

  doneImage.classList.add("hidden");
  timeUpImage.classList.add("hidden");

  if (timeup) {
    timeUpImage.classList.remove("hidden");
    finishLabel.textContent = "Time's up!";
  } else {
    doneImage.classList.remove("hidden");
    finishLabel.textContent = "Congratulations! You completed your quiz";
  }

  const scorePercent = score * 100 / questions.length;
  result.textContent = `${scorePercent}%`;
};

// Start Timer
const startquizTimer = function () {
  let time = 1800;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    timerCntn.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      displayFinishScore(true);
    }

    time--;
  };

  tick();

  const timer = setInterval(tick, 1000);
  return timer;
};

// Check the answer
const checkAnswer = function () {
  const selectedOption = document.querySelector('input[name="answer"]:checked');

  const userAnswer = parseInt(selectedOption.value);

  const correctAnswer = currentQuestion?.correctAnswer;

  if (userAnswer === correctAnswer) score++
};

// Event Listeners
startBtn.addEventListener("click", function () {
  welcomeCntn.classList.add("hidden");
  questionCntn.classList.remove("hidden");
  if (timer) clearInterval(timer);
  timer = startquizTimer();
  displayQuestion();
});

nextBtn.addEventListener("click", function () {
  const selectedOption = document.querySelector('input[name="answer"]:checked');

  if (!selectedOption) {
    alert("Please select an answer");
    return;
  }

  checkAnswer();

  if (questionCount < questions.length - 1) {
    questionCount++;
    counterLength = (questionCount + 1) * 100 / questions.length;
    setTimeout(displayQuestion, 500);
  } else {
    clearInterval(timer);
    displayFinishScore(false);
  }

  if (questionCount === questions.length - 1) {
    setTimeout(() => {
      nextBtn.textContent = "Submit";
      nextBtn.classList.add("submit-btn");
    }, 500);
  }
});

resetBtn.addEventListener("click", resetQuiz);
