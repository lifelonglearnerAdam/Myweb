/* Optional, user-initiated chat. Only the public proxy URL is shipped; never an API key. */
(() => {
  "use strict";
  const site = window.Zimo;
  const bubble = document.getElementById("susu-bubble");
  if (!site?.mascot || !bubble || site.chat) return;
  const ENDPOINT = "https://zimo-susu-chat.zimo-personal-space.workers.dev/chat";
  let history = [], busy = false, cooldownUntil = 0, controller, cooldownTimer;
  const toggle = document.createElement("button");
  toggle.type = "button"; toggle.className = "susu-chat-toggle"; toggle.id = "susu-chat-toggle";
  toggle.setAttribute("aria-controls", "susu-chat-form"); toggle.setAttribute("aria-expanded", "false");
  const form = document.createElement("form");
  form.id = "susu-chat-form"; form.className = "susu-chat-form"; form.hidden = true;
  form.innerHTML = '<label class="sr-only" for="susu-chat-input" id="susu-chat-input-label"></label><div class="susu-chat-input-row"><input id="susu-chat-input" name="message" type="text" maxlength="160" autocomplete="off" spellcheck="false" aria-describedby="susu-chat-privacy"><button id="susu-chat-send" type="submit"></button></div><p id="susu-chat-privacy" class="susu-chat-privacy"></p><span class="susu-chat-badge" id="susu-chat-badge"></span><span class="sr-only" id="susu-chat-status" role="status" aria-live="polite" aria-atomic="true"></span>';
  bubble.append(toggle, form);
  const input = form.querySelector("input"), send = form.querySelector('button[type="submit"]');
  const status = document.getElementById("susu-chat-status");
  function update() {
    toggle.textContent = site.t("chatOpen");
    form.setAttribute("aria-label", site.t("chatLabel"));
    input.placeholder = site.t("chatPlaceholder");
    document.getElementById("susu-chat-input-label").textContent = site.t("chatLabel");
    document.getElementById("susu-chat-privacy").textContent = site.t("chatPrivacy");
    document.getElementById("susu-chat-badge").textContent = site.t("chatAi");
    send.textContent = busy ? "···" : site.t("chatSend");
    send.disabled = busy || Date.now() < cooldownUntil;
    input.disabled = busy;
    form.setAttribute("aria-busy", String(busy));
    site.mascot.positionBubble();
  }
  function announce(text) { status.textContent = text; site.mascot.say(text); }
  function cancel() { controller?.abort(); }
  toggle.addEventListener("click", () => {
    form.hidden = !form.hidden;
    toggle.setAttribute("aria-expanded", String(!form.hidden));
    site.mascot.positionBubble();
    if (!form.hidden) input.focus({ preventScroll: true });
    else cancel();
  });
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) { announce(site.t("chatEmpty")); return; }
    if (busy || Date.now() < cooldownUntil) return;
    busy = true; cooldownUntil = Date.now() + 4000;
    controller = new AbortController();
    const request = controller;
    const timeout = setTimeout(() => request.abort("timeout"), 23000);
    site.mascot.say(site.t("chatThinking"), true);
    status.textContent = site.t("chatThinking"); update();
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST", mode: "cors", credentials: "omit", referrerPolicy: "no-referrer", signal: request.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: Array.from(message).slice(0, 160).join(""), language: site.language, history: history.slice(-4) })
      });
      if (request.signal.aborted) return;
      if (response.status === 429) { announce(site.t("chatRateLimited")); return; }
      if (!response.ok) throw new Error("chat unavailable");
      const result = await response.json();
      if (typeof result.reply !== "string" || !result.reply.trim()) throw new Error("empty reply");
      const reply = Array.from(result.reply.trim()).slice(0, 140).join("");
      history = [...history, { role: "user", content: message }, { role: "assistant", content: reply }].slice(-4);
      input.value = ""; announce(reply);
    } catch (_) {
      if (!request.signal.aborted || request.signal.reason === "timeout") announce(site.t("chatUnavailable"));
    } finally {
      clearTimeout(timeout);
      if (controller === request) controller = null;
      busy = false; update();
      clearTimeout(cooldownTimer);
      cooldownTimer = setTimeout(update, Math.max(0, cooldownUntil - Date.now()) + 20);
      // Do not steal focus from navigation or a deliberate close/minimize action.
      if (!form.hidden && !bubble.hidden && site.mascot.expanded && (document.activeElement === send || document.activeElement === document.body)) input.focus({ preventScroll: true });
    }
  });
  document.getElementById("susu-dismiss").addEventListener("click", cancel);
  document.getElementById("susu-minimize").addEventListener("click", cancel);
  document.addEventListener("zimo:navigationstart", cancel);
  document.addEventListener("zimo:languagechange", update);
  document.addEventListener("keydown", event => { if (event.key === "Escape") cancel(); });
  site.chat = { get busy() { return busy; }, get endpoint() { return ENDPOINT; } };
  update();
})();
