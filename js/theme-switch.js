// const rootEl = document.documentElement;

// export function applyTheme(theme) {
//   const sources = document.querySelectorAll("source[data-theme");
//   sources.forEach((source) => {
//     if (source.dataset.theme === theme) {
//       source.removeAttribute("media");
//     } else {
//       source.media = "not all";
//     }
//   });
// }

// export function setupThemeSwitch({
//   switchSelector = "#header__switch",
//   root = rootEl,
//   initial = rootEl.dataset.theme || "light",
//   persist = true,
// } = {}) {
//   const el = document.querySelector(switchSelector);
//   if (!el) {
//     console.warn(`[theme-switch] switch not found: ${switchSelector}`);
//     return () => {};
//   }

//   const stored = persist ? localStorage.getItem("theme") : null;
//   const theme = stored || initial;
//   root.dataset.theme = theme;
//   if ("checked" in el) el.checked = theme === "dark";
//   applyTheme(theme);

//   const onChange = (e) => {
//     const next = e.target.checked ? "dark" : "light";
//     root.dataset.theme = next;
//     applyTheme(next);
//     if (persist) localStorage.setItem("theme", next);
//   };

//   el.addEventListener("change", onChange);

//   return () => el.removeEventListener("change", onChange);
// }

const rootEl = document.documentElement;

function applyTheme(theme) {
  const sources = document.querySelectorAll("source[data-theme]");
  if (!sources.length)
    console.warn(`no source with data-theme attribute found.`);
  sources.forEach((source) => {
    if (source.dataset.theme === theme) {
      source.removeAttribute("media");
    } else {
      source.media = "not all";
    }
  });
}

function detectTheme({ stored, initial, root }) {
  const candidate = stored ?? initial ?? root.dataset.theme;

  switch (candidate) {
    case "light":
    case "dark":
      return candidate;

    case "system":
    case undefined:
      return matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    default:
      console.warn(`Unknown theme: ${candidate}, fallback to 'light'`);
      return "light";
  }
}

export function setupThemeSwitch({
  switchSelector = "#header__switch",
  root = rootEl,
  initial = root.dataset.theme,
  persist = true,
} = {}) {
  const el = document.querySelector(switchSelector);

  if (!el) {
    console.warn(`[theme-switch] switch not found: ${switchSelector}`);
    return () => {};
  }

  const stored = persist ? localStorage.getItem("theme") : null;

  const theme = detectTheme({ stored, initial, root });
  root.dataset.theme = theme;

  if ("checked" in el) el.checked = theme === "dark";
  applyTheme(theme);

  const onChange = (e) => {
    const next = e.target.checked ? "dark" : "light";
    root.dataset.theme = next;
    applyTheme(next);
    if (persist) localStorage.setItem("theme", next);
  };

  el.addEventListener("change", onChange);

  return () => el.removeEventListener("change", onChange);
}
