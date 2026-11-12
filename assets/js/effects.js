/* Gentle sakura trails and an original wishing-tree scene. No framework, audio, or tracking. */
(() => {
  "use strict";
  const site = window.Zimo;
  if (!site) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let enabled = storagePreference();
  let transitioning = false;
  let navigationTimer;
  let arrivalTimer;
  let frameRequest = 0;
  let lastFrame = 0;
  let lastSpawn = 0;
  let lastAmbient = performance.now();
  let width = innerWidth;
  let height = innerHeight;
  let scale = Math.min(devicePixelRatio || 1, 2);
  let revealObserver;
  const revealAnimations = new Set();
  const revealed = new WeakSet();
  const petals = [];
  const canvas = document.createElement("canvas");
  canvas.className = "sakura-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.append(canvas);
  const context = canvas.getContext("2d", { alpha: true });
  const overlay = document.createElement("div");
  overlay.className = "scene-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `<div class="scene-glow"></div><div class="scene-tree"><img src="assets/images/wishing-tree-scene.webp" width="1536" height="1024" alt=""></div><div class="scene-copy"><p id="scene-words"></p><span>ZIMO’S LITTLE CORNER OF THE WORLD</span></div><div class="scene-petals">${Array.from({ length: 27 }, (_, i) => `<i style="--x:${(i * 37.3 + 5) % 100}%;--delay:${(i % 7) * -.19}s;--duration:${1.6 + (i % 5) * .19}s;--size:${9 + (i % 5) * 3}px;--drift:${(i % 2 ? 1 : -1) * (60 + i * 3)}px;--turn:${130 + i * 41}deg"></i>`).join("")}</div>`;
  document.body.append(overlay);
  function storagePreference() {
    const saved = site.storage.get("effects");
    return !reducedMotion.matches && saved !== "off";
  }
  function syncLabels() {
    document.querySelectorAll("[data-toggle-effects]").forEach(button => {
      button.setAttribute("aria-pressed", String(enabled));
      button.setAttribute("aria-label", site.t(enabled ? "effectsOn" : "effectsOff"));
      const label = button.querySelector("[data-effect-label]");
      if (label) label.textContent = site.t(enabled ? "effectsOn" : "effectsOff");
    });
    document.getElementById("scene-words").textContent = site.t("transitionWords");
  }
  function resize() {
    width = innerWidth;
    height = innerHeight;
    scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context?.setTransform(scale, 0, 0, scale, 0, 0);
  }
  function addPetal(x, y, trail = false) {
    if (!enabled || petals.length >= 64) return;
    petals.push({
      x, y, size: trail ? 4 + Math.random() * 5 : 5 + Math.random() * 5,
      vx: (Math.random() - .5) * (trail ? 65 : 26) - 9,
      vy: trail ? 25 + Math.random() * 35 : 24 + Math.random() * 21,
      angle: Math.random() * Math.PI * 2, spin: (Math.random() - .5) * 1.7,
      phase: Math.random() * Math.PI * 2, age: 0, life: trail ? 2.1 + Math.random() * 1.6 : 17 + Math.random() * 8,
      opacity: trail ? .52 + Math.random() * .2 : .23 + Math.random() * .18,
      trail
    });
  }
  function drawPetal(petal, timestamp) {
    const alpha = petal.opacity * Math.min(1, petal.age * 4) * Math.min(1, (petal.life - petal.age) * 1.2);
    context.save();
    context.translate(petal.x, petal.y);
    context.rotate(petal.angle);
    context.scale(.7 + Math.sin(timestamp / 650 + petal.phase) * .25, 1);
    context.globalAlpha = Math.max(0, alpha);
    const s = petal.size;
    const gradient = context.createLinearGradient(-s, -s, s, s);
    gradient.addColorStop(0, "#f8d3e2");
    gradient.addColorStop(.65, "#e6a7c3");
    gradient.addColorStop(1, "#d995b5");
    context.fillStyle = gradient;
    context.beginPath();
    context.moveTo(0, s);
    context.bezierCurveTo(-s * 1.35, s * .05, -s * .9, -s * 1.05, -s * .13, -s * .72);
    context.lineTo(0, -s * .4);
    context.lineTo(s * .16, -s * .77);
    context.bezierCurveTo(s * 1.12, -s * .9, s * 1.1, s * .1, 0, s);
    context.fill();
    context.restore();
  }
  function animate(timestamp) {
    frameRequest = 0;
    if (!enabled || document.hidden || !context) return;
    if (timestamp - lastFrame < 30) { frameRequest = requestAnimationFrame(animate); return; }
    const dt = Math.min((timestamp - (lastFrame || timestamp)) / 1000, .06);
    lastFrame = timestamp;
    context.clearRect(0, 0, width, height);
    if (timestamp - lastAmbient > 1050) {
      addPetal(Math.random() * width, -18);
      lastAmbient = timestamp;
    }
    for (let i = petals.length - 1; i >= 0; i--) {
      const petal = petals[i];
      petal.age += dt;
      petal.x += (petal.vx + Math.sin(timestamp / 1100 + petal.phase) * 17) * dt;
      petal.y += petal.vy * dt;
      petal.angle += petal.spin * dt;
      if (petal.age > petal.life || petal.y > height + 25 || petal.x < -60 || petal.x > width + 60) petals.splice(i, 1);
      else drawPetal(petal, timestamp);
    }
    frameRequest = requestAnimationFrame(animate);
  }
  function start() {
    if (!frameRequest && enabled && !document.hidden && context) {
      lastFrame = 0;
      frameRequest = requestAnimationFrame(animate);
    }
  }
  function stop() { cancelAnimationFrame(frameRequest); frameRequest = 0; context?.clearRect(0, 0, width, height); }
  function finishScene() {
    clearTimeout(arrivalTimer);
    clearTimeout(navigationTimer);
    overlay.classList.remove("is-visible");
    transitioning = false;
  }
  function showScene() {
    transitioning = true;
    overlay.classList.add("is-visible");
  }
  function setEnabled(value, remember = true) {
    enabled = Boolean(value) && !reducedMotion.matches;
    if (remember) site.storage.set("effects", enabled ? "on" : "off");
    canvas.hidden = !enabled;
    document.documentElement.dataset.effects = enabled ? "on" : "off";
    if (enabled) { start(); observeReveals(); }
    else {
      petals.length = 0; stop(); finishScene(); revealObserver?.disconnect();
      revealAnimations.forEach(animation => animation.cancel());
      revealAnimations.clear();
    }
    syncLabels();
  }
  function observeReveals() {
    revealObserver?.disconnect();
    if (!enabled || !("IntersectionObserver" in window) || !Element.prototype.animate) return;
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || revealed.has(entry.target)) return;
        revealed.add(entry.target);
        revealObserver.unobserve(entry.target);
        // Do not animate already-visible content or hide content before it is read.
        if (entry.boundingClientRect.top < innerHeight * .35) return;
        const animation = entry.target.animate([
          { opacity: .35, transform: "translateY(17px)" },
          { opacity: 1, transform: "translateY(0)" }
        ], { duration: 650, easing: "cubic-bezier(.2,.65,.3,1)", fill: "none" });
        revealAnimations.add(animation);
        animation.finished.catch(() => {}).finally(() => revealAnimations.delete(animation));
      });
    }, { threshold: .07, rootMargin: "0px 0px -20px 0px" });
    document.querySelectorAll(".section-heading, .project-card, .compact-project, .research-card, .research-methods, .note-card, .about-card, .contact-panel").forEach(element => {
      if (!revealed.has(element)) revealObserver.observe(element);
    });
  }
  document.addEventListener("pointermove", event => {
    if (!enabled || transitioning || event.pointerType !== "mouse") return;
    const now = performance.now();
    if (now - lastSpawn < 42) return;
    lastSpawn = now;
    for (let i = 0; i < 2; i++) addPetal(event.clientX + (Math.random() - .5) * 22, event.clientY + (Math.random() - .5) * 13, true);
  }, { passive: true });
  document.addEventListener("pointerdown", event => {
    if (!enabled || transitioning) return;
    for (let i = 0; i < 5; i++) addPetal(event.clientX + (Math.random() - .5) * 30, event.clientY + (Math.random() - .5) * 20, true);
  }, { passive: true });
  document.addEventListener("click", event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const toggle = target.closest("[data-toggle-effects]");
    if (toggle) { setEnabled(!enabled); return; }
    if (!enabled || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = target.closest("a[href]");
    if (!link || link.classList.contains("skip-link") || link.hasAttribute("data-no-scene") || link.target === "_blank" || link.hasAttribute("download")) return;
    const url = new URL(link.href, document.baseURI);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
    const sameDocument = url.pathname === location.pathname && url.search === location.search;
    const anchor = sameDocument && url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
    if (sameDocument && !anchor) return;
    event.preventDefault();
    if (transitioning) return;
    showScene();
    if (anchor) {
      navigationTimer = setTimeout(() => {
        try { history.pushState({}, "", url); } catch (_) { /* Optional for file://. */ }
        anchor.scrollIntoView({ behavior: "instant", block: "start" });
        if (event.detail === 0) {
          anchor.setAttribute("tabindex", "-1");
          anchor.focus({ preventScroll: true });
        }
        arrivalTimer = setTimeout(finishScene, 180);
      }, 580);
    } else {
      navigationTimer = setTimeout(() => {
        try { sessionStorage.setItem("zimo.scene.incoming", "true"); } catch (_) { /* Optional. */ }
        location.assign(url.href);
      }, 650);
    }
  });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && transitioning) finishScene(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); else start(); });
  document.addEventListener("zimo:languagechange", () => { syncLabels(); observeReveals(); });
  document.addEventListener("zimo:contentchange", observeReveals);
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pageshow", event => { if (event.persisted) { finishScene(); start(); } });
  reducedMotion.addEventListener("change", () => setEnabled(storagePreference(), false));
  site.effects = { setEnabled, get enabled() { return enabled; }, get transitioning() { return transitioning; }, get particleCount() { return petals.length; } };
  resize();
  setEnabled(enabled, false);
  let incoming = false;
  let visited = false;
  try {
    incoming = sessionStorage.getItem("zimo.scene.incoming") === "true";
    visited = sessionStorage.getItem("zimo.scene.visited") === "true";
    sessionStorage.removeItem("zimo.scene.incoming");
    sessionStorage.setItem("zimo.scene.visited", "true");
  } catch (_) { /* A session store is not required. */ }
  if (enabled && !document.hidden && (incoming || !visited)) {
    showScene();
    arrivalTimer = setTimeout(finishScene, incoming ? 500 : 1350);
  }
})();
