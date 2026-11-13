/* Explicit, short conversation. Keys never reach the client; memory is tab-local only. */
(() => {
  "use strict";
  const site = window.Zimo;
  const bubble = document.getElementById("susu-bubble");
  if (!site?.mascot || !bubble || site.chat) return;
  const PUBLIC_SITE = "https://me.zimo-personal-space.workers.dev";
  // On the free hostname, requests are same-origin and use a Cloudflare service binding.
  // The GitHub mirror uses the same website API, not the separate public proxy hostname.
  const ENDPOINT = location.origin === PUBLIC_SITE ? "/api/chat" : `${PUBLIC_SITE}/api/chat`;
  const CONTEXT_MESSAGES = 12;
  let history = [], messages = [], busy = false, composing = false, cooldownUntil = 0;
  let controller, cooldownTimer, sequence = 0, lastFailed = null, statusKey = "chatMemory";
  const toggle = document.createElement("button");
  toggle.type = "button"; toggle.className = "susu-chat-toggle"; toggle.id = "susu-chat-toggle";
  toggle.setAttribute("aria-controls", "susu-chat-panel"); toggle.setAttribute("aria-expanded", "false");
  const panel = document.createElement("section");
  panel.id = "susu-chat-panel"; panel.hidden = true;
  panel.innerHTML = '<div class="susu-chat-toolbar"><span id="susu-chat-badge" class="susu-chat-badge"></span><button type="button" id="susu-chat-clear"></button></div><ol id="susu-chat-log" class="susu-chat-log" aria-live="polite" aria-relevant="additions text"></ol><form id="susu-chat-form" class="susu-chat-form"><label class="sr-only" for="susu-chat-input" id="susu-chat-input-label"></label><div class="susu-chat-input-row"><input id="susu-chat-input" name="message" type="text" maxlength="160" autocomplete="off" spellcheck="false" aria-describedby="susu-chat-privacy"><button id="susu-chat-send" type="submit"></button></div></form><p id="susu-chat-status" class="susu-chat-status" role="status" aria-live="polite" aria-atomic="true"></p><button type="button" id="susu-chat-retry" class="susu-chat-retry" hidden></button><p id="susu-chat-privacy" class="susu-chat-privacy"></p>';
  bubble.append(toggle, panel);
  const modes = document.createElement("div");
  modes.className = "susu-mode-switch"; modes.setAttribute("role", "group");
  const guide = document.createElement("button");
  guide.type = "button"; guide.id = "susu-guide-mode";
  toggle.className = "susu-mode-chat";
  modes.append(guide, toggle);
  bubble.insertBefore(modes, bubble.querySelector(".mascot-message"));
  const form = document.getElementById("susu-chat-form");
  const input = document.getElementById("susu-chat-input"), send = document.getElementById("susu-chat-send");
  const log = document.getElementById("susu-chat-log"), status = document.getElementById("susu-chat-status");
  const retry = document.getElementById("susu-chat-retry");
  function renderLog() {
    const fragment = document.createDocumentFragment();
    for (const message of messages.slice(-14)) {
      const row = document.createElement("li");
      row.className = `susu-chat-line is-${message.role}${message.error ? " is-error" : ""}${message.pending ? " is-pending" : ""}`;
      const label = document.createElement("span"); label.className = "susu-chat-speaker";
      label.textContent = site.t(message.role === "user" ? "chatYou" : "chatSusu");
      const text = document.createElement("p"); text.textContent = message.pending ? site.t("chatThinking") : message.text;
      row.append(label, text); fragment.append(row);
    }
    log.replaceChildren(fragment);
    log.hidden = messages.length === 0;
    log.scrollTop = log.scrollHeight;
    site.mascot.positionBubble();
  }
  function update() {
    modes.setAttribute("aria-label", site.t("mascotModes"));
    guide.textContent = site.t(panel.hidden ? "guideMode" : "chatBackGuide");
    guide.setAttribute("aria-pressed", String(panel.hidden));
    toggle.textContent = site.t("chatMode");
    toggle.setAttribute("aria-pressed", String(!panel.hidden));
    panel.setAttribute("aria-label", site.t("chatLabel"));
    log.setAttribute("aria-label", site.t("chatConversation"));
    input.placeholder = site.t("chatPlaceholder");
    document.getElementById("susu-chat-input-label").textContent = site.t("chatLabel");
    document.getElementById("susu-chat-privacy").textContent = site.t("chatPrivacy");
    document.getElementById("susu-chat-badge").textContent = site.t("chatAi");
    document.getElementById("susu-chat-clear").textContent = site.t("chatClear");
    send.textContent = site.t(busy ? "chatSending" : "chatSend");
    send.disabled = busy;
    form.setAttribute("aria-busy", String(busy));
    status.textContent = site.t(statusKey);
    status.classList.toggle("is-error", ["chatUnavailable", "chatDailyLimit", "chatRateLimited"].includes(statusKey));
    retry.textContent = site.t("chatRetry"); retry.hidden = !lastFailed || busy;
    retry.disabled = Date.now() < cooldownUntil;
    bubble.classList.toggle("is-chatting", !panel.hidden);
    renderLog();
  }
  function latestReply() { return [...messages].reverse().find(message => message.role === "assistant" && !message.pending)?.text; }
  function open(focus = true) {
    site.mascot.show(); panel.hidden = false; toggle.setAttribute("aria-expanded", "true");
    site.mascot.say(busy ? site.t("chatThinking") : latestReply() || site.t("chatWelcome"), busy);
    update();
    if (focus) input.focus({ preventScroll: true });
  }
  function closePanel() {
    panel.hidden = true; toggle.setAttribute("aria-expanded", "false"); update();
    site.mascot.guide();
  }
  function cancel(reason = "closed") { controller?.abort(reason); }
  function clear() {
    sequence++; cancel("clear"); busy = false; controller = null;
    history = []; messages = []; lastFailed = null; cooldownUntil = 0; statusKey = "chatMemory";
    input.value = ""; open(true);
  }
  function addMessage(message) { messages.push(message); messages = messages.slice(-14); return message; }
  function scheduleCooldownUpdate() {
    clearTimeout(cooldownTimer);
    cooldownTimer = setTimeout(update, Math.max(0, cooldownUntil - Date.now()) + 25);
  }
  async function submit(message, reuse = false) {
    if (composing) return;
    if (!message) { statusKey = "chatEmpty"; update(); return; }
    if (busy) return;
    if (Date.now() < cooldownUntil) { statusKey = "chatRateLimited"; update(); return; }
    const id = ++sequence;
    busy = true; lastFailed = null; statusKey = "chatThinking";
    cooldownUntil = Date.now() + 2000;
    if (!reuse) addMessage({ role: "user", text: message });
    const pending = addMessage({ role: "assistant", pending: true, text: "" });
    input.value = "";
    controller = new AbortController(); const request = controller;
    const timer = setTimeout(() => request.abort("timeout"), 25000);
    site.mascot.say(site.t("chatThinking"), true); update();
    function failure(key) {
      pending.pending = false; pending.error = true; pending.text = site.t(key);
      statusKey = key; lastFailed = key === "chatDailyLimit" ? null : message;
      if (!bubble.hidden && !panel.hidden) site.mascot.say(pending.text);
    }
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST", mode: "cors", credentials: "omit", referrerPolicy: "no-referrer", signal: request.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, language: site.language, history: history.slice(-CONTEXT_MESSAGES) })
      });
      if (id !== sequence) return;
      if (request.signal.aborted) throw new DOMException("Canceled", "AbortError");
      if (response.status === 429) {
        const data = await response.json().catch(() => ({}));
        const retryAfter = Math.min(86400, Math.max(1, Number(data.retryAfter || response.headers.get("Retry-After")) || 60));
        cooldownUntil = Date.now() + retryAfter * 1000;
        failure(data.error === "daily_limit" ? "chatDailyLimit" : "chatRateLimited");
        return;
      }
      if (!response.ok) throw new Error("chat unavailable");
      const result = await response.json();
      if (typeof result.reply !== "string" || !result.reply.trim()) throw new Error("empty reply");
      const reply = Array.from(result.reply.trim()).slice(0, 140).join("");
      pending.pending = false; pending.text = reply;
      history = [...history, { role: "user", content: message }, { role: "assistant", content: reply }].slice(-CONTEXT_MESSAGES);
      statusKey = "chatMemory";
      if (!bubble.hidden && !panel.hidden) site.mascot.say(reply);
    } catch (_) {
      if (id !== sequence) return;
      if (request.signal.aborted && request.signal.reason !== "timeout") {
        pending.pending = false; pending.error = true; pending.text = site.t("chatCanceled");
        statusKey = "chatCanceled"; lastFailed = message;
      } else failure("chatUnavailable");
    } finally {
      clearTimeout(timer);
      if (id === sequence) { controller = null; busy = false; update(); scheduleCooldownUpdate(); }
    }
  }
  toggle.addEventListener("click", () => open(true));
  guide.addEventListener("click", closePanel);
  input.addEventListener("compositionstart", () => { composing = true; });
  input.addEventListener("compositionend", () => { composing = false; });
  input.addEventListener("keydown", event => { if (event.key === "Enter" && (event.isComposing || event.keyCode === 229)) event.preventDefault(); });
  form.addEventListener("submit", event => { event.preventDefault(); submit(Array.from(input.value.trim()).slice(0, 160).join("")); });
  retry.addEventListener("click", () => { if (lastFailed) submit(lastFailed, true); });
  document.getElementById("susu-chat-clear").addEventListener("click", clear);
  document.getElementById("susu-dismiss").addEventListener("click", () => cancel());
  document.getElementById("susu-minimize").addEventListener("click", () => cancel());
  // Navigation does not cancel an in-flight reply or discard context; reopening shows it.
  document.addEventListener("zimo:languagechange", update);
  document.addEventListener("keydown", event => { if (event.key === "Escape") cancel(); });
  site.chat = { open, guide: closePanel, clear, get busy() { return busy; }, get active() { return !panel.hidden; }, get endpoint() { return new URL(ENDPOINT, location.href).href; } };
  update();
})();
