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
import {
  populateQuestion,
  populateAnswerList,
  findOptionDOM,
  populateHeader,
} from "./js/ui.js";

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

  window.scrollTo(0, 0);
  const category = e.currentTarget.textContent.trim();

  const quizzes = await fetchQuizzes();
  const quiz = findQuizByTitle(quizzes, category);
  if (!quiz) {
    console.error(`No quiz found about ${category}`);
    return;
  }

  quizState.setQuiz(quiz);
  populateHeader(
    document.querySelector(".quiz-app__header"),
    quizState.quizCategory,
    quizState.quizIcon
  );
  showCurrentQuestion();
};

// 問題表示
function showCurrentQuestion() {
  const { currentQuiz, totalQuestionLength, quizNum } = quizState;
  if (!currentQuiz) return;

  populateQuestion(
    currentQuiz,
    document,
    quizNum + 1,
    totalQuestionLength,
    onClickSubmit,
  );
  populateAnswerList(document, quizState);
}

const onClickNext = (e) => {
  if (quizState.totalQuestionLength >= quizState.quizNum) {
  }
  window.scrollTo(0, 0);
  quizState.nextQuestion();
  showCurrentQuestion();
};

const onClickScore = (e) => {
  console.log(quizState.totalCorrectNum);
};

// 回答送信時の処理
const onClickSubmit = (e) => {
  if (quizState.currentCorrectness === null) {
    return console.error("answer has to be selected.");
  }


  const currentSelectedOptionDOM = findOptionDOM(
    quizState.currentSelectedAnswer
  );
  if (quizState.currentCorrectness) {
    currentSelectedOptionDOM.classList.add("correct");
    quizState.totalCorrectNum++;
  } else {
    const currentAnswerOptionDOM = findOptionDOM(quizState.currentQuizAnswer);
    currentAnswerOptionDOM.classList.add("correct");
    currentSelectedOptionDOM.classList.add("incorrect");
  }

  e.currentTarget.removeEventListener("click", onClickSubmit);

  if (quizState.totalQuestionLength <= quizState.quizNum + 1) {
    e.currentTarget.removeEventListener("click", onClickNext);
    e.currentTarget.textContent = "Show up your SCORE!";
    e.currentTarget.addEventListener("click", onClickScore);
  } else {
    e.currentTarget.textContent = "Next Question";
    e.currentTarget.addEventListener("click", onClickNext);
  }
};

// カテゴリボタンにイベント登録
const categoryButtons = document.querySelectorAll(
  ".quiz-app__category-list-button"
);
categoryButtons.forEach((categoryButton) => {
  categoryButton.addEventListener("click", onClickCategory);
});
