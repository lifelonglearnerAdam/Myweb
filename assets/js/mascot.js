/* Independent sprite animator; artwork attribution and non-commercial terms: credits.html. */
(() => {
  "use strict";
  const site = window.Zimo;
  const root = document.getElementById("mascot-root");
  if (!site || !root) return;
  const { t, icon, localHref, storage, escapeHTML } = site;
  const smallScreen = window.matchMedia("(max-width: 860px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const preference = storage.get("mascot");
  let expanded = preference ? preference === "open" : !smallScreen.matches;
  let bubbleOpen = false;
  let messageKey = "mascotGreeting";
  let replyIndex = 0;
  let textureReady = false;
  let textureRequested = false;
  let frameRequest = 0;
  let lookResetTimer;
  let bubbleTimer;
  let greetingTimer;
  let ambientTimer;
  let ambientIndex = 0;
  let lastAmbientSection;
  let lastSpeechAt = 0;
  let lastPointerUpdate = 0;
  let current = { name: "idle", row: 0, frames: 7, fps: 3.5, once: false, started: performance.now(), frame: -1 };
  const animations = {
    idle: { row: 0, frames: 7, fps: 3.5 },
    right: { row: 1, frames: 8, fps: 8 },
    left: { row: 2, frames: 8, fps: 8 },
    wave: { row: 3, frames: 4, fps: 5 },
    jump: { row: 4, frames: 5, fps: 7 },
    sleepy: { row: 5, frames: 8, fps: 4 },
    waiting: { row: 6, frames: 6, fps: 4 },
    thinking: { row: 7, frames: 6, fps: 4 },
    review: { row: 8, frames: 6, fps: 4 }
  };
  root.innerHTML = `<div class="mascot" id="susu-mascot"><div class="mascot-bubble" id="susu-bubble" hidden><div class="mascot-bubble-title"><span id="susu-name"></span><button type="button" id="susu-dismiss">×</button></div><p class="mascot-message" id="susu-message"></p><nav class="mascot-choices" id="susu-choices"></nav></div><button class="mascot-stage is-loading" id="susu-stage" type="button" aria-controls="susu-bubble" aria-expanded="false"></button><div class="mascot-controls"><button type="button" id="susu-greet"></button><button class="mascot-minimize" type="button" id="susu-minimize">−</button></div></div><button class="mascot-launch" id="susu-launch" type="button" aria-controls="susu-mascot" aria-expanded="false"><img src="assets/images/susu-idle.webp" width="31" height="34" alt=""><span id="susu-launch-label"></span></button>`;
  const mascot = document.getElementById("susu-mascot");
  const stage = document.getElementById("susu-stage");
  const bubble = document.getElementById("susu-bubble");
  const launcher = document.getElementById("susu-launch");
  const message = document.getElementById("susu-message");
  function updateLabels() {
    mascot.setAttribute("aria-label", t("mascotName"));
    document.getElementById("susu-name").textContent = t("mascotName");
    stage.setAttribute("aria-label", t("mascotTalk"));
    launcher.setAttribute("aria-label", t("mascotOpen"));
    document.getElementById("susu-launch-label").textContent = site.language === "zh" ? "苏苏向导" : "Susu";
    document.getElementById("susu-greet").textContent = site.language === "zh" ? "点点我 ✧" : "Say hi ✧";
    document.getElementById("susu-minimize").setAttribute("aria-label", t("mascotClose"));
    document.getElementById("susu-dismiss").setAttribute("aria-label", site.language === "zh" ? "关闭向导提示" : "Dismiss guide message");
    message.textContent = t(messageKey);
    document.getElementById("susu-choices").setAttribute("aria-label", site.language === "zh" ? "向导快捷导航" : "Guide shortcuts");
    document.getElementById("susu-choices").innerHTML = [["projects", "mascotProject"], ["research", "mascotResearch"], ["contact", "mascotContact"]].map(([section, key]) => `<a href="${site.page === "home" ? `#${section}` : localHref(`index.html#${section}`)}" data-susu-section="${section}">${escapeHTML(t(key))}</a>`).join("");
  }
  function setPose(row, col) {
    if (!textureReady) return;
    stage.style.backgroundPosition = `${-col * 144}px ${-row * 156}px`;
  }
  function stopAnimation() { cancelAnimationFrame(frameRequest); frameRequest = 0; }
  function animate(timestamp) {
    frameRequest = 0;
    if (!expanded || document.hidden || !textureReady || reducedMotion.matches) return;
    if (current.name !== "look") {
      const elapsedFrames = Math.floor((timestamp - current.started) * current.fps / 1000);
      if (current.once && elapsedFrames >= current.frames) {
        play("idle");
        return;
      }
      const frame = elapsedFrames % current.frames;
      if (frame !== current.frame) { current.frame = frame; setPose(current.row, frame); }
    }
    frameRequest = requestAnimationFrame(animate);
  }
  function startAnimation() {
    if (!frameRequest && expanded && !document.hidden && textureReady && !reducedMotion.matches) frameRequest = requestAnimationFrame(animate);
  }
  function play(name, once = false) {
    clearTimeout(lookResetTimer);
    const animation = animations[name] || animations.idle;
    current = { ...animation, name, once, started: performance.now(), frame: -1 };
    setPose(animation.row, 0);
    startAnimation();
  }
  function loadTexture() {
    if (textureRequested) { startAnimation(); return; }
    textureRequested = true;
    const image = new Image();
    image.onload = () => {
      if (image.naturalWidth !== 1536 || image.naturalHeight !== 2288) return;
      textureReady = true;
      stage.classList.remove("is-loading");
      stage.style.backgroundImage = 'url("assets/images/susu-spritesheet.webp")';
      play("idle");
    };
    image.onerror = () => { /* Keep the small static fallback usable. */ };
    image.src = "assets/images/susu-spritesheet.webp";
  }
  function showBubble(key = messageKey, autoHide = false) {
    clearTimeout(bubbleTimer);
    messageKey = key;
    lastSpeechAt = performance.now();
    message.textContent = t(key);
    bubbleOpen = true;
    bubble.hidden = false;
    stage.setAttribute("aria-expanded", "true");
    if (autoHide) bubbleTimer = setTimeout(() => {
      if (!bubble.matches(":hover") && !bubble.contains(document.activeElement)) hideBubble();
    }, 9000);
  }
  function hideBubble() {
    clearTimeout(bubbleTimer);
    bubbleOpen = false;
    bubble.hidden = true;
    stage.setAttribute("aria-expanded", "false");
  }
  function setExpanded(value, remember = true) {
    expanded = value;
    mascot.hidden = !expanded;
    launcher.hidden = expanded;
    launcher.setAttribute("aria-expanded", String(expanded));
    if (remember) storage.set("mascot", expanded ? "open" : "closed");
    if (expanded) { loadTexture(); scheduleAmbient(); }
    else { hideBubble(); stopAnimation(); clearTimeout(greetingTimer); clearTimeout(ambientTimer); }
  }
  function scheduleAmbient() {
    clearTimeout(ambientTimer);
    if (!expanded || document.hidden || reducedMotion.matches) return;
    ambientTimer = setTimeout(() => {
      if (expanded && !document.hidden && !bubbleOpen && !site.effects?.transitioning && performance.now() - lastSpeechAt > 45000) {
        const section = document.querySelector('[data-nav-section][aria-current="location"]')?.dataset.navSection;
        const contexts = { projects: "mascotAtProjects", research: "mascotAtResearch", writing: "mascotAtWriting", about: "mascotAtAbout", contact: "mascotAtContact" };
        const hour = new Date().getHours();
        let key;
        if (section && section !== lastAmbientSection) { key = contexts[section]; lastAmbientSection = section; }
        else if ((hour >= 23 || hour < 6) && ambientIndex % 4 === 0) key = "mascotNight";
        else key = `mascotAmbient${ambientIndex % 4 + 1}`;
        ambientIndex++;
        showBubble(key, true);
        play(section === "research" ? "thinking" : "waiting", true);
      }
      scheduleAmbient();
    }, 52000 + Math.random() * 18000);
  }
  function greet() {
    const key = replyIndex === 0 ? "mascotGreeting" : `mascotReply${(replyIndex - 1) % 4 + 1}`;
    replyIndex++;
    showBubble(key);
    play(replyIndex % 3 === 0 ? "jump" : "wave", true);
  }
  stage.addEventListener("click", greet);
  document.getElementById("susu-greet").addEventListener("click", greet);
  launcher.addEventListener("click", () => { setExpanded(true); showBubble("mascotGreeting"); play("wave", true); stage.focus({ preventScroll: true }); });
  document.getElementById("susu-minimize").addEventListener("click", () => { setExpanded(false); launcher.focus({ preventScroll: true }); });
  document.getElementById("susu-dismiss").addEventListener("click", () => { hideBubble(); stage.focus({ preventScroll: true }); });
  document.getElementById("susu-choices").addEventListener("click", event => {
    const link = event.target.closest("[data-susu-section]");
    if (!link) return;
    play("jump", true);
    hideBubble();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && bubbleOpen) {
      const restoreFocus = bubble.contains(document.activeElement);
      hideBubble();
      if (restoreFocus) stage.focus({ preventScroll: true });
    }
  });
  document.addEventListener("pointermove", event => {
    const now = performance.now();
    if (!expanded || !textureReady || reducedMotion.matches || event.pointerType !== "mouse" || now - lastPointerUpdate < 120 || current.once) return;
    const bounds = stage.getBoundingClientRect();
    const dx = event.clientX - (bounds.left + bounds.width / 2);
    const dy = event.clientY - (bounds.top + bounds.height * .38);
    if (Math.hypot(dx, dy) < 55) return;
    lastPointerUpdate = now;
    const angle = (Math.atan2(dx, -dy) + Math.PI * 2) % (Math.PI * 2);
    const direction = Math.round(angle / (Math.PI * 2) * 16) % 16;
    current = { ...current, name: "look", once: false };
    setPose(9 + Math.floor(direction / 8), direction % 8);
    clearTimeout(lookResetTimer);
    lookResetTimer = setTimeout(() => play("idle"), 900);
  }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { stopAnimation(); clearTimeout(ambientTimer); }
    else if (expanded) { current.started = performance.now(); startAnimation(); scheduleAmbient(); }
  });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) { stopAnimation(); setPose(0, 0); clearTimeout(ambientTimer); }
    else { play("idle"); scheduleAmbient(); }
  });
  smallScreen.addEventListener("change", event => { if (!storage.get("mascot")) setExpanded(!event.matches, false); });
  document.addEventListener("zimo:languagechange", updateLabels);
  updateLabels();
  setExpanded(expanded, false);
  let greeted = false;
  try { greeted = sessionStorage.getItem("zimo.susu.greeted") === "true"; } catch (_) { /* Optional. */ }
  if (expanded && !greeted) {
    greetingTimer = setTimeout(() => {
      if (!expanded || document.hidden) return;
      showBubble("mascotGreeting", true);
      play("wave", true);
      try { sessionStorage.setItem("zimo.susu.greeted", "true"); } catch (_) { /* Optional. */ }
    }, 1600);
  }
})();
