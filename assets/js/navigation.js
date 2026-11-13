/* Progressive same-origin navigation: retain the piano element and guide between pages. */
(() => {
  "use strict";
  const site = window.Zimo;
  if (!site?.mountDocument || !window.fetch || !window.DOMParser || location.protocol === "file:") return;
  const directory = new URL(".", location.href).pathname;
  // Static Assets canonicalizes /archive.html to /archive on a cold visit.
  // Accept both forms so Back/Forward also works when the entry URL was canonicalized.
  const routes = new Set(["", "index", "archive", "project", "note", "resume", "credits", "index.html", "archive.html", "project.html", "note.html", "resume.html", "credits.html"]);
  const templates = new Map();
  let renderedURL = location.href;
  let controller;
  let sequence = 0;
  let busy = false;
  try { history.scrollRestoration = "manual"; } catch (_) { /* Optional. */ }
  function canVisit(value) {
    const url = value instanceof URL ? value : new URL(value, location.href);
    return url.origin === location.origin && url.pathname.startsWith(directory) && routes.has(url.pathname.slice(directory.length));
  }
  function saveScroll() {
    try { history.replaceState({ ...history.state, zimoScroll: [scrollX, scrollY] }, ""); } catch (_) { /* Optional. */ }
  }
  function scrollToDestination(url, position, keyboard) {
    let anchor;
    try { anchor = url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch (_) { /* Invalid fragment. */ }
    if (position) window.scrollTo({ left: position[0], top: position[1], behavior: "instant" });
    else if (anchor) anchor.scrollIntoView({ behavior: "instant", block: "start" });
    else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (keyboard) {
      const focus = anchor || document.getElementById("main-content");
      if (focus) { focus.setAttribute("tabindex", "-1"); focus.focus({ preventScroll: true }); }
    }
  }
  async function visit(value, options = {}) {
    const url = value instanceof URL ? value : new URL(value, location.href);
    if (!canVisit(url)) return false;
    const requestID = ++sequence;
    controller?.abort();
    controller = new AbortController();
    const requestController = controller;
    const started = performance.now();
    const pause = site.effects?.enabled ? 650 : 0;
    if (!options.pop) saveScroll();
    busy = true;
    document.dispatchEvent(new CustomEvent("zimo:navigationstart"));
    try {
      let text = templates.get(url.pathname);
      if (!text) {
        const response = await fetch(url.href, { signal: requestController.signal, headers: { Accept: "text/html" } });
        if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) throw new Error("Page unavailable");
        text = await response.text();
        templates.set(url.pathname, text);
      }
      const source = new DOMParser().parseFromString(text, "text/html");
      if (!source.body.dataset.page || !source.querySelector("main")) throw new Error("Unsupported page template");
      const remaining = pause - (performance.now() - started);
      if (remaining > 0) await new Promise(resolve => setTimeout(resolve, remaining));
      if (requestID !== sequence) return false;
      if (!options.pop) history.pushState({ zimoScroll: [0, 0] }, "", url);
      site.mountDocument(source);
      renderedURL = location.href;
      scrollToDestination(url, options.position, options.keyboard);
      document.dispatchEvent(new CustomEvent("zimo:navigationend", { detail: { url: url.href } }));
      return true;
    } catch (error) {
      if (error.name === "AbortError" || requestID !== sequence) return false;
      // If enhancement fails, a normal page visit still works. Never execute fetched scripts.
      document.dispatchEvent(new CustomEvent("zimo:navigationend"));
      location.assign(url.href);
      return false;
    } finally { if (requestID === sequence) busy = false; }
  }
  document.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const target = event.target instanceof Element ? event.target : null;
    const link = target?.closest("a[href]");
    if (!link || link.target || link.hasAttribute("download") || link.hasAttribute("data-no-scene") || link.classList.contains("skip-link")) return;
    const url = new URL(link.href, document.baseURI);
    if (!canVisit(url)) return;
    const sameDocument = url.pathname === location.pathname && url.search === location.search;
    if (sameDocument && url.hash) return;
    event.preventDefault();
    if (sameDocument && !url.hash) { window.scrollTo({ top: 0, behavior: "instant" }); return; }
    visit(url, { keyboard: event.detail === 0 });
  });
  window.addEventListener("popstate", event => {
    const before = new URL(renderedURL);
    const url = new URL(location.href);
    if (before.pathname === url.pathname && before.search === url.search) {
      renderedURL = url.href;
      scrollToDestination(url, event.state?.zimoScroll, false);
      return;
    }
    visit(url, { pop: true, position: event.state?.zimoScroll });
  });
  window.addEventListener("pagehide", saveScroll);
  window.addEventListener("hashchange", () => { renderedURL = location.href; });
  document.addEventListener("zimo:languagechange", () => { renderedURL = location.href; });
  site.navigation = { visit, canVisit, get busy() { return busy; } };
})();
