/* Pachelbel · Canon in D, piano by Lee Galloway. Recording: CC BY-SA 3.0. See credits.html. */
(() => {
  "use strict";
  const site = window.Zimo;
  if (!site || site.music) return;
  const audio = new Audio();
  audio.loop = true;
  audio.preload = "metadata";
  const savedVolume = Number(site.storage.get("musicVolume"));
  let volume = site.storage.get("musicVolume") !== null && Number.isFinite(savedVolume) ? Math.max(0, Math.min(.6, savedVolume)) : .18;
  audio.volume = volume;
  let requested = site.storage.get("music") !== "off";
  audio.autoplay = requested;
  let pending = false;
  let unavailable = false;
  let lastSavedPosition = 0;
  let restorePosition = 0;
  try { restorePosition = Number(sessionStorage.getItem("zimo.music.position")) || 0; } catch (_) { /* Optional session persistence. */ }
  const root = document.createElement("aside");
  root.className = "music-player";
  root.id = "music-player";
  root.innerHTML = `<div class="music-volume" id="music-volume-panel" hidden><label for="music-volume-slider" id="music-volume-label"></label><input id="music-volume-slider" type="range" min="0" max="0.6" step="0.01" value="${volume}"><a id="music-credit-link" href="${site.localHref("credits.html#music-credit")}">Lee Galloway · CC BY-SA 3.0 ↗</a></div><button class="music-toggle" id="music-toggle" type="button" aria-pressed="false"><span class="music-disc" aria-hidden="true">♪</span><span class="music-copy"><strong id="music-track-title"></strong><small id="music-track-status"></small></span><span class="music-equalizer" aria-hidden="true"><i></i><i></i><i></i><i></i></span></button><button class="music-volume-toggle" id="music-volume-toggle" type="button" aria-controls="music-volume-panel" aria-expanded="false"></button>`;
  document.body.append(root);
  document.documentElement.dataset.hasMusic = "true";
  const button = document.getElementById("music-toggle");
  const status = document.getElementById("music-track-status");
  const volumeButton = document.getElementById("music-volume-toggle");
  const volumePanel = document.getElementById("music-volume-panel");
  const slider = document.getElementById("music-volume-slider");
  function update() {
    const playing = !audio.paused;
    root.setAttribute("aria-label", site.t("musicPlayer"));
    root.classList.toggle("is-playing", playing);
    root.classList.toggle("is-pending", pending);
    button.setAttribute("aria-pressed", String(playing));
    button.setAttribute("aria-label", site.t(playing ? "musicPause" : "musicPlay"));
    button.title = site.t(playing ? "musicPause" : "musicPlay");
    document.getElementById("music-track-title").textContent = site.t("musicTitle");
    status.textContent = site.t(unavailable ? "musicUnavailable" : playing ? "musicPlaying" : pending ? "musicLoading" : requested ? "musicReady" : "musicPaused");
    volumeButton.innerHTML = site.icon(volume === 0 ? "volume-off" : "volume");
    volumeButton.setAttribute("aria-label", site.t("musicVolume"));
    document.getElementById("music-volume-label").textContent = site.t("musicVolume");
    slider.setAttribute("aria-label", site.t("musicVolume"));
    document.getElementById("music-credit-link").href = site.localHref("credits.html#music-credit");
  }
  function savePosition() {
    if (!audio.src || audio.readyState === 0 || restorePosition > 0 || !Number.isFinite(audio.currentTime)) return;
    lastSavedPosition = audio.currentTime;
    try { sessionStorage.setItem("zimo.music.position", String(audio.currentTime)); } catch (_) { /* Optional. */ }
  }
  async function start(manual = false) {
    if (pending || !requested || document.hidden) return;
    unavailable = false;
    pending = true;
    if (!audio.src) audio.src = "assets/audio/canon-in-d-lee-galloway.ogg";
    if (manual && audio.error) audio.load();
    update();
    try {
      audio.loop = true;
      await audio.play();
    } catch (error) {
      // Unmuted autoplay may need a real user gesture; never simulate a click to bypass it.
      if (error.name !== "NotAllowedError" && error.name !== "AbortError") {
        unavailable = true;
      }
    } finally { pending = false; update(); }
  }
  function gestureStart(event) {
    if (!event.isTrusted || event.composedPath().includes(root)) return;
    if (event.type === "keydown" && ["Shift", "Control", "Alt", "Meta", "Escape"].includes(event.key)) return;
    if (requested && audio.paused) start();
  }
  button.addEventListener("click", () => {
    if (!audio.paused || pending) {
      requested = false;
      site.storage.set("music", "off");
      audio.autoplay = false;
      audio.pause();
      savePosition();
      pending = false;
    } else {
      requested = true;
      site.storage.set("music", "on");
      audio.autoplay = true;
      start(true);
    }
    update();
  });
  volumeButton.addEventListener("click", () => {
    volumePanel.hidden = !volumePanel.hidden;
    volumeButton.setAttribute("aria-expanded", String(!volumePanel.hidden));
    if (!volumePanel.hidden) slider.focus({ preventScroll: true });
  });
  slider.addEventListener("input", () => {
    volume = Number(slider.value);
    audio.volume = volume;
    site.storage.set("musicVolume", String(volume));
    update();
  });
  document.addEventListener("click", event => {
    if (!volumePanel.hidden && !event.composedPath().includes(root)) {
      volumePanel.hidden = true;
      volumeButton.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !volumePanel.hidden) {
      const restoreFocus = volumePanel.contains(document.activeElement);
      volumePanel.hidden = true;
      volumeButton.setAttribute("aria-expanded", "false");
      if (restoreFocus) volumeButton.focus({ preventScroll: true });
    }
  });
  function restorePlaybackPosition() {
    if (!(restorePosition > 0) || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    try {
      audio.currentTime = restorePosition < audio.duration - .3 ? restorePosition : 0;
      restorePosition = 0;
    } catch (_) { /* Metadata may precede seekability; retry on the next readiness event. */ }
  }
  for (const event of ["loadedmetadata", "durationchange", "canplay"]) audio.addEventListener(event, restorePlaybackPosition);
  audio.addEventListener("playing", () => { pending = false; unavailable = false; update(); });
  audio.addEventListener("pause", update);
  audio.addEventListener("ended", () => {
    if (!requested) return;
    audio.currentTime = 0;
    start();
  });
  audio.addEventListener("error", () => { pending = false; unavailable = true; update(); });
  audio.addEventListener("timeupdate", () => { if (Math.abs(audio.currentTime - lastSavedPosition) > 4) savePosition(); });
  window.addEventListener("pagehide", savePosition);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) savePosition();
    else if (requested && audio.paused && !audio.error) start();
  });
  document.addEventListener("zimo:languagechange", update);
  // Touch activation is granted on release in several browsers, not on pointerdown.
  for (const event of ["pointerdown", "pointerup", "touchend", "click"]) document.addEventListener(event, gestureStart, { passive: true });
  document.addEventListener("keydown", gestureStart);
  site.music = { audio, get requested() { return requested; }, get playing() { return !audio.paused; } };
  update();
  if (requested) start();
})();
