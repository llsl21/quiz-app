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

const teardown = setupThemeSwitch({
  switchSelector: "#header__switch",
  initial: document.documentElement.dataset.theme || "light",
  persist: true,
});
