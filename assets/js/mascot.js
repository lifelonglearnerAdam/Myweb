/* Independent, draggable sprite companion. Artwork and non-commercial terms: credits.html. */
(() => {
  "use strict";
  const site = window.Zimo;
  if (!site || site.mascot) return;
  let root = document.getElementById("mascot-root");
  if (!root) { root = document.createElement("div"); root.id = "mascot-root"; document.body.append(root); }
  const { t, localHref, storage, escapeHTML } = site;
  const smallScreen = window.matchMedia("(max-width: 860px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const preference = storage.get("mascot");
  let expanded = preference ? preference === "open" : !smallScreen.matches;
  let bubbleOpen = false, messageKey = "mascotGreeting", replyIndex = 0;
  let textureReady = false, textureRequested = false, frameRequest = 0;
  let lookResetTimer, bubbleTimer, greetingTimer, ambientTimer, gestureTimer;
  let ambientIndex = 0, lastAmbientSection, lastSpeechAt = 0, lastPointerUpdate = 0;
  let drag = null, lastDragAt = -Infinity, customPosition = null;
  let pose = { row: 0, column: 0 }, poseFade;
  let lookDirection = 0, targetDirection = 0, lookStepAt = 0;
  const animations = {
    idle: { row: 0, frames: 7, fps: 3.8 }, right: { row: 1, frames: 8, fps: 9 },
    left: { row: 2, frames: 8, fps: 9 }, wave: { row: 3, frames: 4, fps: 5 },
    jump: { row: 4, frames: 5, fps: 6 }, sleepy: { row: 5, frames: 8, fps: 4 },
    waiting: { row: 6, frames: 6, fps: 4 }, thinking: { row: 7, frames: 6, fps: 4 },
    review: { row: 8, frames: 6, fps: 4 }
  };
  let current = { ...animations.idle, name: "idle", once: false, started: performance.now(), frame: -1 };
  root.innerHTML = `<div class="mascot" id="susu-mascot"><div class="mascot-bubble" id="susu-bubble" hidden><div class="mascot-bubble-title"><span id="susu-name"></span><button type="button" id="susu-dismiss">×</button></div><p class="mascot-message" id="susu-message"></p><nav class="mascot-choices" id="susu-choices"></nav></div><button class="mascot-stage is-loading" id="susu-stage" type="button" aria-controls="susu-bubble" aria-expanded="false" aria-describedby="susu-drag-hint"><span class="mascot-blend" aria-hidden="true"></span></button><span class="sr-only" id="susu-drag-hint"></span><div class="mascot-controls"><button type="button" id="susu-greet"></button><button type="button" id="susu-reset">⌖</button><button class="mascot-minimize" type="button" id="susu-minimize">−</button></div></div><button class="mascot-launch" id="susu-launch" type="button" aria-controls="susu-mascot" aria-expanded="false"><img src="assets/images/susu-idle.webp" width="31" height="34" alt=""><span id="susu-launch-label"></span></button>`;
  const mascot = document.getElementById("susu-mascot"), stage = document.getElementById("susu-stage");
  const bubble = document.getElementById("susu-bubble"), launcher = document.getElementById("susu-launch");
  const message = document.getElementById("susu-message"), blend = stage.querySelector(".mascot-blend");
  function positionKey() { return `mascotPosition.${smallScreen.matches ? "mobile" : "desktop"}`; }
  function readPosition() {
    try {
      const value = JSON.parse(storage.get(positionKey()));
      return value && Number.isFinite(value.x) && Number.isFinite(value.y) ? { x: Math.max(0, Math.min(1, value.x)), y: Math.max(0, Math.min(1, value.y)) } : null;
    } catch (_) { return null; }
  }
  function limits() {
    const rect = mascot.getBoundingClientRect();
    const top = Math.min(82, Math.max(10, innerHeight - rect.height - 10));
    return { minX: 10, minY: top, maxX: Math.max(10, innerWidth - rect.width - 10), maxY: Math.max(top, innerHeight - rect.height - 10) };
  }
  function place(x, y, remember = false) {
    const limit = limits();
    x = Math.max(limit.minX, Math.min(limit.maxX, x));
    y = Math.max(limit.minY, Math.min(limit.maxY, y));
    const music = document.getElementById("music-player")?.getBoundingClientRect();
    const rect = mascot.getBoundingClientRect();
    if (music && x < music.right + 8 && x + rect.width > music.left && y + rect.height > music.top - 8) y = Math.max(limit.minY, music.top - rect.height - 9);
    mascot.style.left = `${x}px`; mascot.style.top = `${y}px`;
    mascot.style.right = "auto"; mascot.style.bottom = "auto";
    customPosition = { x: (x - limit.minX) / (limit.maxX - limit.minX || 1), y: (y - limit.minY) / (limit.maxY - limit.minY || 1) };
    if (remember) storage.set(positionKey(), JSON.stringify(customPosition));
    positionBubble();
  }
  function restorePosition() {
    customPosition = readPosition();
    if (!expanded) return;
    if (!customPosition) {
      for (const property of ["left", "right", "top", "bottom"]) mascot.style.removeProperty(property);
      positionBubble();
      return;
    }
    const limit = limits();
    place(limit.minX + customPosition.x * (limit.maxX - limit.minX), limit.minY + customPosition.y * (limit.maxY - limit.minY));
  }
  function resetPosition() {
    customPosition = null;
    storage.set(positionKey(), "null");
    for (const property of ["left", "right", "top", "bottom"]) mascot.style.removeProperty(property);
    positionBubble();
    play("wave", true);
  }
  function positionBubble() {
    if (!expanded || !bubbleOpen) return;
    const rect = mascot.getBoundingClientRect();
    const view = window.visualViewport;
    const viewLeft = view?.offsetLeft || 0, viewTop = view?.offsetTop || 0;
    const viewWidth = view?.width || innerWidth, viewHeight = view?.height || innerHeight;
    const width = Math.min(bubble.classList.contains("is-chatting") ? 310 : 245, viewWidth - 24);
    bubble.style.width = `${width}px`;
    bubble.style.maxHeight = `${Math.max(160, viewHeight - 28)}px`;
    const height = bubble.offsetHeight;
    const beside = rect.left - viewLeft > width + 4;
    let left = beside ? rect.left - width + 12 : rect.left + rect.width / 2 - width / 2;
    left = Math.max(viewLeft + 12, Math.min(viewLeft + viewWidth - width - 12, left));
    const mouthY = rect.top + stage.getBoundingClientRect().height * .42;
    const preferredTop = beside ? mouthY + 13 - height : rect.top - height - 12;
    const below = !beside && preferredTop < viewTop + 12 && rect.bottom + height + 12 < viewTop + viewHeight;
    const top = Math.max(viewTop + 12, Math.min(viewTop + viewHeight - height - 12, below ? rect.bottom + 12 : preferredTop));
    bubble.style.left = `${left - rect.left}px`; bubble.style.right = "auto";
    bubble.style.top = `${top - rect.top}px`; bubble.style.bottom = "auto";
    bubble.style.setProperty("--tail-y", `${Math.max(18, Math.min(height - 18, mouthY - top))}px`);
    bubble.classList.toggle("is-below", below);
    bubble.classList.toggle("is-beside", beside);
  }
  function updateLabels() {
    mascot.setAttribute("aria-label", t("mascotName"));
    document.getElementById("susu-name").textContent = t("mascotName");
    stage.setAttribute("aria-label", t("mascotTalk")); stage.title = t("mascotHint");
    document.getElementById("susu-drag-hint").textContent = t("mascotTalk");
    launcher.setAttribute("aria-label", t("mascotOpen"));
    document.getElementById("susu-launch-label").textContent = site.language === "zh" ? "苏苏向导" : "Susu";
    document.getElementById("susu-greet").textContent = site.language === "zh" ? "聊一聊 ✧" : "Say hi ✧";
    document.getElementById("susu-reset").setAttribute("aria-label", t("mascotReset"));
    document.getElementById("susu-minimize").setAttribute("aria-label", t("mascotClose"));
    document.getElementById("susu-dismiss").setAttribute("aria-label", site.language === "zh" ? "关闭向导提示" : "Dismiss guide message");
    if (messageKey) message.textContent = t(messageKey);
    const choices = document.getElementById("susu-choices");
    choices.setAttribute("aria-label", site.language === "zh" ? "向导快捷导航" : "Guide shortcuts");
    choices.innerHTML = [["projects", "mascotProject"], ["research", "mascotResearch"], ["contact", "mascotContact"]].map(([section, key]) => `<a href="${site.page === "home" ? `#${section}` : localHref(`index.html#${section}`)}" data-susu-section="${section}">${escapeHTML(t(key))}</a>`).join("");
    positionBubble();
  }
  function setPose(row, column, soften = false) {
    if (!textureReady || (pose.row === row && pose.column === column && stage.dataset.pose)) return;
    poseFade?.cancel();
    if (soften && !reducedMotion.matches) {
      blend.style.backgroundPosition = `${pose.column * 100 / 7}% ${pose.row * 10}%`;
      poseFade = blend.animate([{ opacity: .75 }, { opacity: 0 }], { duration: 110, easing: "ease-out" });
    }
    pose = { row, column };
    stage.style.backgroundPosition = `${column * 100 / 7}% ${row * 10}%`;
    stage.dataset.pose = `${row}:${column}`;
  }
  function stopAnimation() { cancelAnimationFrame(frameRequest); frameRequest = 0; poseFade?.cancel(); }
  function animate(timestamp) {
    frameRequest = 0;
    if (!expanded || document.hidden || !textureReady || reducedMotion.matches) return;
    if (current.name === "look") {
      if (timestamp - lookStepAt > 85) {
        const delta = ((targetDirection - lookDirection + 24) % 16) - 8;
        lookDirection = (lookDirection + Math.sign(delta) + 16) % 16;
        setPose(9 + Math.floor(lookDirection / 8), lookDirection % 8, true);
        lookStepAt = timestamp;
      }
    } else {
      const elapsed = Math.floor((timestamp - current.started) * current.fps / 1000);
      if (current.once && elapsed >= current.frames) { play("idle"); return; }
      const frame = elapsed % current.frames;
      if (frame !== current.frame) { current.frame = frame; setPose(current.row, frame); }
    }
    frameRequest = requestAnimationFrame(animate);
  }
  function startAnimation() {
    if (!frameRequest && expanded && !document.hidden && textureReady && !reducedMotion.matches) frameRequest = requestAnimationFrame(animate);
  }
  function play(name, once = false) {
    clearTimeout(lookResetTimer);
    current = { ...(animations[name] || animations.idle), name, once, started: performance.now(), frame: -1 };
    mascot.dataset.motion = name;
    setPose(current.row, 0, true);
    startAnimation();
  }
  function loadTexture() {
    if (textureRequested) { startAnimation(); return; }
    textureRequested = true;
    const image = new Image();
    image.onload = () => {
      if (image.naturalWidth !== 1536 || image.naturalHeight !== 2288) return;
      textureReady = true; stage.classList.remove("is-loading");
      stage.style.backgroundImage = 'url("assets/images/susu-spritesheet.webp")';
      blend.style.backgroundImage = 'url("assets/images/susu-spritesheet.webp")';
      play("idle");
    };
    image.onerror = () => { textureRequested = false; }; // Keep the small static fallback usable.
    image.src = "assets/images/susu-spritesheet.webp";
  }
  function showBubble(key = messageKey, autoHide = false) {
    clearTimeout(bubbleTimer); messageKey = key; lastSpeechAt = performance.now();
    message.textContent = t(key); bubbleOpen = true; bubble.hidden = false;
    stage.setAttribute("aria-expanded", "true"); positionBubble();
    if (autoHide) bubbleTimer = setTimeout(() => {
      if (!bubble.matches(":hover") && !bubble.contains(document.activeElement)) hideBubble();
    }, 9000);
  }
  function hideBubble() {
    clearTimeout(bubbleTimer); bubbleOpen = false; bubble.hidden = true;
    stage.setAttribute("aria-expanded", "false");
  }
  function scheduleGesture() {
    clearTimeout(gestureTimer);
    if (!expanded || document.hidden || reducedMotion.matches) return;
    gestureTimer = setTimeout(() => {
      if (!drag && !current.once && current.name !== "look" && !site.effects?.transitioning && site.effects?.enabled !== false) {
        const choices = ["waiting", "wave", "review", "thinking"];
        play(choices[Math.floor(Math.random() * choices.length)], true);
      }
      scheduleGesture();
    }, 10000 + Math.random() * 9000);
  }
  function scheduleAmbient() {
    clearTimeout(ambientTimer);
    if (!expanded || document.hidden || reducedMotion.matches) return;
    ambientTimer = setTimeout(() => {
      if (!drag && !bubbleOpen && !site.chat?.active && !site.effects?.transitioning && performance.now() - lastSpeechAt > 20000) {
        const section = document.querySelector('[data-nav-section][aria-current="location"]')?.dataset.navSection;
        const contexts = { projects: "mascotAtProjects", research: "mascotAtResearch", writing: "mascotAtWriting", about: "mascotAtAbout", contact: "mascotAtContact" };
        let key;
        if (contexts[section] && section !== lastAmbientSection) { key = contexts[section]; lastAmbientSection = section; }
        else if ((new Date().getHours() >= 23 || new Date().getHours() < 6) && ambientIndex % 4 === 0) key = "mascotNight";
        else key = `mascotAmbient${ambientIndex % 4 + 1}`;
        ambientIndex++;
        if (site.companionLines) comment(site.companionLines.pick(site.page === "home" ? section : site.page));
        else showBubble(key, true);
        play("waiting", true);
      }
      scheduleAmbient();
    }, 22000 + Math.random() * 16000);
  }
  function setExpanded(value, remember = true) {
    expanded = value; mascot.hidden = !value; launcher.hidden = value;
    launcher.setAttribute("aria-expanded", String(value));
    if (remember) storage.set("mascot", value ? "open" : "closed");
    if (value) { loadTexture(); restorePosition(); scheduleAmbient(); scheduleGesture(); }
    else { hideBubble(); stopAnimation(); [greetingTimer, ambientTimer, gestureTimer, lookResetTimer].forEach(clearTimeout); }
  }
  function greet(event) {
    if (event?.detail !== 0 && performance.now() - lastDragAt < 450) return;
    if (site.chat?.active) { site.chat.open(true); return; }
    if (site.chat?.guide) { site.chat.guide(); return; }
    const key = replyIndex === 0 ? "mascotGreeting" : `mascotReply${(replyIndex - 1) % 4 + 1}`;
    replyIndex++; showBubble(key); play(replyIndex % 3 === 0 ? "jump" : "wave", true);
  }
  stage.addEventListener("pointerdown", event => {
    if (!event.isPrimary || event.button !== 0) return;
    const rect = mascot.getBoundingClientRect();
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top, moved: false };
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener("pointermove", event => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    if (!drag.moved) { drag.moved = true; hideBubble(); mascot.classList.add("is-dragging"); }
    const motion = dx < 0 ? "left" : "right";
    if (current.name !== motion) play(motion);
    place(drag.left + dx, drag.top + dy);
  });
  function finishDrag(event, canceled = false) {
    if (!drag || event.pointerId !== drag.id) return;
    const previous = drag; drag = null;
    mascot.classList.remove("is-dragging");
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    if (!previous.moved) return;
    lastDragAt = performance.now();
    if (canceled) place(previous.left, previous.top);
    else {
      const rect = mascot.getBoundingClientRect();
      place(rect.left, rect.top, true); showBubble("mascotDragged", true);
    }
    play("jump", true);
  }
  stage.addEventListener("pointerup", event => finishDrag(event));
  stage.addEventListener("pointercancel", event => finishDrag(event, true));
  stage.addEventListener("lostpointercapture", event => { if (drag) finishDrag(event, true); });
  stage.addEventListener("keydown", event => {
    const movement = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    if (!movement) return;
    event.preventDefault(); hideBubble();
    const rect = mascot.getBoundingClientRect(), step = event.shiftKey ? 40 : 15;
    place(rect.left + movement[0] * step, rect.top + movement[1] * step, true);
    play(movement[0] < 0 ? "left" : "right", true);
  });
  stage.addEventListener("click", greet);
  document.getElementById("susu-greet").addEventListener("click", event => {
    if (site.chat?.open) site.chat.open(true);
    else greet(event);
  });
  document.getElementById("susu-reset").addEventListener("click", resetPosition);
  window.visualViewport?.addEventListener("resize", positionBubble);
  window.visualViewport?.addEventListener("scroll", positionBubble);
  launcher.addEventListener("click", () => {
    setExpanded(true);
    if (site.chat?.active) site.chat.open(false);
    else if (site.chat?.guide) site.chat.guide();
    else showBubble("mascotGreeting");
    play("wave", true); stage.focus({ preventScroll: true });
  });
  document.getElementById("susu-minimize").addEventListener("click", () => { setExpanded(false); launcher.focus({ preventScroll: true }); });
  document.getElementById("susu-dismiss").addEventListener("click", () => { hideBubble(); stage.focus({ preventScroll: true }); });
  document.getElementById("susu-choices").addEventListener("click", event => { if (event.target.closest("[data-susu-section]")) { play("jump", true); hideBubble(); } });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    if (drag) { finishDrag({ pointerId: drag.id }, true); return; }
    if (bubbleOpen) { const focus = bubble.contains(document.activeElement); hideBubble(); if (focus) stage.focus({ preventScroll: true }); }
  });
  document.addEventListener("pointermove", event => {
    const now = performance.now();
    if (drag || !expanded || !textureReady || reducedMotion.matches || event.pointerType !== "mouse" || now - lastPointerUpdate < 90 || current.once) return;
    const rect = stage.getBoundingClientRect(), dx = event.clientX - (rect.left + rect.width / 2), dy = event.clientY - (rect.top + rect.height * .38);
    if (Math.hypot(dx, dy) < 55) return;
    lastPointerUpdate = now;
    targetDirection = Math.round(((Math.atan2(dx, -dy) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) * 16) % 16;
    current.name = "look"; mascot.dataset.motion = "look";
    clearTimeout(lookResetTimer); lookResetTimer = setTimeout(() => play("idle"), 1300);
    startAnimation();
  }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { stopAnimation(); clearTimeout(ambientTimer); clearTimeout(gestureTimer); }
    else if (expanded) { play("idle"); scheduleAmbient(); scheduleGesture(); }
  });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) { stopAnimation(); setPose(0, 0); clearTimeout(ambientTimer); clearTimeout(gestureTimer); }
    else { play("idle"); scheduleAmbient(); scheduleGesture(); }
  });
  smallScreen.addEventListener("change", event => {
    if (!storage.get("mascot")) setExpanded(!event.matches, false);
    else if (expanded) {
      for (const property of ["left", "right", "top", "bottom"]) mascot.style.removeProperty(property);
      restorePosition();
    }
  });
  window.addEventListener("resize", () => { if (expanded && customPosition) restorePosition(); positionBubble(); }, { passive: true });
  document.addEventListener("zimo:languagechange", updateLabels);
  document.addEventListener("zimo:navigationstart", hideBubble);
  document.addEventListener("zimo:navigationend", () => { updateLabels(); if (expanded) play("wave", true); });
  function say(text, thinking = false) {
    clearTimeout(bubbleTimer);
    messageKey = null;
    lastSpeechAt = performance.now();
    message.textContent = String(text).slice(0, 400);
    bubbleOpen = true; bubble.hidden = false;
    stage.setAttribute("aria-expanded", "true");
    positionBubble();
    if (expanded) play(thinking ? "thinking" : "wave", true);
  }
  function comment(text) {
    if (!expanded || document.hidden || drag || site.chat?.active || site.chat?.busy) return;
    say(text);
    bubbleTimer = setTimeout(() => {
      if (!site.chat?.active && !bubble.matches(":hover") && !bubble.contains(document.activeElement)) hideBubble();
    }, 8500);
  }
  function guide() {
    setExpanded(true); showBubble("mascotGreeting"); play("wave", true);
  }
  site.mascot = { resetPosition, say, comment, guide, positionBubble, show: () => setExpanded(true), get expanded() { return expanded; }, get dragging() { return Boolean(drag?.moved); }, get position() { return customPosition; } };
  updateLabels(); setExpanded(expanded, false);
  let greeted = false;
  try { greeted = sessionStorage.getItem("zimo.susu.greeted") === "true"; } catch (_) { /* Optional. */ }
  if (expanded && !greeted) greetingTimer = setTimeout(() => {
    if (!expanded || document.hidden || drag || site.chat?.active) return;
    showBubble("mascotGreeting", true); play("wave", true);
    try { sessionStorage.setItem("zimo.susu.greeted", "true"); } catch (_) { /* Optional. */ }
  }, 1600);
})();
