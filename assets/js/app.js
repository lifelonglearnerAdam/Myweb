(() => {
  "use strict";
  const data = window.PORTFOLIO;
  if (!data) return;
  let page = document.body.dataset.page || "home";
  const storage = {
    get(key) { try { return localStorage.getItem(`zimo.${key}`); } catch (_) { return null; } },
    set(key, value) { try { localStorage.setItem(`zimo.${key}`, value); } catch (_) { /* Storage is optional. */ } }
  };
  const requestedLanguage = new URLSearchParams(location.search).get("lang");
  const savedLanguage = storage.get("language");
  let language = ["zh", "en"].includes(requestedLanguage) ? requestedLanguage : ["zh", "en"].includes(savedLanguage) ? savedLanguage : "zh";
  let activeFilter = "all";
  let menuOpen = false;
  let sectionObserver;
  let toastTimeout;
  let progressScheduled = false;
  const mobileNavigation = window.matchMedia("(max-width: 860px)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const localize = value => typeof value === "object" && value !== null ? value[language] ?? value.zh ?? "" : value;
  const t = key => data.ui[language][key] ?? data.ui.zh[key] ?? key;
  const iconPaths = {
    github: '<path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7m12 5v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.9a5.4 5.4 0 0 0-1.5-3.8 5 5 0 0 0-.1-3.7S17.6 0 15 1.8a13.2 13.2 0 0 0-6 0C6.4 0 5.3.4 5.3.4a5 5 0 0 0-.1 3.7 5.4 5.4 0 0 0-1.5 3.8c0 5.4 3.2 6.6 6.2 6.9a3.4 3.4 0 0 0-.9 2.6v3.9"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
    graduation: '<path d="m2 9 10-5 10 5-10 5Z"/><path d="M6 11v6c4 3 8 3 12 0v-6M22 9v7"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    message: '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H6l-4 2 1.8-5.1A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 10h8M8 14h5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20.5 13A8.8 8.8 0 0 1 11 3.5 8.8 8.8 0 1 0 20.5 13Z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"/>',
    shield: '<path d="M12 2 3 6v6c0 6 9 10 9 10s9-4 9-10V6Z"/><path d="m8 12 3 3 5-6"/>',
    terminal: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m6 9 3 3-3 3m6 0h5"/>',
    waveform: '<path d="M2 12h2l2-7 4 14 4-14 4 14 2-7h2"/>',
    "arrow-up": '<path d="M12 20V4m-6 6 6-6 6 6"/>',
    print: '<path d="M6 9V3h12v6M6 18H3V9h18v9h-3"/><path d="M6 14h12v8H6ZM17 11h1"/>',
    volume: '<path d="m11 5-6 4H2v6h3l6 4ZM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
    "volume-off": '<path d="m11 5-6 4H2v6h3l6 4Zm5 4 5 6m0-6-5 6"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    external: '<path d="M14 3h7v7m0-7L10 14M10 3H3v18h18v-7"/>'
  };
  function icon(name) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.file}</svg>`;
  }
  function hydrateIcons(root = document) {
    root.querySelectorAll("[data-icon]").forEach(element => { element.innerHTML = icon(element.dataset.icon); });
  }
  function localHref(href) {
    const url = new URL(href, location.href);
    url.searchParams.set("lang", language);
    const originalPath = href.split(/[?#]/)[0];
    return `${originalPath || "index.html"}${url.search}${url.hash}`;
  }
  function externalLink(url, label, className = "text-link") {
    return `<a class="${className}" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer"><span>${escapeHTML(label)}</span><span aria-hidden="true">↗</span></a>`;
  }
  function sectionHref(id) { return id === "archive" ? localHref("archive.html") : id === "winter" ? localHref("winter.html") : page === "home" ? `#${id}` : localHref(`index.html#${id}`); }
  function renderHeader() {
    const root = document.getElementById("site-header");
    if (!root) return;
    root.innerHTML = `<div class="header-inner container"><a class="brand" href="${localHref("index.html")}" aria-label="Zimo · ${t("home")}">zimo<span>.</span></a><button class="icon-button nav-toggle" type="button" id="nav-toggle" aria-controls="profile-sidebar" aria-expanded="false" aria-label="${t("menuOpen")}">${icon("menu")}</button></div><div class="reading-progress" id="reading-progress" aria-hidden="true"></div>`;
    root.querySelector("#nav-toggle").addEventListener("click", () => setMenuOpen(!menuOpen));
    updateReadingProgress();
  }
  function renderSidebar() {
    const root = document.getElementById("profile-sidebar");
    const entries = [["home", localHref("index.html"), "file"], ["writing", localHref("archive.html?kind=notes"), "file"], ["archive", localHref("archive.html"), "search"], ["winter", localHref("winter.html"), "graduation"], ["courses", data.profile.courseRepo, "file"], ["projects", sectionHref("projects"), "terminal"], ["about", sectionHref("about"), "message"]];
    root.innerHTML = `<div class="rail-profile"><a class="rail-avatar" href="${localHref("index.html")}"><img src="assets/images/avatar.webp?v=2.2" width="92" height="92" alt="Zimo’s anime avatar"></a><h2 class="profile-name">${escapeHTML(localize(data.profile.name))}</h2><p class="rail-alias">Zimo / Adam</p><p class="rail-school">${t("profileSchool")}<br>${t("profileMajor")}</p><p class="rail-motto" lang="en">stay young, stay simple,<br>stay hungry, stay foolish</p></div><nav class="sidebar-nav" id="header-navigation" aria-label="${t("sidebarTitle")}">${entries.map(([id, href, glyph]) => `<a href="${href}" data-nav-section="${id}"${href.startsWith("https://") ? ' target="_blank" rel="noopener noreferrer"' : ""}><span class="rail-nav-icon" aria-hidden="true">${icon(glyph)}</span><span>${t(id)}</span></a>`).join("")}</nav><div class="rail-social"><a href="${data.profile.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">${icon("github")}</a><a href="mailto:${data.profile.email}" aria-label="Email · ${data.profile.email}" title="${data.profile.email}">${icon("mail")}</a><button type="button" data-copy-email aria-label="${t("copyPrimaryEmail")}" title="${t("copyPrimaryEmail")}">${icon("copy")}</button></div><div class="rail-tools"><div class="language-switch" role="group" aria-label="${t("language")}"><button type="button" data-language="zh" lang="zh-CN" aria-label="切换到中文" aria-pressed="${language === "zh"}">中</button><button type="button" data-language="en" lang="en" aria-label="Switch to English" aria-pressed="${language === "en"}">EN</button></div><button class="icon-button theme-toggle" type="button" id="theme-toggle"></button></div><p class="rail-count">${data.notes.length} ${t("writing")} <span>·</span> ${data.projects.length} ${t("projects")}</p>`;
    root.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => setLanguage(button.dataset.language)));
    root.querySelector("#theme-toggle").addEventListener("click", toggleTheme);
    root.querySelectorAll("nav a").forEach(link => link.addEventListener("click", () => setMenuOpen(false)));
    setMenuOpen(false); updateThemeButton();
  }
  function updateReadingProgress() {
    const progress = document.getElementById("reading-progress");
    const range = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${range > 0 ? Math.max(0, Math.min(1, scrollY / range)) : 0})`;
    progressScheduled = false;
  }
  window.addEventListener("scroll", () => {
    if (!progressScheduled) { progressScheduled = true; requestAnimationFrame(updateReadingProgress); }
  }, { passive: true });
  window.addEventListener("resize", updateReadingProgress, { passive: true });
  function setMenuOpen(open, restoreFocus = false) {
    menuOpen = open;
    const nav = document.getElementById("header-navigation");
    const button = document.getElementById("nav-toggle");
    if (!nav || !button) return;
    nav.hidden = mobileNavigation.matches && !open;
    const sidebar = document.getElementById("profile-sidebar");
    sidebar.hidden = mobileNavigation.matches && !open;
    sidebar.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", t(open ? "menuClose" : "menuOpen"));
    button.innerHTML = icon(open ? "close" : "menu");
    if (restoreFocus) button.focus();
  }
  function updateThemeButton() {
    const dark = document.documentElement.dataset.theme === "dark";
    const button = document.getElementById("theme-toggle");
    if (button) {
      button.innerHTML = icon(dark ? "sun" : "moon");
      button.setAttribute("aria-label", t(dark ? "light" : "dark"));
      button.title = t(dark ? "light" : "dark");
    }
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = dark ? "#151925" : "#f5f6fb";
  }
  function toggleTheme() {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    storage.set("theme", theme);
    updateThemeButton();
    document.dispatchEvent(new CustomEvent("zimo:themechange", { detail: { theme } }));
  }
  function renderFooter() {
    const root = document.getElementById("site-footer");
    if (!root) return;
    root.innerHTML = `<div class="footer-left"><a class="brand" href="${localHref("index.html")}" aria-label="Zimo · ${t("home")}">zimo<span>.</span></a><span>© ${new Date().getFullYear()} ${escapeHTML(localize(data.profile.name))} <span aria-hidden="true">·</span> ${t("footerText")}</span></div><div class="footer-right"><a href="${localHref("credits.html")}">${t("credits")} ↗</a><button class="footer-motion" type="button" data-toggle-effects aria-pressed="true"><span aria-hidden="true">✿</span><span data-effect-label>${t("effectsOn")}</span></button><span class="footer-status"><i aria-hidden="true"></i>${t("updated")}</span></div>`;
  }
  function translateStaticContent() {
    document.querySelectorAll("[data-i18n]").forEach(element => { element.textContent = t(element.dataset.i18n); });
    document.querySelectorAll("[data-profile]").forEach(element => { element.textContent = localize(data.profile[element.dataset.profile]); });
    const alias = document.querySelector(".profile-alias");
    if (alias) alias.innerHTML = `${language === "zh" ? "Zimo Zeng" : "曾子墨"} <span>/</span> Adam`;
    document.querySelectorAll("[data-local-link]").forEach(link => {
      if (!link.dataset.originalHref) link.dataset.originalHref = link.getAttribute("href");
      link.href = localHref(link.dataset.originalHref);
    });
    document.querySelectorAll("[data-email]").forEach(link => {
      const address = link.dataset.email === "secondary" ? data.profile.secondaryEmail : data.profile.email;
      link.href = `mailto:${address}`;
      if (link.hasAttribute("data-email-text")) link.textContent = address;
    });
    document.querySelectorAll("[data-count]").forEach(element => {
      const value = element.dataset.count === "projects" ? data.projects.length : data.notes.length;
      element.textContent = String(value).padStart(2, "0");
    });
    const filters = document.querySelector(".filters");
    if (filters) filters.setAttribute("aria-label", t("filterLabel"));
    document.querySelectorAll("[data-copy-email]").forEach(button => { button.setAttribute("aria-label", t("copyEmail")); button.title = t("copyEmail"); });
    document.getElementById("profile-sidebar")?.setAttribute("aria-label", t("sidebarLabel"));
    document.getElementById("back-top")?.setAttribute("aria-label", t("backTop"));
    hydrateIcons();
  }
  function projectCard(project) {
    const name = escapeHTML(localize(project.name));
    const href = localHref(`project.html?id=${project.id}`);
    const primaryLink = project.links.find(link => link.kind === "demo") || project.links.find(link => link.kind === "source");
    return `<article class="project-card panel" data-project="${project.id}"><a class="project-cover" href="${href}" tabindex="-1" aria-hidden="true"><img src="${project.cover}" width="1000" height="620" alt="" loading="lazy" decoding="async"><span class="cover-arrow">↗</span></a><div class="project-body"><p class="project-label">${escapeHTML(localize(project.label))}</p><h3><a href="${href}">${name}</a></h3><p class="project-summary">${escapeHTML(localize(project.summary))}</p><div class="stack-tags">${project.stack.map(stack => `<span class="stack-tag">${escapeHTML(stack)}</span>`).join("")}</div><div class="project-bottom"><span class="project-status">${escapeHTML(localize(project.status))}</span><div class="project-links"><a href="${href}" aria-label="${name} · ${t("details")}">${t("details")} <span aria-hidden="true">↗</span></a>${primaryLink ? `<a href="${escapeHTML(primaryLink.url)}" target="_blank" rel="noopener noreferrer" aria-label="${name} · ${t(primaryLink.kind)}" title="${t(primaryLink.kind)}">${icon(primaryLink.kind === "source" ? "github" : "external")}</a>` : ""}</div></div></div></article>`;
  }
  function renderProjects() {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;
    const projects = data.projects.filter(project => project.featured && (activeFilter === "all" || project.category === activeFilter));
    grid.innerHTML = projects.map(projectCard).join("");
    document.getElementById("project-count").textContent = `${String(projects.length).padStart(2, "0")} ${t("resultCount")}`;
    document.querySelectorAll("[data-filter]").forEach(button => {
      const active = button.dataset.filter === activeFilter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const compact = document.getElementById("compact-projects");
    compact.innerHTML = data.projects.filter(project => !project.featured && project.category === "engineering").map(project => `<a class="compact-project panel" href="${localHref(`project.html?id=${project.id}`)}"><span class="compact-project-icon">${icon(project.icon)}</span><div><h4>${escapeHTML(localize(project.name))}</h4><p>${escapeHTML(project.stack.join(" · "))}</p></div><span class="compact-arrow" aria-hidden="true">↗</span></a>`).join("");
    document.dispatchEvent(new CustomEvent("zimo:contentchange"));
  }
  function renderNotes() {
    const root = document.getElementById("notes-list");
    if (!root) return;
    root.innerHTML = data.notes.length ? data.notes.map(note => `<a class="note-card panel" href="${localHref(`note.html?id=${note.id}`)}"><div class="note-content"><div class="note-meta"><span>${escapeHTML(localize(note.category))}</span><span>${note.minutes} ${t("minutes")}</span>${note.date ? `<time datetime="${note.date}">${note.date}</time>` : ""}</div><h3>${escapeHTML(localize(note.title))}</h3><p>${escapeHTML(localize(note.summary))}</p></div><span class="note-arrow" aria-hidden="true">↗</span></a>`).join("") : `<div class="empty-notes panel"><span class="eyebrow">NOTES</span><h3>${t("noNotesTitle")}</h3><p>${t("noNotesText")}</p><a class="text-link" href="${localHref("winter.html")}">${t("winterRead")} ↗</a></div>`;
  }
  function renderPoetry() {
    document.querySelectorAll("#main-content > .poetry-card").forEach(element => element.remove());
    document.querySelector(".intro-signature")?.remove();
    document.querySelector(".intro")?.insertAdjacentHTML("beforeend", `<p class="intro-signature"><span>WHAT’S UP</span><q lang="en">${escapeHTML(data.profile.motto)}</q></p>`);
    for (const poem of data.poems || []) {
      const target = document.getElementById(poem.before);
      if (!target) continue;
      target.insertAdjacentHTML("beforebegin", `<figure class="poetry-card panel"><div class="poetry-photo"><img src="${poem.image}" width="900" height="540" alt="" loading="lazy" decoding="async"><a href="${escapeHTML(poem.imageSource)}" target="_blank" rel="noopener noreferrer" class="poetry-photo-credit">© ${escapeHTML(poem.imageAuthor)} · ${escapeHTML(poem.imageLicense)}</a></div><figcaption><p class="eyebrow">${escapeHTML(poem.theme)}</p><blockquote class="poetry-verse" lang="en">${escapeHTML(poem.lines)}</blockquote><p class="poetry-byline">${escapeHTML(poem.author)} <span aria-hidden="true">/</span> <a href="${escapeHTML(poem.source)}" target="_blank" rel="noopener noreferrer">${escapeHTML(poem.work)} ↗</a></p></figcaption></figure>`);
    }
  }
  function renderResearch() {
    const root = document.getElementById("research-workspace");
    if (!root) return;
    const projects = data.researchInterests || [];
    root.innerHTML = `<div class="research-workspace-heading"><h3>${t("researchWorkspace")}</h3><p>${t("researchWorkspaceNote")}</p></div><div class="research-workspace-grid">${projects.map((project, index) => `<article class="research-workspace-card panel"><div class="research-workspace-top"><span class="eyebrow">R / 0${index + 1}</span><span class="project-status">${escapeHTML(localize(project.status))}</span></div><h4>${escapeHTML(localize(project.name))}</h4><p>${escapeHTML(localize(project.summary))}</p><div class="stack-tags">${project.stack.slice(0, 3).map(stack => `<span class="stack-tag">${escapeHTML(stack)}</span>`).join("")}</div></article>`).join("")}</div><div class="research-reading"><span class="eyebrow">${t("researchReading")}</span><p>${t("researchReadingText")}</p></div>`;
  }
  function renderCoursework() {
    const root = document.getElementById("coursework");
    if (!root) return;
    const courses = language === "zh" ? [
      ["程序设计与数据结构", "C / C++、链表、树与图、排序与查找。"],
      ["计算机系统与数字逻辑", "系统基础实验、CS:APP 自学与逻辑电路训练。"],
      ["模式识别", "KNN、随机森林与 SVM 分类对照，数据预处理与交叉验证。"],
      ["程序设计综合实践", "SAT 求解、约束编码与可复现实验。"]
    ] : [
      ["Programming & data structures", "C/C++, lists, trees, graphs, sorting, and search."],
      ["Computer systems & digital logic", "Systems coursework, CS:APP self-study, and logic circuits."],
      ["Pattern recognition", "KNN, random forest, and SVM comparisons, preprocessing, and cross-validation."],
      ["Integrated programming practice", "SAT solving, constraint encoding, and reproducible experiments."]
    ];
    root.innerHTML = courses.map((course, i) => `<div class="course-item"><span aria-hidden="true">0${i + 1}</span><div><h4>${course[0]}</h4><p>${course[1]}</p></div></div>`).join("");
  }
  function archiveState() {
    const params = new URLSearchParams(location.search);
    return { query: (params.get("q") || "").slice(0, 120), kind: ["projects", "notes"].includes(params.get("kind")) ? params.get("kind") : "all" };
  }
  function updateArchiveState(changes) {
    const url = new URL(location.href);
    for (const [key, value] of Object.entries(changes)) {
      if (!value || value === "all") url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    }
    try { history.replaceState(history.state, "", url); } catch (_) { /* Optional for file previews. */ }
    renderArchiveResults();
  }
  function renderArchiveResults() {
    const root = document.getElementById("archive-results");
    if (!root) return;
    const state = archiveState();
    const tokens = state.query.normalize("NFKC").toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    const items = [
      ...data.projects.map(project => ({ id: project.id, type: "projects", title: project.name, summary: project.summary, label: project.label, stack: project.stack, href: `project.html?id=${project.id}` })),
      ...data.notes.map(note => ({ id: note.id, type: "notes", title: note.title, summary: note.summary, label: note.category, stack: [], href: `note.html?id=${note.id}` }))
    ].filter(item => {
      if (state.kind !== "all" && item.type !== state.kind) return false;
      const text = [item.title.zh, item.title.en, item.summary.zh, item.summary.en, item.label.zh, item.label.en, ...item.stack].join(" ").normalize("NFKC").toLocaleLowerCase();
      return tokens.every(token => text.includes(token));
    });
    document.getElementById("archive-count").textContent = `${String(items.length).padStart(2, "0")} ${t("archiveCount")}`;
    document.querySelectorAll("[data-archive-kind]").forEach(button => {
      const active = button.dataset.archiveKind === state.kind;
      button.setAttribute("aria-pressed", String(active));
      button.classList.toggle("is-active", active);
    });
    root.innerHTML = items.length ? items.map((item, index) => `<a class="archive-entry panel" href="${localHref(item.href)}"><span class="archive-entry-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span><div class="archive-entry-body"><div class="archive-entry-meta"><span>${t(item.type === "projects" ? "archiveProjects" : "archiveNotes")}</span><span>${escapeHTML(localize(item.label))}</span></div><h2>${escapeHTML(localize(item.title))}</h2><p>${escapeHTML(localize(item.summary))}</p>${item.stack.length ? `<div class="stack-tags">${item.stack.map(stack => `<span class="stack-tag">${escapeHTML(stack)}</span>`).join("")}</div>` : ""}</div><span class="archive-entry-arrow" aria-hidden="true">↗</span></a>`).join("") : `<div class="archive-empty panel"><span aria-hidden="true">✧</span><h2>${t("archiveEmpty")}</h2><p>${t("archiveEmptyText")}</p><button class="button button-secondary" type="button" id="clear-archive">${t("clearSearch")}</button></div>`;
    document.getElementById("clear-archive")?.addEventListener("click", () => {
      document.getElementById("archive-query").value = "";
      updateArchiveState({ q: "", kind: "all" });
      document.getElementById("archive-query").focus();
    });
    updateReadingProgress();
  }
  function renderArchive() {
    const root = document.getElementById("archive-content");
    if (!root) return;
    const state = archiveState();
    root.innerHTML = `<a class="breadcrumb" href="${localHref("index.html")}">← ${t("backHome")}</a><header class="archive-heading"><p class="eyebrow">${t("archiveEyebrow")}</p><h1 id="archive-title">${t("archiveTitle")}</h1><p>${t("archiveDescription")}</p></header><div class="archive-search panel"><label class="sr-only" for="archive-query">${t("archiveSearch")}</label><span aria-hidden="true">${icon("search")}</span><input id="archive-query" type="search" maxlength="120" autocomplete="off" spellcheck="false" placeholder="${t("archivePlaceholder")}" value="${escapeHTML(state.query)}"></div><div class="project-toolbar"><div class="filters" role="group" aria-label="${t("archive")}">${[["all", "archiveAll"], ["projects", "archiveProjects"], ["notes", "archiveNotes"]].map(([kind, key]) => `<button class="filter" type="button" data-archive-kind="${kind}" aria-pressed="false">${t(key)}</button>`).join("")}</div><p class="project-count" id="archive-count" aria-live="polite" aria-atomic="true"></p></div><div class="archive-results" id="archive-results"></div>`;
    root.querySelector("#archive-query").addEventListener("input", event => updateArchiveState({ q: event.target.value }));
    root.querySelectorAll("[data-archive-kind]").forEach(button => button.addEventListener("click", () => updateArchiveState({ kind: button.dataset.archiveKind })));
    renderArchiveResults();
    return t("archive");
  }
  function notFound(root) {
    root.innerHTML = `<section class="not-found panel"><span aria-hidden="true">404 /</span><h1>${t("notFoundTitle")}</h1><p>${t("notFoundText")}</p><a class="button button-primary" href="${localHref("index.html")}">${t("backHome")} ↗</a></section>`;
    return t("notFoundTitle");
  }
  function renderProject() {
    const root = document.getElementById("detail-content");
    if (!root) return;
    const project = data.projects.find(item => item.id === new URLSearchParams(location.search).get("id"));
    if (!project) return notFound(root);
    const title = localize(project.name);
    root.innerHTML = `<a class="breadcrumb" href="${localHref("index.html#projects")}"><span aria-hidden="true">←</span>${t("backProjects")}</a><article><header class="document-header panel"><p class="eyebrow">${escapeHTML(localize(project.label))}</p><h1>${escapeHTML(title)}</h1><p class="document-lede">${escapeHTML(localize(project.summary))}</p><div class="document-meta"><span>${escapeHTML(localize(project.scope))}</span><span>· ${escapeHTML(localize(project.status))}</span></div></header>${project.cover ? `<div class="document-cover"><img src="${project.cover}" width="1000" height="620" alt="${escapeHTML(title)} · ${language === "zh" ? "项目预览" : "Project preview"}"></div>` : ""}<div class="document-grid"><div class="document-article panel prose"><section><h2>${t("projectOverview")}</h2><p>${escapeHTML(localize(project.overview))}</p></section><section><h2>${t("projectHighlights")}</h2><ul>${localize(project.highlights).map(text => `<li>${escapeHTML(text)}</li>`).join("")}</ul></section><section><h2>${t("projectBoundary")}</h2><p class="document-boundary">${escapeHTML(localize(project.boundary))}</p></section></div><aside class="document-side panel"><div class="side-section"><h2>${t("projectStack")}</h2><div class="stack-tags">${project.stack.map(text => `<span class="stack-tag">${escapeHTML(text)}</span>`).join("")}</div></div><div class="side-section"><h2>${t("projectScope")}</h2><p>${escapeHTML(localize(project.scope))}</p></div>${project.links.length ? `<div class="side-section"><h2>${t("projectLinks")}</h2>${project.links.map(link => externalLink(link.url, t(link.kind), "button button-secondary")).join("")}</div>` : ""}</aside></div></article><div class="document-bottom panel"><a class="text-link" href="${localHref("index.html#projects")}"><span>← ${t("relatedProjects")}</span></a>${externalLink(data.profile.github, "GitHub")}</div>`;
    return title;
  }
  function renderNote() {
    const root = document.getElementById("detail-content");
    if (!root) return;
    const note = data.notes.find(item => item.id === new URLSearchParams(location.search).get("id"));
    if (!note) return notFound(root);
    const toc = localize(note.toc) || [];
    const index = data.notes.indexOf(note);
    const neighbors = [data.notes[index - 1], data.notes[index + 1]].filter(Boolean);
    root.innerHTML = `<a class="breadcrumb" href="${localHref("archive.html?kind=notes")}">← ${t("allNotes")}</a><article><header class="document-header panel"><p class="eyebrow">${escapeHTML(localize(note.category))}</p><h1>${escapeHTML(localize(note.title))}</h1><p class="document-lede">${escapeHTML(localize(note.summary))}</p><div class="document-meta"><span>${escapeHTML(localize(data.profile.name))}</span><span>${note.minutes} ${t("minutes")}</span>${note.date ? `<time datetime="${note.date}">${note.date}</time>` : ""}${!note.languages.includes(language) ? `<span>${t("originalLanguage")}</span>` : ""}</div></header><div class="note-reading-layout">${toc.length ? `<aside class="note-toc panel" aria-label="${t("noteToc")}"><h2>${t("noteToc")}</h2><nav>${toc.map(item => `<a href="#${item.id}" data-no-scene>${escapeHTML(item.title)}</a>`).join("")}</nav></aside>` : ""}<div class="note-article panel"><div class="prose markdown-body">${localize(note.html)}</div></div></div></article><div class="document-bottom panel"><a class="text-link" href="${localHref("archive.html?kind=notes")}">← ${t("allNotes")}</a><button class="button button-plain" type="button" data-copy-link>${icon("copy")}<span>${t("copyLink")}</span></button></div>${neighbors.map(item => `<a class="article-neighbor panel" href="${localHref(`note.html?id=${item.id}`)}">${escapeHTML(localize(item.title))} ↗</a>`).join("")}`;
    return localize(note.title);
  }
  function renderWinter() {
    const root = document.getElementById("winter-content");
    const guide = window.WINTER_GUIDE;
    if (!root || !guide) return;
    let saved;
    try { saved = JSON.parse(storage.get("winter.progress") || "{}"); } catch (_) { saved = {}; }
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) saved = {};
    const task = item => `<label class="winter-task"><input type="checkbox" data-winter-task="${item.id}" ${saved[item.id] ? "checked" : ""}><span><strong>${escapeHTML(localize(item.title))}</strong><span>${escapeHTML(localize(item.text))}</span></span></label>`;
    root.innerHTML = `<a class="breadcrumb" href="${localHref("index.html")}">← ${t("home")}</a><header class="winter-intro panel"><p class="eyebrow">WINTER NOTES</p><h1>${escapeHTML(localize(guide.title))}</h1><p>${escapeHTML(localize(guide.intro))}</p><p class="winter-plan-note">${escapeHTML(localize(guide.note))}</p></header><div class="winter-reading-layout"><aside class="winter-index panel"><h2>${t("noteToc")}</h2><nav><a href="#winter-common" data-no-scene>${t("winterCommon")}</a>${guide.tracks.map(track => `<a href="#winter-${track.id}" data-no-scene><span>${track.number}</span>${escapeHTML(localize(track.name))}</a>`).join("")}</nav><div class="winter-progress"><span>${t("winterProgress")}</span><p id="winter-progress-count" aria-live="polite"></p><progress id="winter-progress" max="19" value="0"></progress><button type="button" id="winter-reset">${t("winterReset")}</button><p>${t("winterLocal")}</p></div></aside><div class="winter-chapters"><section class="winter-chapter panel" id="winter-common"><h2>${t("winterCommon")}</h2>${guide.common.map(task).join("")}</section>${guide.tracks.map(track => `<section class="winter-chapter panel" id="winter-${track.id}"><p class="eyebrow">${track.number} / ${track.label}</p><h2>${escapeHTML(localize(track.name))}</h2><p class="winter-track-summary">${escapeHTML(localize(track.summary))}</p>${track.steps.map(task).join("")}<div class="winter-extra"><h3>${t("winterExtra")}</h3><p>${escapeHTML(localize(track.extra))}</p></div><h3 class="winter-resource-title">${t("winterResources")}</h3><div class="winter-resources">${track.links.map(link => externalLink(link.url, link.label)).join("")}</div></section>`).join("")}</div></div>`;
    const refresh = () => {
      const inputs = [...root.querySelectorAll("[data-winter-task]")];
      const done = inputs.filter(input => input.checked).length;
      root.querySelector("#winter-progress-count").textContent = `${done} / ${inputs.length}`;
      root.querySelector("#winter-progress").max = inputs.length;
      root.querySelector("#winter-progress").value = done;
    };
    root.querySelectorAll("[data-winter-task]").forEach(input => input.addEventListener("change", () => {
      saved[input.dataset.winterTask] = input.checked;
      storage.set("winter.progress", JSON.stringify(saved)); refresh();
    }));
    root.querySelector("#winter-reset").addEventListener("click", () => {
      saved = {}; storage.set("winter.progress", "{}");
      root.querySelectorAll("[data-winter-task]").forEach(input => { input.checked = false; }); refresh();
    });
    refresh(); return localize(guide.title);
  }
  function renderResume() {
    const root = document.getElementById("resume-content");
    if (!root) return;
    const selected = data.projects.filter(project => project.featured);
    const research = data.projects.filter(project => project.id === "monkeyocr");
    root.innerHTML = `<header class="resume-heading"><h1>${t("resumeTitle")}</h1><p class="resume-role">${t("resumeRole")}</p><div class="resume-contact"><a href="mailto:${data.profile.email}">${data.profile.email}</a><a href="${data.profile.github}" target="_blank" rel="noopener noreferrer">github.com/lifelonglearnerAdam</a><a href="https://lifelonglearneradam.github.io/Myweb/">lifelonglearneradam.github.io/Myweb/</a></div></header><section class="resume-section"><h2>${t("resumeSummaryTitle")}</h2><p>${t("resumeSummary")}</p></section><section class="resume-section"><h2>${t("educationTitle")}</h2><div class="resume-row"><h3>${t("educationSchool")}</h3><span>${t("educationTime")}</span></div><p>${t("educationMajor")}</p></section><section class="resume-section"><h2>${t("resumeResearch")}</h2>${research.map(project => `<div class="resume-project"><h3>${escapeHTML(localize(project.name))}</h3><p>${escapeHTML(localize(project.resume))}</p></div>`).join("")}</section><section class="resume-section"><h2>${t("resumeProjects")}</h2>${selected.map(project => `<div class="resume-project"><div class="resume-row"><h3>${escapeHTML(localize(project.name))}</h3><span>${escapeHTML(localize(project.status))}</span></div><p class="resume-stack">${project.stack.join(" · ")}</p><p>${escapeHTML(localize(project.resume))}</p><a class="resume-project-link" href="${project.links.find(link => link.kind === "source").url}">${project.links.find(link => link.kind === "source").url.replace("https://", "")}</a></div>`).join("")}</section><section class="resume-section"><h2>${t("resumeSkills")}</h2><div class="resume-skills"><div><h3>${t("skillLanguages")}</h3><p>C / C++ · Python · JavaScript / TypeScript</p></div><div><h3>${t("skillProduct")}</h3><p>Flutter · SQLite · NestJS · PostgreSQL</p></div><div><h3>${t("skillAI")}</h3><p>Document Parsing · Error Analysis · Model APIs</p></div><div><h3>${t("skillWorkflow")}</h3><p>Git · Linux · Testing · CI</p></div></div><p style="margin-top:8px">${language === "zh" ? "课程实践：数据结构、计算机系统、数字逻辑、模式识别；C99 SAT 求解器（DPLL / CDCL）与数独约束编码。" : "Course practice: data structures, computer systems, digital logic, and pattern recognition; a C99 SAT solver (DPLL/CDCL) with Sudoku constraint encoding."}</p></section><p class="resume-footnote">${t("resumeFootnote")}</p>`;
    return t("viewResume");
  }
  function renderCredits() {
    const root = document.getElementById("detail-content");
    if (!root) return;
    const zh = language === "zh";
    root.innerHTML = `<a class="breadcrumb" href="${localHref("index.html")}">← ${t("backHome")}</a><article class="document-header panel"><p class="eyebrow">MADE WITH CARE / THANK YOU</p><h1>${t("credits")}</h1><div class="prose" style="margin-top:30px"><section><h2>${zh ? "设计参考" : "Design references"}</h2><p>${zh ? "页面的信息结构受到学长的 Suwa shrine 启发：大幅头图、个人侧栏、内容卡片与陪伴式向导。排版与留白也参考了 Anthropic 和 Brittany Chiang 的个人网站。本网站的布局与交互为独立实现。樱花古树场景由 gpt-image-2.6 生成并压缩为 WebP，按苦情树意象创作，不是官方动画截图；项目示意图为重新设计，不复用参考站的角色插画、文章或个人资料。" : "The page structure is inspired by Suwa shrine: a panoramic header, personal sidebar, content cards, and a companion guide. Typography and spacing also take cues from Anthropic and Brittany Chiang’s portfolio. The layout and interactions were implemented independently. The original wishing-tree scene was generated with gpt-image-2.6 and compressed to WebP, not extracted from an official animation; project schematics were designed separately; reference-site artwork, articles, and personal information are not reused."}</p><p>${externalLink("https://sukunahust.moe", "Suwa shrine")} &nbsp; · &nbsp; ${externalLink("https://www.anthropic.com", "Anthropic")} &nbsp; · &nbsp; ${externalLink("https://brittanychiang.com", "Brittany Chiang")}</p></section><section><h2>${zh ? "涂山苏苏 · 同人动画向导" : "Tushan Susu · Fan-art animated guide"}</h2><p>${zh ? "动画素材由 legeling 提供，来自 awesome-codex-pet 的 tushan-susu--legeling。该素材是 AI 生成的社区同人演绎，并非《狐妖小红娘》官方模型或官方 Live2D；角色及原作权利归各自权利人所有。" : "Animation artwork by legeling, from the tushan-susu--legeling package in awesome-codex-pet. It is an AI-generated community fan interpretation, not an official Fox Spirit Matchmaker asset or Live2D model. Character and franchise rights remain with their respective owners."}</p><p>${zh ? "素材按来源标注仅用于非商业场景，遵循 CC BY-NC 4.0 与素材包中的非商业限制。本网站对精灵图进行有损 WebP 压缩，并独立实现网页动画、视线跟随与导航交互；未使用第三方桌宠运行时。若用于商业产品，请先更换素材或另行取得授权。" : "The artwork is used non-commercially under the source’s CC BY-NC 4.0 and package-specific non-commercial restriction. The atlas was recompressed to WebP; animation playback, directional looking, and site navigation were implemented independently, without a third-party pet runtime. Replace the artwork or obtain permission before commercial reuse."}</p><p>${externalLink("https://github.com/legeling/awesome-codex-pet/tree/main/pets/tushan-susu--legeling", zh ? "素材来源与作者" : "Artwork & creator")} &nbsp; · &nbsp; ${externalLink("https://creativecommons.org/licenses/by-nc/4.0/", "CC BY-NC 4.0")}</p></section><section><h2>${zh ? "项目图片与数据" : "Project imagery & data"}</h2><p>${zh ? "DocSift 与 AI 新品决策引擎的封面来自各项目公开演示页面。QuantPilot 与子墨记账封面为界面示意，图表不对应个人研究或实际收支；研究插图为原图 / 标注 / 预测对照的方法示意。头像由 gpt-image-2.6 生成，是以涂山苏苏为灵感的非官方同人插画，不使用真人照片；向导动画与头像为不同素材，分别说明来源。" : "DocSift and the AI Product Decision Engine covers are screenshots of their public demos. QuantPilot and Zimo Ledger covers are interface studies, not private research or personal financial records. The research diagram illustrates image/GT/prediction comparison. The profile avatar is a gpt-image-2.6-generated, non-official fan-art interpretation inspired by Tushan Susu, not a personal photograph. The avatar and animated guide are separate assets with separate provenance."}</p></section><section id="poetry-credit"><h2>${zh ? "诗句与摄影" : "Poetry & photography"}</h2><p>${zh ? "诗句为署名短摘，不把名家作品当作本站原创。仅保留英文原文、作者与篇名，不附中文翻译或解读。照片来自 Wikimedia Commons，已裁切与压缩；以下署名与各自许可适用于处理后的照片。" : "Poems are brief attributed excerpts, not claimed as original writing for this site. Only the English excerpts, author names, and titles are displayed, with links to the source texts. Photographs come from Wikimedia Commons and were cropped and compressed; their respective credits and licenses apply to these versions."}</p><ul>${(data.poems || []).map(poem => `<li>${escapeHTML(poem.author)} · ${externalLink(poem.source, poem.work)}<br>${escapeHTML(poem.imageAuthor)} · ${externalLink(poem.imageSource, poem.imageLicense)}</li>`).join("")}</ul></section><section id="music-credit"><h2>${zh ? "背景音乐 · 卡农钢琴版" : "Background piano · Canon in D"}</h2><p>${zh ? "曲目：Johann Pachelbel《D 大调卡农》钢琴改编；演奏：Lee Galloway。录音来自 Wikimedia Commons 的 Pachelbel’s Canon.ogg，按 CC BY-SA 3.0 授权使用。录音未经剪辑或转码，仅设置播放器音量与单曲循环；原曲进入公有领域不意味着演奏录音没有版权，因此保留演奏者与录音许可署名。" : "Johann Pachelbel’s Canon in D, piano transcription performed by Lee Galloway. The recording is Pachelbel’s Canon.ogg from Wikimedia Commons, licensed under CC BY-SA 3.0. The audio is unmodified; only playback volume and looping are configured. The composition’s public-domain status does not erase rights in the performance, so performer and recording-license attribution are retained."}</p><p>${externalLink("https://commons.wikimedia.org/wiki/File:Pachelbel%27s_Canon.ogg", zh ? "录音来源与许可" : "Recording source & license")} &nbsp; · &nbsp; ${externalLink("https://www.leegalloway.com/", "Lee Galloway")} &nbsp; · &nbsp; ${externalLink("https://creativecommons.org/licenses/by-sa/3.0/", "CC BY-SA 3.0")}</p></section><section><h2>${zh ? "隐私与站点行为" : "Privacy & site behavior"}</h2><p>${zh ? "本网站没有广告或第三方评论系统，托管平台可能提供基础安全与性能统计。固定向导台词在本地显示；只有主动发送“聊一句”时，当前文字及最多十六轮聊天历史才会通过 Cloudflare 后端发送给模型服务，不附带网站内容、私有研究、文件或个人配置。前后端不记录聊天正文；限频服务短期保存按日加盐的来源标识与计数，不保存原始 IP。请勿在聊天中输入隐私；模型服务有其自身的数据政策。语言、主题、音乐与向导偏好保存在本机。" : "There are no ads or third-party comments; the hosting platform may provide basic security and performance metrics. Preset guide lines run locally. Only an explicitly sent chat message and up to sixteen previous turns go through a Cloudflare proxy to the model service—never page content, private research, files, or configuration. The site does not log dialogue; the rate limiter briefly stores daily salted source identifiers and counts, not raw IP addresses. Please do not enter private information. The model provider has its own data policies. Language, theme, music, and guide preferences remain local."}</p></section></div></article>`;
    return t("credits");
  }
  function updateMetadata(title) {
    document.title = page === "home" ? t("pageTitle") : `${title || t("pageTitle")} — ${localize(data.profile.name)}`;
    const id = new URLSearchParams(location.search).get("id");
    const item = page === "project" ? data.projects.find(project => project.id === id) : page === "note" ? data.notes.find(note => note.id === id) : null;
    const summary = item ? localize(item.summary) : page === "resume" ? t("resumeSummary") : t("pageDescription");
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = summary;
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", summary);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && item) canonical.href = `https://lifelonglearneradam.github.io/Myweb/${page}.html?id=${encodeURIComponent(id)}`;
  }
  function observeSections() {
    sectionObserver?.disconnect();
    if (page !== "home" || !("IntersectionObserver" in window)) return;
    sectionObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActiveSection(visible[0].target.id);
    }, { rootMargin: "-15% 0px -60% 0px", threshold: 0 });
    document.querySelectorAll("main > section[id]").forEach(section => sectionObserver.observe(section));
  }
  function setActiveSection(id) {
    document.querySelectorAll("[data-nav-section]").forEach(link => {
      if (link.dataset.navSection === id) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  function render() {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    renderHeader();
    renderSidebar();
    translateStaticContent();
    let title;
    if (page === "home") { renderProjects(); renderNotes(); renderCoursework(); renderResearch(); renderPoetry(); }
    else if (page === "project") title = renderProject();
    else if (page === "note") title = renderNote();
    else if (page === "resume") title = renderResume();
    else if (page === "credits") title = renderCredits();
    else if (page === "archive") title = renderArchive();
    else if (page === "winter") title = renderWinter();
    else if (page === "not-found") title = t("notFoundTitle");
    renderFooter();
    updateMetadata(title);
    observeSections();
    if (page !== "home") setActiveSection({ project: "projects", note: "writing", archive: "archive", resume: "about", winter: "winter" }[page]);
    document.dispatchEvent(new CustomEvent("zimo:languagechange", { detail: { language } }));
    // Resolve deep links once, after local content has supplied the target elements.
    const initialRender = !document.body.dataset.rendered;
    document.body.dataset.rendered = "true";
    if (initialRender && location.hash) requestAnimationFrame(() => {
      let id;
      try { id = decodeURIComponent(location.hash.slice(1)); } catch (_) { return; }
      document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    });
  }
  function setLanguage(next) {
    if (!["zh", "en"].includes(next) || next === language) return;
    const focusKey = document.activeElement?.dataset.language;
    language = next;
    storage.set("language", language);
    const url = new URL(location.href);
    url.searchParams.set("lang", language);
    try { history.replaceState(history.state, "", url); } catch (_) { /* file:// may restrict history. */ }
    render();
    if (focusKey) document.querySelector(`[data-language="${next}"]`)?.focus({ preventScroll: true });
  }
  function toast(message) {
    const root = document.getElementById("toast");
    if (!root) return;
    clearTimeout(toastTimeout);
    root.textContent = message;
    root.classList.add("is-visible");
    toastTimeout = setTimeout(() => root.classList.remove("is-visible"), 3500);
  }
  async function copyText(text, successMessage) {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
      else {
        const input = document.createElement("textarea");
        input.value = text;
        input.setAttribute("readonly", "");
        input.style.cssText = "position:fixed;left:-9999px;top:0;";
        document.body.append(input);
        const focused = document.activeElement;
        input.select();
        let copied;
        try { copied = document.execCommand("copy"); } finally { input.remove(); focused?.focus({ preventScroll: true }); }
        if (!copied) throw new Error("Clipboard unavailable");
      }
      toast(successMessage);
    } catch (_) { toast(t("copyFailed")); }
  }
  function pageNodes(doc) {
    const hero = doc.querySelector(".hero");
    const layout = doc.querySelector(".page-layout");
    const main = doc.querySelector("body > main, #page-content > main");
    return hero && layout ? [hero, layout] : main ? [main] : [];
  }
  const pageContent = document.createElement("div");
  pageContent.id = "page-content";
  const initialNodes = pageNodes(document);
  if (initialNodes.length) {
    initialNodes[0].before(pageContent);
    pageContent.append(...initialNodes);
  }
  const siteSidebar = document.createElement("aside");
  siteSidebar.id = "profile-sidebar";
  siteSidebar.className = "site-sidebar";
  document.getElementById("site-header").after(siteSidebar);
  function mountDocument(source) {
    const type = source.body?.dataset.page;
    const nodes = pageNodes(source);
    if (!["home", "project", "note", "archive", "resume", "credits", "winter"].includes(type) || !nodes.length) throw new Error("Unsupported page");
    page = type;
    document.body.dataset.page = type;
    activeFilter = "all";
    const requested = new URLSearchParams(location.search).get("lang");
    if (["zh", "en"].includes(requested)) { language = requested; storage.set("language", language); }
    const imported = nodes.map(node => document.importNode(node, true));
    imported.forEach(node => node.querySelectorAll("script,noscript").forEach(element => element.remove()));
    pageContent.replaceChildren(...imported);
    const canonical = document.querySelector('link[rel="canonical"]');
    const sourceCanonical = source.querySelector('link[rel="canonical"]');
    if (canonical && sourceCanonical) canonical.href = sourceCanonical.href;
    render();
    document.dispatchEvent(new CustomEvent("zimo:contentchange"));
  }
  window.Zimo = { t, localize, localHref, icon, escapeHTML, storage, toast, mountDocument, get language() { return language; }, get page() { return page; } };
  document.addEventListener("click", event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const filter = target.closest("[data-filter]");
    if (filter) { activeFilter = filter.dataset.filter; renderProjects(); }
    if (target.closest("[data-copy-email]")) copyText(data.profile.email, t("emailCopied"));
    if (target.closest("[data-copy-link]")) {
      const url = new URL(location.href);
      url.searchParams.delete("v");
      copyText(url.href, t("linkCopied"));
    }
    if (target.closest("[data-print-resume]")) window.print();
    if (menuOpen && !event.composedPath().includes(document.getElementById("site-header")) && !event.composedPath().includes(document.getElementById("profile-sidebar"))) setMenuOpen(false);
    const section = target.closest("[data-nav-section]");
    if (section) setActiveSection(section.dataset.navSection);
  });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && menuOpen) setMenuOpen(false, true); });
  mobileNavigation.addEventListener("change", () => setMenuOpen(false));
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", event => {
    if (!storage.get("theme")) { document.documentElement.dataset.theme = event.matches ? "dark" : "light"; updateThemeButton(); }
  });
  let backTop = document.getElementById("back-top");
  if (!backTop) {
    backTop = document.createElement("button");
    backTop.id = "back-top";
    backTop.className = "back-top icon-button";
    backTop.type = "button";
    backTop.hidden = true;
    backTop.innerHTML = icon("arrow-up");
    document.body.append(backTop);
  }
  if (backTop) {
    let scheduled = false;
    const update = () => { backTop.hidden = window.scrollY < 650; scheduled = false; };
    window.addEventListener("scroll", () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } }, { passive: true });
    backTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "instant" : "smooth" });
      const homeLink = document.getElementById("profile-sidebar")?.hidden ? document.querySelector(".site-header .brand") : document.querySelector(".rail-avatar");
      homeLink?.focus({ preventScroll: true });
    });
    update();
  }
  render();
})();
