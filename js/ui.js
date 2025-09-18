// UI描画・DOM操作用モジュール

export const withCommon = (handler) => (e) => {
  window.scrollTo(0, 0);
  return handler(e);
};

export function setupInitialPage(template, onClickCategory) {
  const initialPageFragment = template.content.cloneNode(true);
  const categoryButtons = initialPageFragment.querySelectorAll(
    ".quiz-app__category-list-button"
  );
  categoryButtons.forEach((categoryButton) => {
    categoryButton.addEventListener("click", withCommon(onClickCategory));
  });

  const main = document.body.querySelector("main");
  if (!main) {
    document.body.append(initialPageFragment);
  } else {
    main.replaceWith(initialPageFragment);
  }
}

export function populateHeader(root, quizCategory, quizIcon) {
  const headerTemplate = document.getElementById("template__header");
  const headerFragment = headerTemplate.content.cloneNode(true);
  const img = headerFragment.querySelector(".header-row__logo-img");
  const heading = headerFragment.querySelector(".header-row__logo-heading");
  img.src = quizIcon;
  img.classList.add(`img-${quizCategory.toLowerCase()}`);
  heading.textContent = quizCategory;
  root.prepend(headerFragment);
}

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

export function findOptionDOM(answerText) {
  const root = document.querySelector(".quiz-app__answer-list");
  const optionDOMs = root.querySelectorAll(".list-item__button");
  const foundOptionDOM = Array.from(optionDOMs).find(
    (optionDOM) =>
      optionDOM
        .querySelector(".quiz-app__answer-list-content")
        .textContent.trim() === answerText
  );
  if (!foundOptionDOM) {
    return console.error("no dom found.");
  }
  return foundOptionDOM;
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

  main.replaceWith(questionRoot);
}

export function populateAnswerList(root, state) {
  const answerListItemTemplate = root.getElementById(
    "template__answer-list-item"
  );
  const answerList = document.querySelector(".quiz-app__answer-list");

  const onClickOption = (e) => {
    const option = e.currentTarget.querySelector(
      ".quiz-app__answer-list-content"
    ).textContent;

    state.evaluateCorrectness(option, e.currentTarget.dataset.index);
  };

  const onBlurOption = (e) => {
    if (
      e.relatedTarget === null ||
      !(e.relatedTarget.getAttribute("type") === "submit")
    ) {
      state.resetCorrectness();
      return;
    }
  };

  state.currentQuizOptions.forEach((option, index) => {
    const answerListRoot = answerListItemTemplate.content.cloneNode(true);
    const optionButton = answerListRoot.querySelector(
      ".quiz-app__answer-list-item__button"
    );
    optionButton.addEventListener("click", onClickOption);
    optionButton.addEventListener("blur", onBlurOption);
    optionButton.dataset.index = index;
    populateElement(
      answerListRoot,
      ".list-item__img-wrapper",
      String.fromCharCode("A".codePointAt(0) + index)
    );
    populateElement(answerListRoot, ".quiz-app__answer-list-content", option);
    answerList.append(answerListRoot);
  });
}

export function renderScoreView(
  template,
  { totalCorrectNum, totalQuestionLength, quizCategory, quizIcon },
  onReplayClick
) {
  const scoreViewFragment = template.content.cloneNode(true);

  const icon = scoreViewFragment.querySelector(".scoreView__img-wrapper > img");
  const category = scoreViewFragment.querySelector(".scoreView__category");
  const score = scoreViewFragment.querySelector(".scoreView__score");
  const total = scoreViewFragment.querySelector(
    ".scoreView__total-question-length"
  );
  const replayButton = scoreViewFragment.querySelector(".replay-button");

  icon.src = quizIcon;
  icon.classList.add(`img-${quizCategory.toLowerCase()}`);
  category.textContent = quizCategory;
  score.textContent = totalCorrectNum;
  total.textContent = `out of ${totalQuestionLength}`;

  replayButton.addEventListener("click", withCommon(onReplayClick));

  document.querySelector("main").replaceWith(scoreViewFragment);
}
