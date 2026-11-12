/* Run before styles to avoid a theme flash. Storage is optional. */
(() => {
  let theme;
  try { theme = localStorage.getItem("zimo.theme"); } catch (_) { /* Private mode / file URLs. */ }
  if (theme !== "light" && theme !== "dark") {
    theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.dataset.theme = theme;
})();
