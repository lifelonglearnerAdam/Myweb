/* Optional, dependency-free storyboard enhancement. The Markdown is the source of truth. */
export function mount(article, { language, site }) {
  const zh = language === "zh";
  const words = zh ? {
    frames: "分镜", play: "自动阅读", pause: "暂停阅读", previous: "上一镜", next: "下一镜",
    chapters: "跳到章节", close: "关闭大图", zoom: "放大图像", original: "原文与来源",
    hint: "向下滚动，像看一部没有声音的短片。", pace: "自动阅读滚动间隔", seconds: "秒 / 屏",
    art: "IMAGE2.6 概念插画 · 非网络拓扑或实验截图", diagram: "原理图解 · 不按物理距离绘制",
    evidence: "实际浏览器截图 · 仅作本次观察记录", references: "片尾 / 来源与方法", detail: "放大细节", fit: "适应屏幕"
  } : {
    frames: "SCENES", play: "Auto read", pause: "Pause", previous: "Previous scene", next: "Next scene",
    chapters: "Go to a chapter", close: "Close image", zoom: "Enlarge image", original: "Text & sources",
    hint: "Scroll through a quiet, illustrated field film.", pace: "Automatic reading interval", seconds: "sec / screen",
    art: "IMAGE2.6 concept art · not topology or experimental evidence", diagram: "Explanatory diagram · not physical distances",
    evidence: "Actual browser capture · one observation, not an uptime promise", references: "CREDITS / SOURCES & METHOD", detail: "Zoom details", fit: "Fit to screen"
  };
  const controller = new AbortController();
  const { signal } = controller;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let timer;
  let playing = false;
  let current = 0;
  let scheduled = false;
  let stopped = false;
  let selectedImage;
  let previousFocus;

  if (!document.getElementById("visual-story-css")) {
    const css = document.createElement("link");
    css.id = "visual-story-css";
    css.rel = "stylesheet";
    css.href = new URL("../css/visual-story.css?v=1.0", import.meta.url).href;
    document.head.append(css);
  }
  const source = article.querySelector(".markdown-body");
  const layout = article.querySelector(".note-reading-layout");
  const noteBody = article.querySelector(".note-article");
  if (!source || !layout || !noteBody) return () => controller.abort();
  article.querySelector(".note-toc")?.remove();
  layout.className = "story-layout";
  noteBody.className = "story-timeline";
  source.className = "story-scenes";
  const scenes = [];
  let section;
  for (const node of Array.from(source.childNodes)) {
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "H2") {
      section = document.createElement("section");
      section.className = "story-scene";
      section.setAttribute("aria-labelledby", node.id);
      section.dataset.scene = String(scenes.length);
      source.append(section);
      scenes.push(section);
    }
    if (section) section.append(node);
    else if (node.nodeType === Node.ELEMENT_NODE) node.classList.add("story-intro");
  }
  const images = [];
  scenes.forEach((scene, index) => {
    const heading = scene.querySelector("h2");
    const paragraphs = Array.from(scene.children).filter(node => node !== heading);
    const visualParagraphs = paragraphs.filter(node => node.tagName === "P" && node.querySelector("img") && !node.textContent.trim());
    const visuals = document.createElement("div");
    visuals.className = "story-visuals";
    visualParagraphs.forEach(paragraph => {
      const image = paragraph.querySelector("img");
      const figure = document.createElement("figure");
      const zoom = document.createElement("button");
      zoom.type = "button";
      zoom.className = "story-zoom";
      zoom.setAttribute("aria-label", `${words.zoom}: ${image.alt}`);
      zoom.setAttribute("aria-haspopup", "dialog");
      zoom.dataset.image = String(images.length);
      image.decoding = "async";
      image.width = 1440;
      image.height = 960;
      const filename = image.getAttribute("src") || "";
      const isArt = /(?:rendezvous-art|gate-art)\.webp$/.test(filename);
      figure.className = `story-frame${isArt ? " story-frame-art" : ""}`;
      zoom.append(image);
      const caption = document.createElement("figcaption");
      caption.textContent = isArt ? words.art : filename.endsWith(".svg") ? words.diagram : words.evidence;
      figure.append(zoom, caption);
      visuals.append(figure);
      paragraph.remove();
      images.push({ image, label: heading.textContent, kind: caption.textContent, button: zoom });
    });
    const header = document.createElement("header");
    header.className = "story-scene-heading";
    const number = document.createElement("span");
    number.className = "story-scene-number";
    number.textContent = String(index + 1).padStart(2, "0");
    number.setAttribute("aria-hidden", "true");
    header.append(number, heading);
    scene.prepend(header);
    const copy = document.createElement("div");
    copy.className = "story-copy prose";
    for (const paragraph of paragraphs) if (paragraph.parentElement === scene) copy.append(paragraph);
    scene.append(visuals, copy);
    if (!visualParagraphs.length) scene.classList.add("story-credits");
  });

  const controls = document.createElement("nav");
  controls.className = "story-controls";
  controls.setAttribute("aria-label", words.frames);
  const count = document.createElement("span");
  count.className = "story-counter";
  count.setAttribute("aria-live", "polite");
  count.setAttribute("aria-atomic", "true");
  const picker = document.createElement("select");
  picker.className = "story-picker";
  picker.setAttribute("aria-label", words.chapters);
  scenes.forEach((scene, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${String(index + 1).padStart(2, "0")} / ${scene.querySelector("h2").textContent}`;
    picker.append(option);
  });
  const button = (label, glyph, className = "") => {
    const element = document.createElement("button");
    element.type = "button";
    element.className = `story-control-button ${className}`.trim();
    element.setAttribute("aria-label", label);
    element.title = label;
    element.textContent = glyph;
    return element;
  };
  const previous = button(words.previous, "←");
  const next = button(words.next, "→");
  const play = button(words.play, `▶ ${words.play}`, "story-play");
  play.setAttribute("aria-pressed", "false");
  const pace = document.createElement("select");
  pace.className = "story-pace";
  pace.setAttribute("aria-label", words.pace);
  for (const seconds of [20, 30, 45]) {
    const option = document.createElement("option");
    option.value = String(seconds * 1000);
    option.textContent = `${seconds} ${words.seconds}`;
    pace.append(option);
  }
  const progress = document.createElement("progress");
  progress.className = "story-progress";
  progress.max = scenes.length;
  progress.value = 1;
  progress.setAttribute("aria-label", words.frames);
  controls.append(count, picker, previous, play, pace, next, progress);
  layout.before(controls);
  const hint = document.createElement("p");
  hint.className = "story-scroll-hint";
  hint.textContent = words.hint;
  article.querySelector(".story-hero")?.append(hint);

  const dialog = document.createElement("dialog");
  dialog.className = "story-lightbox";
  dialog.setAttribute("aria-label", words.zoom);
  const close = button(words.close, "×", "story-lightbox-close");
  const detail = button(words.detail, words.detail, "story-lightbox-detail");
  detail.setAttribute("aria-pressed", "false");
  const viewport = document.createElement("div");
  viewport.className = "story-lightbox-viewport";
  viewport.tabIndex = 0;
  viewport.setAttribute("role", "region");
  viewport.setAttribute("aria-label", words.detail);
  const enlarged = document.createElement("img");
  viewport.append(enlarged);
  const description = document.createElement("p");
  description.id = "story-lightbox-caption";
  dialog.setAttribute("aria-describedby", description.id);
  dialog.append(close, detail, viewport, description);
  detail.addEventListener("click", () => {
    const expanded = dialog.classList.toggle("is-zoomed");
    detail.textContent = expanded ? words.fit : words.detail;
    detail.setAttribute("aria-label", expanded ? words.fit : words.detail);
    detail.setAttribute("aria-pressed", String(expanded));
  }, { signal });
  article.append(dialog);
  function closeDialog() {
    if (dialog.open) dialog.close();
  }
  close.addEventListener("click", closeDialog, { signal });
  dialog.addEventListener("click", event => { if (event.target === dialog) closeDialog(); }, { signal });
  dialog.addEventListener("close", () => {
    enlarged.removeAttribute("src");
    previousFocus?.focus({ preventScroll: true });
  }, { signal });
  article.addEventListener("click", event => {
    const target = event.target.closest("button[data-image]");
    if (!target) return;
    pause();
    selectedImage = images[Number(target.dataset.image)];
    previousFocus = target;
    enlarged.src = selectedImage.image.src;
    enlarged.alt = selectedImage.image.alt;
    description.textContent = `${selectedImage.label} · ${selectedImage.kind} · ${selectedImage.image.alt}`;
    dialog.classList.remove("is-zoomed");
    detail.textContent = words.detail;
    detail.setAttribute("aria-label", words.detail);
    detail.setAttribute("aria-pressed", "false");
    dialog.showModal();
    close.focus();
  }, { signal });

  function updateCurrent(index) {
    current = Math.max(0, Math.min(scenes.length - 1, index));
    count.textContent = `${String(current + 1).padStart(2, "0")} / ${String(scenes.length).padStart(2, "0")}`;
    picker.value = String(current);
    progress.value = current + 1;
    previous.disabled = current === 0;
    next.disabled = current === scenes.length - 1;
    scenes.forEach((scene, number) => scene.classList.toggle("is-current", number === current));
  }
  function jump(index) {
    const target = Math.max(0, Math.min(scenes.length - 1, index));
    scenes[target].scrollIntoView({ behavior: reduced.matches ? "instant" : "smooth", block: "start" });
    updateCurrent(target);
  }
  function pause() {
    clearTimeout(timer);
    playing = false;
    play.textContent = `▶ ${words.play}`;
    play.setAttribute("aria-label", words.play);
    play.setAttribute("aria-pressed", "false");
  }
  function queueNext() {
    clearTimeout(timer);
    if (!playing || stopped) return;
    timer = setTimeout(() => {
      const remaining = scenes[current].getBoundingClientRect().bottom - innerHeight + 50;
      if (remaining > 80) {
        // Show the rest of tall scenes (including captions), never jump past it.
        window.scrollBy({ top: Math.min(innerHeight * 0.68, remaining), behavior: reduced.matches ? "instant" : "smooth" });
      } else if (current === scenes.length - 1) {
        return pause();
      } else {
        jump(current + 1);
      }
      queueNext();
    }, Number(pace.value));
  }
  play.addEventListener("click", () => {
    if (playing) return pause();
    playing = true;
    play.textContent = `Ⅱ ${words.pause}`;
    play.setAttribute("aria-label", words.pause);
    play.setAttribute("aria-pressed", "true");
    if (current === scenes.length - 1) jump(0);
    else jump(current);
    queueNext();
  }, { signal });
  previous.addEventListener("click", () => { pause(); jump(current - 1); }, { signal });
  next.addEventListener("click", () => { pause(); jump(current + 1); }, { signal });
  picker.addEventListener("change", () => { pause(); jump(Number(picker.value)); }, { signal });
  pace.addEventListener("change", queueNext, { signal });
  window.addEventListener("wheel", pause, { signal, passive: true });
  window.addEventListener("touchstart", pause, { signal, passive: true });
  window.addEventListener("keydown", event => {
    if (["Escape", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End", " "].includes(event.key)) pause();
  }, { signal });
  document.addEventListener("visibilitychange", () => { if (document.hidden) pause(); }, { signal });
  reduced.addEventListener("change", pause, { signal });
  function measure() {
    if (stopped) return;
    const top = controls.getBoundingClientRect().bottom + 40;
    let active = 0;
    scenes.forEach((scene, index) => {
      if (scene.getBoundingClientRect().top < Math.max(top, innerHeight * 0.32)) active = index;
    });
    if (active !== current) updateCurrent(active);
    scheduled = false;
  }
  window.addEventListener("scroll", () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(measure); }
  }, { signal, passive: true });
  window.addEventListener("resize", measure, { signal, passive: true });
  updateCurrent(0);
  measure();
  article.dataset.storyReady = "true";
  const api = { get current() { return current; }, get playing() { return playing; }, count: scenes.length, pause, jump };
  if (site) site.story = api;
  return () => {
    stopped = true;
    pause();
    controller.abort();
    closeDialog();
    dialog.remove();
    if (site?.story === api) delete site.story;
  };
}
