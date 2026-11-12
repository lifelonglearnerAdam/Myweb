/* Keep old bookmarks working without exposing obsolete personal pages. */
(() => {
  const target = document.documentElement.dataset.redirect;
  if (!target) return;
  const url = new URL(target, location.href);
  const language = new URLSearchParams(location.search).get("lang");
  if (language === "zh" || language === "en") url.searchParams.set("lang", language);
  location.replace(url.href);
})();
