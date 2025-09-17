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
  const questionNum = 0;
  const category = e.target.textContent.trim();

  e.preventDefault();

  const res = await fetch("/data.json");
  const { quizzes } = await res.json();
  const [quiz] = quizzes.filter(({ title }) => {
    return title.toUpperCase() === category.toUpperCase();
  });
  if (!quiz) console.error(`No quiz found about ${category}`);

  questionRoot.querySelector(".quiz-app__question-heading").textContent =
    quiz.questions[questionNum].question;

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
