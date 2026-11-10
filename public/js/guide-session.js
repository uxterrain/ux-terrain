(function () {
  "use strict";
  const KEY = "ux-terrain-guide-session-v1";
  const sitePages = /^\/(?:index|about|systems|work\/(?:armada|iqvia|oslo|performance-monitoring|sbi|zone-focus|eda))\.html$/;
  let active = null;
  function validContext(context) {
    return context && typeof context === "object" &&
      (!context.projectId || /^(armada|iqvia|oslo|performance-monitoring|sbi|zone-focus|eda|systems)$/.test(context.projectId)) &&
      (!context.walkId || /^(ground|floor|m365|zone|armada|sbi|iqvia|oslo|eda)$/.test(context.walkId)) &&
      (context.stationIndex === undefined || Number.isInteger(context.stationIndex) && context.stationIndex >= 0 && context.stationIndex < 20);
  }
  function read() {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (!raw || raw.length > 150000) return null;
      const state = JSON.parse(raw);
      if (state.version !== 1 || !["oslo", "eda"].includes(state.guide) || !validContext(state.context) || !Array.isArray(state.turns)) return null;
      return state;
    } catch (_) { return null; }
  }
  function checkpoint() {
    if (!active) return false;
    try {
      const state = active.snapshot();
      if (!validContext(state.context)) return false;
      const saved = { ...state, guide: active.guide, version: 1 };
      while (JSON.stringify(saved).length > 140000 && saved.turns.length > 2) saved.turns.shift();
      sessionStorage.setItem(KEY, JSON.stringify(saved));
      return true;
    } catch (_) { return false; }
  }
  function capture(log) {
    return Array.from(log.querySelectorAll(".chat-turn")).slice(-24).map(turn => {
      const body = turn.querySelector(".chat-turn-body");
      return {
        role: turn.classList.contains("chat-turn-user") ? "user" : "agent",
        text: (body && body.textContent || "Reply interrupted. You can send that question again.").slice(0, 10000),
        answer: body && body.osloAnswer || null
      };
    });
  }
  function restore(log, turns, append, render) {
    log.replaceChildren();
    (turns || []).slice(-24).forEach(turn => {
      if (!turn || typeof turn.text !== "string" || !["user", "agent"].includes(turn.role)) return;
      const body = append(turn.role, turn.text.slice(0, 10000));
      if (turn.answer && Array.isArray(turn.answer.claims) && render) render(turn.answer, body);
    });
  }
  window.UX_GUIDE_SESSION = {
    read, checkpoint, capture, restore,
    captureSuggestions(container, selector = "button") {
      return Array.from(container.querySelectorAll(selector)).map(button => (button.querySelector(".js-inquiry-label") || button).textContent.trim());
    },
    restoreSuggestions(container, labels, selector = "button") {
      if (!Array.isArray(labels) || labels.length > 10 || labels.some(label => typeof label !== "string" || label.length > 300)) return;
      Array.from(container.querySelectorAll(selector)).forEach((button, index) => {
        if (index >= labels.length) button.remove();
        else (button.querySelector(".js-inquiry-label") || button).textContent = labels[index];
      });
    },
    advanceSuggestions(container, message, pool, history, selector = "button") {
      const used = new Set((history || []).filter(turn => turn.role === "user").map(turn => turn.content));
      used.add(message);
      const buttons = Array.from(container.querySelectorAll(selector));
      buttons.forEach((button, index) => {
        const label = button.querySelector(".js-inquiry-label") || button;
        if (label.textContent.trim() !== message.trim()) return;
        const visible = buttons.map(item => (item.querySelector(".js-inquiry-label") || item).textContent.trim());
        const ordered = [pool && pool[index], ...(pool || [])].filter(Boolean);
        const next = ordered.find(question => !used.has(question) && !visible.includes(question));
        if (next) label.textContent = next;
        else button.remove();
      });
      checkpoint();
    },
    activate(guide, snapshot) { active = { guide, snapshot }; checkpoint(); },
    clear(guide) {
      if (active && active.guide !== guide) return;
      active = null;
      try { sessionStorage.removeItem(KEY); } catch (_) {}
    }
  };
  document.addEventListener("click", function (event) {
    if (!active || event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a[href]");
    if (!link || link.hasAttribute("download")) return;
    let target;
    try { target = new URL(link.href, window.location.href); } catch (_) { return; }
    if (!/^https?:$/.test(target.protocol)) return;
    let returningToWalk = false;
    try {
      returningToWalk = Boolean(active.snapshot().context.walkId) &&
        target.pathname === (active.guide === "eda" ? "/eda.html" : "/walk.html");
    } catch (_) {}
    if (target.origin !== window.location.origin || !sitePages.test(target.pathname) && !returningToWalk) {
      // Keep the current conversation while inspecting an external reference or asset.
      if (target.pathname !== window.location.pathname) { link.target = "_blank"; link.rel = "noopener noreferrer"; }
      return;
    }
    const saved = checkpoint();
    if (!saved && target.pathname !== window.location.pathname) {
      link.target = "_blank"; link.rel = "noopener noreferrer";
    }
  });
  window.addEventListener("pagehide", checkpoint);
  window.addEventListener("pageshow", function (event) {
    // A back/forward cache can contain an older open panel or transcript.
    if (event.persisted) window.location.reload();
  });
})();
