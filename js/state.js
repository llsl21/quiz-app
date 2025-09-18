// クイズ状態管理用モジュール

export class QuizState {
  constructor() {
    this.quizNum = 0;
    this.quizObj = null;
    this.correctness = null;
    this.selectedIndex = null;
    this.totalCorrectNum = 0;
  }

  setQuiz(quizObj) {
    this.quizObj = quizObj;
    this.quizNum = 0;
    this.correctness = null;
    this.totalCorrectNum = 0;
  }

  nextQuestion() {
    this.quizNum++;
    this.selectedIndex = null;
    this.correctness = null;
  }

  get quizCategory() {
    return this.quizObj?.title;
  }

  get quizIcon() {
    return this.quizObj?.icon;
  }

  get totalQuestionLength() {
    return this.quizObj?.questions.length;
  }

  get currentQuiz() {
    return this.quizObj?.questions[this.quizNum];
  }

  get currentQuizQuestion() {
    return this.currentQuiz.question;
  }

  get currentSelectedAnswer() {
    return this.currentQuizOptions[this.selectedIndex];
  }

  get currentQuizAnswer() {
    return this.currentQuiz.answer;
  }

  get currentQuizOptions() {
    return this.currentQuiz.options;
  }

  get currentCorrectness() {
    return this.correctness;
  }

  set currentCorrectness(value) {
    if (typeof value !== "boolean" && value !== null) {
      return console.error("boolean needed.");
    }
    this.correctness = value;
  }

  resetCorrectness() {
    this.currentCorrectness = null;
    this.selectedIndex = null;
  }

  evaluateCorrectness(option, index) {
    this.currentCorrectness = this.currentQuizAnswer === option;
    this.selectedIndex = index;
  }

  resetQuizState() {
    this.quizNum = 0;
    this.quizObj = null;
    this.correctness = null;
    this.selectedIndex = null;
    this.totalCorrectNum = 0;
  }
}
