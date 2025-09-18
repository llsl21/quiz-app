import { setupThemeSwitch } from "./js/theme-switch.js";
import { QuizState } from "./js/state.js";
import { fetchQuizzes, findQuizByTitle } from "./js/quiz.js";
import {
  populateQuestion,
  populateAnswerList,
  findOptionDOM,
  populateHeader,
  renderScoreView,
  setupInitialPage,
  withCommon,
} from "./js/ui.js";

// クイズ状態管理インスタンス
const quizState = new QuizState();

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
  populateHeader(
    document.querySelector(".quiz-app__header"),
    quizState.quizCategory,
    quizState.quizIcon
  );
  showCurrentQuestion();
};

// テーマ切り替え
setupThemeSwitch({
  switchSelector: "#header__switch",
  initial: document.documentElement.dataset.theme,
  persist: true,
});

setupInitialPage(
  document.getElementById("template-quiz-app"),
  withCommon(onClickCategory)
);

// 問題表示
function showCurrentQuestion() {
  const { currentQuiz, totalQuestionLength, quizNum } = quizState;
  if (!currentQuiz) return;

  populateQuestion(
    currentQuiz,
    document,
    quizNum + 1,
    totalQuestionLength,
    onClickSubmit
  );
  populateAnswerList(document, quizState);
}

const onClickNext = (e) => {
  if (quizState.totalQuestionLength >= quizState.quizNum) {
  }
  quizState.nextQuestion();
  showCurrentQuestion();
};

const onReplayClick = (e) => {
  quizState.resetQuizState();
  setupInitialPage(
    document.getElementById("template-quiz-app"),
    onClickCategory
  );
};

const onClickScore = (e) => {
  const scoreTemplate = document.getElementById("template-scoreView");
  renderScoreView(scoreTemplate, quizState, withCommon(onReplayClick));
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
    e.currentTarget.addEventListener("click", withCommon(onClickScore));
  } else {
    e.currentTarget.textContent = "Next Question";
    e.currentTarget.addEventListener("click", withCommon(onClickNext));
  }
};
