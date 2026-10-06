(function () {
  "use strict";

  const walkConfig = window.UX_WALK_CONFIG || {
    agent: "oslo",
    name: "Oslo",
    page: "walk.html",
    walks: window.UX_WALKS,
  };
  const WALKS = walkConfig.walks;
  if (!WALKS) return;

  const picker = document.getElementById("walk-picker");
  const stage = document.getElementById("walk-stage");
  const main = document.getElementById("walk-main");
  const log = document.getElementById("walk-log");
  const asks = document.getElementById("walk-asks");
  const form = document.getElementById("walk-form");
  const input = document.getElementById("walk-input");
  const statusEl = document.getElementById("walk-status");
  const changeBtn = document.getElementById("walk-change");
  const backBtn = document.getElementById("walk-back");
  const nextBtn = document.getElementById("walk-next");
  const dots = document.getElementById("walk-dots");
  if (!picker || !stage || !main || !log || !form) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let walk = null;
  let index = 0;
  let typeTimer = 0;
  let abort = null;

  function setMode(mode) {
    document.documentElement.classList.toggle("is-walk-picking", mode === "pick");
    document.documentElement.classList.toggle("is-walking", mode === "walk");
    picker.setAttribute("aria-hidden", mode === "pick" ? "false" : "true");
    stage.setAttribute("aria-hidden", mode === "walk" ? "false" : "true");
    if (mode === "pick") picker.removeAttribute("inert");
    else picker.setAttribute("inert", "");
    if (mode === "walk") stage.removeAttribute("inert");
    else stage.setAttribute("inert", "");
  }

  function setStatus(state, label) {
    if (!statusEl) return;
    statusEl.dataset.state = state;
    statusEl.textContent = label;
  }

  function station() {
    return walk && walk.stations[index];
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function renderVisual(st) {
    if (st.visual === "quote") {
      return (
        '<blockquote class="sys-quote" style="margin-top:0"><p>' +
        escapeHtml(st.quote) +
        "</p></blockquote>"
      );
    }
    if (st.visual === "holds") {
      return (
        '<div class="walk-holds">' +
        '<article class="walk-hold"><p>The decision</p><h3>Wiki → tokens</h3><p>If it is not named, it is sediment.</p></article>' +
        '<article class="walk-hold"><p>The trail</p><h3>Handoff → two-way sync</h3><p>Figma and code share one map.</p></article>' +
        '<article class="walk-hold"><p>The edge</p><h3>Meeting → a check</h3><p>Wrong composition fails before a user sees it.</p></article>' +
        "</div>"
      );
    }
    if (st.visual === "cut") {
      return (
        '<div class="walk-cut" role="img" aria-label="Four strata: products, patterns, primitives, tokens">' +
        '<div class="walk-cut-band walk-cut-sky"><p>Sky</p><h3>Products</h3><p>Runtime UI — assembled later</p></div>' +
        '<div class="walk-cut-band walk-cut-weather"><p>Weather</p><h3>Patterns</h3><p>Recipes that may change</p></div>' +
        '<div class="walk-cut-band walk-cut-paths"><p>Paths</p><h3>Primitives</h3><p>States, a11y, allowed contents</p></div>' +
        '<div class="walk-cut-band walk-cut-bedrock"><p>Bedrock</p><h3>Tokens</h3><p>Named once. Shared by both files.</p></div>' +
        "</div>"
      );
    }
    if (st.visual === "cores") {
      return (
        '<div class="sys-cores" style="margin-top:0">' +
        '<figure class="sys-core sys-core-unlogged"><p class="sys-core-label">Core A · unlogged</p>' +
        '<div class="sys-core-tube"><div class="sys-core-cap">Admin · unnamed</div>' +
        '<div class="sys-core-band" style="background: color-mix(in srgb, #8a7a62 55%, var(--color-bg)); min-height: 3.1rem">that blue from last quarter</div>' +
        '<div class="sys-core-band" style="background: color-mix(in srgb, #c4b49a 40%, var(--color-bg)); min-height: 2.4rem">13px? 14?</div>' +
        '<div class="sys-core-band" style="background: color-mix(in srgb, #6d5c45 35%, var(--color-bg)); min-height: 3.4rem">gap: 7px / 11px / “a bit more”</div>' +
        '<div class="sys-core-band" style="background: color-mix(in srgb, #b08948 30%, var(--color-bg)); min-height: 2.6rem">card, or panel, or both</div>' +
        "</div></figure>" +
        '<figure class="sys-core sys-core-logged"><p class="sys-core-label">Core B · logged</p>' +
        '<div class="sys-core-tube"><div class="sys-core-cap">Admin · named</div>' +
        '<div class="sys-core-band" style="background: var(--color-accent-soft); min-height: 3.1rem; color: var(--color-accent)">--color-accent</div>' +
        '<div class="sys-core-band" style="background: var(--color-bg-muted); min-height: 2.4rem">--type-body / 16 · 1.6</div>' +
        '<div class="sys-core-band" style="background: color-mix(in srgb, var(--color-text) 6%, var(--color-bg)); min-height: 3.4rem">--space-300 / --space-400</div>' +
        '<div class="sys-core-band" style="background: var(--color-bg-elevated); min-height: 2.6rem">primitive.card</div>' +
        "</div></figure></div>"
      );
    }
    if (st.visual === "trail") {
      return (
        '<div class="walk-trail">' +
        '<div class="walk-trail-node"><p>Studio</p><h3>Figma</h3></div>' +
        '<span class="walk-trail-arrow" aria-hidden="true">↔</span>' +
        '<div class="walk-trail-node"><p>Cairn</p><h3>tokens.json</h3></div>' +
        '<span class="walk-trail-arrow" aria-hidden="true">↔</span>' +
        '<div class="walk-trail-node"><p>Ship</p><h3>Code</h3></div>' +
        "</div>"
      );
    }
    if (st.visual === "bands" && st.bands && st.bands.length) {
      return (
        '<div class="walk-holds">' +
        st.bands
          .map(function (band) {
            return (
              '<article class="walk-hold"><p>' +
              escapeHtml(band.kicker || "") +
              "</p><h3>" +
              escapeHtml(band.title || "") +
              "</h3><p>" +
              escapeHtml(band.body || "") +
              "</p></article>"
            );
          })
          .join("") +
        "</div>"
      );
    }
    if (st.visual === "image" && st.src) {
      return (
        '<img src="' +
        escapeAttr(st.src) +
        '" alt="' +
        escapeAttr(st.alt || "") +
        '">'
      );
    }
    return "";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/"/g, "&quot;");
  }

  function renderDots() {
    dots.innerHTML = "";
    walk.stations.forEach(function (_, i) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "walk-dot" + (i === index ? " is-current" : "");
      button.setAttribute("aria-label", "Station " + (i + 1));
      if (i === index) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
      button.addEventListener("click", function () {
        goTo(i);
      });
      dots.appendChild(button);
    });
  }

  function renderAsks(st) {
    asks.innerHTML = "";
    (st.asks || []).forEach(function (label) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "walk-ask";
      button.textContent = label;
      button.addEventListener("click", function () {
        sendAsk(label);
      });
      asks.appendChild(button);
    });
  }

  function appendTurn(role, text) {
    const turn = document.createElement("article");
    turn.className = "chat-turn " + (role === "user" ? "chat-turn-user" : "chat-turn-agent");
    const label = document.createElement("p");
    label.className = "chat-turn-label";
    label.textContent = role === "user" ? "You" : walkConfig.name;
    const body = document.createElement("p");
    body.className = "chat-turn-body";
    body.textContent = text || "";
    turn.appendChild(label);
    if (role !== "user" && !text) {
      const loader = document.createElement("span");
      loader.className = "chat-loader";
      loader.setAttribute("aria-label", "Waiting for reply");
      loader.innerHTML = "<span></span><span></span><span></span>";
      turn.appendChild(loader);
    }
    turn.appendChild(body);
    log.appendChild(turn);
    log.scrollTop = log.scrollHeight;
    return body;
  }

  function hideLoader(body) {
    const turn = body.parentElement;
    if (!turn) return;
    const loader = turn.querySelector(".chat-loader");
    if (loader) loader.remove();
  }

  function stopTyping() {
    if (typeTimer) {
      window.clearInterval(typeTimer);
      typeTimer = 0;
    }
  }

  function typeNarration(text, body) {
    stopTyping();
    if (reduceMotion) {
      hideLoader(body);
      body.textContent = text;
      setStatus("idle", "With you");
      return;
    }
    setStatus("walking", "Walking");
    hideLoader(body);
    let i = 0;
    body.textContent = "";
    typeTimer = window.setInterval(function () {
      i += 1;
      body.textContent = text.slice(0, i);
      log.scrollTop = log.scrollHeight;
      if (i >= text.length) {
        stopTyping();
        setStatus("idle", "With you");
      }
    }, 14);
    body.addEventListener(
      "click",
      function () {
        stopTyping();
        body.textContent = text;
        setStatus("idle", "With you");
      },
      { once: true }
    );
  }

  function renderStation() {
    const st = station();
    if (!st) return;
    stopTyping();
    if (abort) abort.abort();

    main.innerHTML =
      '<p class="walk-station-kicker">' +
      pad(index + 1) +
      " / " +
      pad(walk.stations.length) +
      " · " +
      escapeHtml(walk.kicker) +
      "</p>" +
      '<h1 class="walk-station-title">' +
      escapeHtml(st.title) +
      "</h1>" +
      '<p class="walk-station-lede">' +
      escapeHtml(st.lede) +
      "</p>" +
      '<div class="walk-visual">' +
      renderVisual(st) +
      "</div>" +
      (st.caption ? '<p class="walk-caption">' + escapeHtml(st.caption) + "</p>" : "") +
      (st.tags && st.tags.length
        ? '<ul class="walk-tags">' +
          st.tags.map(function (tag) {
            return "<li>" + escapeHtml(tag) + "</li>";
          }).join("") +
          "</ul>"
        : "");

    log.innerHTML = "";
    const body = appendTurn("agent", "");
    typeNarration(st.say, body);
    renderAsks(st);
    renderDots();

    backBtn.disabled = index === 0;
    nextBtn.disabled = false;
    nextBtn.textContent = index === walk.stations.length - 1 ? "Choose walk" : "Next →";
    input.placeholder = "Ask about this station…";
    input.value = "";

    const hash = "#" + walk.id + (index ? "/" + (index + 1) : "");
    if (window.location.hash !== hash) {
      history.replaceState({ walk: walk.id, index: index }, "", walkConfig.page + hash);
    }
  }

  function startWalk(id, startIndex) {
    const next = WALKS[id];
    if (!next) {
      showPicker();
      return;
    }
    walk = next;
    index = Math.max(0, Math.min(next.stations.length - 1, startIndex || 0));
    setMode("walk");
    renderStation();
    window.requestAnimationFrame(function () {
      if (input) input.focus();
    });
  }

  function showPicker() {
    stopTyping();
    if (abort) abort.abort();
    walk = null;
    index = 0;
    setMode("pick");
    if (window.location.hash) {
      history.replaceState({}, "", walkConfig.page);
    }
  }

  function goTo(nextIndex) {
    if (!walk) return;
    if (nextIndex < 0) return;
    if (nextIndex >= walk.stations.length) {
      showPicker();
      return;
    }
    index = nextIndex;
    renderStation();
  }

  function toPlainReply(text) {
    return String(text || "")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/__(.+?)__/g, "$1")
      .replace(/(^|[\s(])\*(?!\s)([^*\n]+)\*(?=[\s).,;:!?]|$)/g, "$1$2")
      .replace(/`+/g, "")
      .replace(/^\s*[-*]\s+/gm, "");
  }

  async function sendAsk(message) {
    const st = station();
    if (!st || !message) return;
    stopTyping();
    asks.querySelectorAll("button").forEach(function (button) {
      button.disabled = true;
    });
    form.querySelector("button[type='submit']").disabled = true;
    input.disabled = true;
    setStatus("answering", "Answering");
    appendTurn("user", message);
    input.value = "";
    const body = appendTurn("agent", "");

    abort = new AbortController();
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abort.signal,
        body: JSON.stringify({
          message: message,
          agent: walkConfig.agent,
          context: {
            walk: walk.title,
            station: st.title,
            brief: st.lede
          }
        })
      });
      if (!response.ok) {
        let detail = "The agent could not reply.";
        try {
          const payload = await response.json();
          if (payload && payload.error) detail = payload.error;
        } catch (parseError) {}
        throw new Error(detail);
      }
      if (!response.body) throw new Error("Streaming is not available in this browser.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      let started = false;
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        reply += decoder.decode(chunk.value, { stream: true });
        const plain = toPlainReply(reply);
        if (!started && plain) {
          hideLoader(body);
          started = true;
        }
        if (started) {
          body.textContent = plain;
          log.scrollTop = log.scrollHeight;
        }
      }
      reply += decoder.decode();
      hideLoader(body);
      body.textContent = toPlainReply(reply) || "The agent returned an empty reply.";
    } catch (error) {
      if (error && error.name === "AbortError") return;
      hideLoader(body);
      body.textContent =
        error && error.message
          ? error.message
          : "Something went wrong sending that message. Please try again.";
    } finally {
      asks.querySelectorAll("button").forEach(function (button) {
        button.disabled = false;
      });
      form.querySelector("button[type='submit']").disabled = false;
      input.disabled = false;
      setStatus("idle", "With you");
      input.focus();
    }
  }

  function parseHash() {
    const raw = (window.location.hash || "").replace(/^#/, "");
    if (!raw) return { id: "", index: 0 };
    const parts = raw.split("/");
    const id = parts[0];
    const n = Number(parts[1]);
    return { id: id, index: n > 0 ? n - 1 : 0 };
  }

  picker.querySelectorAll("[data-walk]").forEach(function (button) {
    button.addEventListener("click", function () {
      startWalk(button.getAttribute("data-walk"), 0);
    });
  });

  if (changeBtn) {
    changeBtn.addEventListener("click", function () {
      showPicker();
    });
  }

  backBtn.addEventListener("click", function () {
    goTo(index - 1);
  });

  nextBtn.addEventListener("click", function () {
    goTo(index + 1);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    sendAsk(message);
  });

  document.addEventListener("keydown", function (event) {
    if (!document.documentElement.classList.contains("is-walking")) return;
    if (event.target && (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA")) return;
    if (event.key === "ArrowRight") goTo(index + 1);
    if (event.key === "ArrowLeft") goTo(index - 1);
    if (event.key === "Escape") showPicker();
  });

  window.addEventListener("popstate", function () {
    const parsed = parseHash();
    if (parsed.id && WALKS[parsed.id]) startWalk(parsed.id, parsed.index);
    else showPicker();
  });

  const parsed = parseHash();
  if (parsed.id && WALKS[parsed.id]) startWalk(parsed.id, parsed.index);
  else setMode("pick");
})();
