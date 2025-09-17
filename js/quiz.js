// クイズデータ取得・管理用モジュール

export async function fetchQuizzes() {
  const response = await fetch("/data.json");
  const { quizzes } = await response.json();
  return quizzes;
}

export function findQuizByTitle(quizzes, title) {
  return quizzes.find((q) => q.title.toUpperCase() === title.toUpperCase());
}
