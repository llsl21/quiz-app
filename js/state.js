// クイズ状態管理用モジュール

export class QuizState {
  constructor() {
    this.quizNum = 0;
    this.quizObj = null;
  }

  setQuiz(quizObj) {
    this.quizObj = quizObj;
    this.quizNum = 0;
  }

  nextQuestion() {
    this.quizNum++;
  }

  get currentQuestion() {
    return this.quizObj?.questions[this.quizNum];
  }
}
