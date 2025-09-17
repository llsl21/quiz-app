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
const questionNum = 0;
let questionObj;
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
  const category = e.target.textContent.trim();

  e.preventDefault();

  const res = await fetch("/data.json");
  const { quizzes } = await res.json();
  const [quiz] = quizzes.filter(({ title }) => {
    return title.toUpperCase() === category.toUpperCase();
  });
  if (!quiz) console.error(`No quiz found about ${category}`);

  questionObj = quiz;
  questionRoot.querySelector(".quiz-app__question-heading").textContent =
    questionObj.questions[questionNum].question;

  quiz.questions[questionNum].options.forEach((option, index) => {
    const answerListItemRoot = answerListItemTemplate.content.cloneNode(true);
    const answerListNumLabel = answerListItemRoot.querySelector(
      ".quiz-app__answer-list-img-wrapper"
    );
    answerListNumLabel.textContent = numAlphaMap[index];
    answerListNumLabel.after(option);
    answerList.append(answerListItemRoot);
  });
  body.replaceChild(questionRoot, main);
};

const categoryButtons = document.querySelectorAll(
  ".quiz-app__category-list-button"
);
categoryButtons.forEach((categoryButton) => {
  categoryButton.addEventListener("click", onClickCategory);
});

const onClickSubmit = async (e) => {
  questionNum += 1;
};

function populateQuestion(question, root = document) {
  const main = document.querySelector("main");
  const questionTemplate = root.getElementById("template__question-view");
  const questionRoot = questionTemplate.content.cloneNode(true);
  populateElement(questionRoot, ".quiz-app__question-heading", question);
  document.body.replaceChild(questionRoot, main);
}

function populateAnswerList(options, root = document) {
  const answerListTemplate = root.getElementById("template__answer-list-item");
  const answerList = document.querySelector(".quiz-app__answer-list");

  const fragment = new createDocumentFragment();
  options.forEach((option, index) => {
    const answerListRoot = answerListTemplate.content.cloneNode(true);
    populateElement(answerListItemRoot, ".list-item__img-wrapper", index + 1);
    populateElement(answerListRoot, ".quiz-app__answer-list-content", option);
    answerList.append(answerListRoot);
  });
}

function populateElement(root, selector, value) {
  const elem = root.querySelector(selector);
  if (!elem) console.error(`no element found for the selector: ${selector}`);
  elem.textContent = value;
}

function populateQuiz(quizObj) {
  populateQuestion();
  populateAnswerList();
}
