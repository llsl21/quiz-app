// UI描画・DOM操作用モジュール

export function populateElement(root, selector, value) {
  const elem = root.querySelector(selector);
  if (!elem) console.error(`no element found for the selector: ${selector}`);
  elem.textContent = value;
}

export function calculateRatio(portion, unit) {
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

export function updateIndicator(indicator, current, total) {
  indicator.style.setProperty("--before-width", calculateRatio(current, total));
}

export function populateQuestion(question, root, current, total, onSubmit) {
  const main = document.querySelector("main");
  const questionTemplate = root.getElementById("template__question-view");
  const questionRoot = questionTemplate.content.cloneNode(true);
  populateElement(
    questionRoot,
    ".quiz-app__question-heading",
    question.question
  );
  populateElement(
    questionRoot,
    ".quiz-app__question-heading-ratio",
    `Question ${current} of ${total}`
  );
  const indicator = questionRoot.querySelector(
    ".quiz-app__question-indicator-ratio"
  );
  updateIndicator(indicator, current, total);
  const submitButton = questionRoot.querySelector(".submit-button");
  submitButton.addEventListener("click", onSubmit);
  document.body.replaceChild(questionRoot, main);
}

export function populateAnswerList(options, root) {
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
