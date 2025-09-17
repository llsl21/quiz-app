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
import { QuizState } from "./js/state.js";
import { fetchQuizzes, findQuizByTitle } from "./js/quiz.js";
import { populateQuestion, populateAnswerList } from "./js/ui.js";

// クイズ状態管理インスタンス
const quizState = new QuizState();

// テーマ切り替え
setupThemeSwitch({
  switchSelector: "#header__switch",
  initial: document.documentElement.dataset.theme,
  persist: true,
});

// カテゴリ選択時の処理
const onClickCategory = async (e) => {
  e.preventDefault();
  const category = e.currentTarget.textContent.trim();

  const quizzes = await fetchQuizzes();
  const quiz = findQuizByTitle(quizzes, category);
  if (!quiz) {
    console.error(`No quiz found about ${category}`);
    return;
  }

  quizState.setQuiz(quiz);
  showCurrentQuestion();
};

// 問題表示
function showCurrentQuestion() {
  const { currentQuestion, quizObj, quizNum } = quizState;
  if (!currentQuestion) return;

  populateQuestion(
    currentQuestion,
    document,
    quizNum + 1,
    quizObj.questions.length,
    onClickSubmit
  );
  populateAnswerList(currentQuestion.options, document);
}

// 回答送信時の処理
const onClickSubmit = () => {
  quizState.nextQuestion();
  showCurrentQuestion();
};

// カテゴリボタンにイベント登録
const categoryButtons = document.querySelectorAll(
  ".quiz-app__category-list-button"
);
categoryButtons.forEach((categoryButton) => {
  categoryButton.addEventListener("click", onClickCategory);
});
