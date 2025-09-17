// const root = document.documentElement;
// const themeSwitch = document.getElementById("header__switch");

// function applyTheme(theme) {
//   const sources = document.querySelectorAll("source");
//   sources.forEach((source) => {
//     if (source.dataset.theme === theme) {
//       source.removeAttribute("media");
//     } else {
//       source.media = "not all";
//     }
//   });
// }

// themeSwitch.addEventListener("click", (ev) => {
//   console.log("clicked");

//   if (ev.target.checked) {
//     root.dataset.theme = "dark";
//   } else {
//     root.dataset.theme = "light";
//   }
//   applyTheme(root.dataset.theme);
// });

// function initApp() {
//   applyTheme(root.dataset.theme);
// }

// initApp();
let questionNum = 0;
let quizObj;
import { setupThemeSwitch } from "./js/theme-switch.js";

// const main = document.querySelector("main");
// const questionViewTemplate = document.getElementById("template__question-view");
// const questionViewRoot = questionViewTemplate.content.cloneNode(true);
// const answerListTemplate = questionViewRoot.getElementById(
//   "template__answer-list-item"
// );

// async function fetchAndShowQuiz(category) {
//   const response = await fetch("/data.json");
//   const { quizzes } = await response.json();
//   console.log(quizzes);

//   const [{ title, icon, questions }] = quizzes.filter(({ title }) => {
//     return title === category;
//   });

//   questionViewRoot.querySelector(".quiz-app__question-heading").textContent =
//     questions[0].question;

//   document.querySelector("body").replaceChild(questionViewRoot, main);
// }

// fetchAndShowQuiz("HTML");

// Theme setup

const teardown = setupThemeSwitch({
  switchSelector: "#header__switch",
  initial: document.documentElement.dataset.theme,
  persist: true,
});

const onClickCategory = async (e) => {
  const numAlphaMap = ["A", "B", "C", "D"];
  const questionTemplate = document.getElementById("template__question-view");
  const questionRoot = questionTemplate.content.cloneNode(true);
  const answerListItemTemplate = questionRoot.getElementById(
    "template__answer-list-item"
  );
  const answerList = questionRoot.querySelector(".quiz-app__answer-list");
  const body = document.querySelector("body");
  const main = document.querySelector("main");
  const category = e.currentTarget.textContent.trim();

  e.preventDefault();

  const res = await fetch("/data.json");
  const { quizzes } = await res.json();
  const [quiz] = quizzes.filter(({ title }) => {
    return title.toUpperCase() === category.toUpperCase();
  });
  if (!quiz) console.error(`No quiz found about ${category}`);

  quizObj = quiz;
  // populate question
  populateQuiz(quizObj);
};

const categoryButtons = document.querySelectorAll(
  ".quiz-app__category-list-button"
);
categoryButtons.forEach((categoryButton) => {
  categoryButton.addEventListener("click", onClickCategory);
});

const onClickSubmit = async (e) => {
  questionNum++;
  populateQuiz(quizObj);
};

function calculateRatio(portion, unit) {
  if (typeof unit !== "number") {
    console.error("unit type should be number.");
    return;
  }
  if (unit === 0) {
    console.error("unit must not be zero.");
    return;
  }
  return `${(portion / unit) * 100}%`;
}

function updateIndicator(indicator, allQuestionLength) {
  indicator.style.setProperty(
    "--before-width",
    calculateRatio(questionNum + 1, allQuestionLength)
  );
}

function populateQuestion(question, root = document, allQuestionLength) {
  const main = document.querySelector("main");
  const questionTemplate = root.getElementById("template__question-view");
  const questionRoot = questionTemplate.content.cloneNode(true);
  populateElement(questionRoot, ".quiz-app__question-heading", question);
  populateElement(
    questionRoot,
    ".quiz-app__question-heading-ratio",
    `Question ${questionNum + 1} of ${allQuestionLength}`
  );
  const indicator = questionRoot.querySelector(
    ".quiz-app__question-indicator-ratio"
  );
  updateIndicator(indicator, allQuestionLength);
  const submitButton = questionRoot.querySelector(".submit-button");
  submitButton.addEventListener("click", onClickSubmit);
  document.body.replaceChild(questionRoot, main);
}

function populateAnswerList(options, root = document) {
  const answerListItemTemplate = root.getElementById(
    "template__answer-list-item"
  );
  const answerList = document.querySelector(".quiz-app__answer-list");

  options.forEach((option, index) => {
    const answerListRoot = answerListItemTemplate.content.cloneNode(true);
    populateElement(answerListRoot, ".list-item__img-wrapper", index + 1);
    populateElement(answerListRoot, ".quiz-app__answer-list-content", option);
    answerList.append(answerListRoot);
  });
}

function populateElement(root, selector, value) {
  const elem = root.querySelector(selector);
  if (!elem) console.error(`no element found for the selector: ${selector}`);
  elem.textContent = value;
}

function populateQuiz({ questions }) {
  populateQuestion(questions[questionNum].question, document, questions.length);
  populateAnswerList(questions[questionNum].options);
}
