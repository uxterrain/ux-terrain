(function () {
  "use strict";

  const walkConfig = window.UX_WALK_CONFIG || {
    agent: "oslo",
    name: "Oslo",
    page: "walk.html",
    walks: window.UX_WALKS,
  };
  const WALKS = walkConfig.walks;
  const enhancedWalk = true;
  const session = window.UX_GUIDE_SESSION;
  const continuation = session && session.read();
  const carried = continuation && continuation.guide === walkConfig.agent ? continuation : null;
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
  const guideRail = stage.querySelector(".walk-rail");
  const guideToggle = document.createElement("button");
  guideToggle.className = "walk-guide-toggle";
  guideToggle.type = "button";
  guideToggle.textContent = "Hide guide";
  guideToggle.setAttribute("aria-expanded", "true");
  guideToggle.setAttribute("aria-controls", "walk-guide");
  guideRail.id = "walk-guide";
  guideToggle.addEventListener("click", function () {
    const collapsed = stage.classList.toggle("is-guide-collapsed");
    guideToggle.setAttribute("aria-expanded", String(!collapsed));
    guideToggle.textContent = collapsed ? "Ask " + walkConfig.name : "Hide guide";
    if (!collapsed) input.focus();
  });
  stage.querySelector(".walk-foot").prepend(guideToggle);


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
        '<article class="walk-hold"><p>Shared values</p><h3>Define the tokens</h3><p>Map meaningful names between design and code.</p></article>' +
        '<article class="walk-hold"><p>A maintained connection</p><h3>Connect design and code</h3><p>Agree how changes are published and reviewed.</p></article>' +
        '<article class="walk-hold"><p>Practical checks</p><h3>Catch inconsistencies early</h3><p>Automate suitable checks and keep contextual review.</p></article>' +
        "</div>"
      );
    }
    if (st.visual === "cut") {
      return (
        '<div class="walk-cut" role="img" aria-label="Four strata: products, patterns, primitives, tokens">' +
        '<div class="walk-cut-band walk-cut-sky"><p>Sky</p><h3>Products</h3><p>Screens for specific tasks</p></div>' +
        '<div class="walk-cut-band walk-cut-weather"><p>Weather</p><h3>Patterns</h3><p>Recurring task flows</p></div>' +
        '<div class="walk-cut-band walk-cut-paths"><p>Paths</p><h3>Primitives</h3><p>States, access, allowed contents</p></div>' +
        '<div class="walk-cut-band walk-cut-bedrock"><p>Bedrock</p><h3>Tokens</h3><p>Shared values and names</p></div>' +
        "</div>"
      );
    }
    if (st.visual === "cores") {
      return (
        '<div class="sys-cores" style="margin-top:0">' +
        '<figure class="sys-core sys-core-unlogged"><p class="sys-core-label">Example A · unspecified</p>' +
        '<div class="sys-core-tube"><div class="sys-core-cap">Unspecified values</div>' +
        '<div class="sys-core-band" style="background: color-mix(in srgb, #8a7a62 55%, var(--color-bg)); min-height: 3.1rem">blue without a token</div>' +
        '<div class="sys-core-band" style="background: color-mix(in srgb, #c4b49a 40%, var(--color-bg)); min-height: 2.4rem">13px? 14?</div>' +
        '<div class="sys-core-band" style="background: color-mix(in srgb, #6d5c45 35%, var(--color-bg)); min-height: 3.4rem">gap: 7px / 11px / “a bit more”</div>' +
        '<div class="sys-core-band" style="background: color-mix(in srgb, #b08948 30%, var(--color-bg)); min-height: 2.6rem">card, or panel, or both</div>' +
        "</div></figure>" +
        '<figure class="sys-core sys-core-logged"><p class="sys-core-label">Example B · defined</p>' +
        '<div class="sys-core-tube"><div class="sys-core-cap">Shared definitions</div>' +
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
        '<div class="walk-trail-node"><p>Shared reference</p><h3>tokens.json</h3></div>' +
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
      button.setAttribute("aria-label", "Station " + (i + 1) + ": " + walk.stations[i].title);
      button.title = walk.stations[i].title;
      if (enhancedWalk) button.textContent = String(i + 1);
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
        sendAsk(button.textContent);
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
    if (reduceMotion || enhancedWalk) {
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
    if (window.UX_WALK_EVIDENCE) window.UX_WALK_EVIDENCE.clear();
    if (walk) (walkConfig.agent === "oslo" ? window.UX_OSLO : window.UX_EDA).reset({ walkId: walk.id, stationIndex: index });
    const st = station();
    if (!st) return;
    stopTyping();
    if (abort) { abort.abort(); abort = null; }

    form.querySelector("button[type='submit']").disabled = false;
    input.disabled = false;
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
      (st.caption && st.caption !== st.lede ? '<p class="walk-caption">' + escapeHtml(st.caption) + "</p>" : "") +
      (st.tags && st.tags.length
        ? '<ul class="walk-tags">' +
          st.tags.map(function (tag) {
            return "<li>" + escapeHtml(tag) + "</li>";
          }).join("") +
          "</ul>"
        : "");

    if (enhancedWalk) enhanceStation(st);
    main.scrollTop = 0;
    if (enhancedWalk && !reduceMotion) {
      main.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 260, easing: "ease-out" });
    }
    log.innerHTML = "";
    const body = appendTurn("agent", "");
    typeNarration(st.say, body);
    renderAsks(st);
    renderDots();
    if (session) session.activate(walkConfig.agent, function () {
      const context = { walkId: walk.id, stationIndex: index };
      const agent = walkConfig.agent === "oslo" ? window.UX_OSLO : window.UX_EDA;
      return { context, turns: session.capture(log), suggestions: session.captureSuggestions(asks), history: agent.history(context), draft: input.value, scrollTop: log.scrollTop };
    });

    backBtn.disabled = index === 0;
    nextBtn.disabled = false;
    nextBtn.textContent = index === walk.stations.length - 1 ? (enhancedWalk ? "Finish walk →" : "Choose walk") : "Next →";
    if (enhancedWalk) nextBtn.setAttribute("aria-label", index === walk.stations.length - 1 ? "Finish and choose another walk" : "Next: " + walk.stations[index + 1].title);
    input.placeholder = "Ask about this station…";
    input.value = "";

    const hash = "#" + walk.id + (index ? "/" + (index + 1) : "");
    if (window.location.hash !== hash) {
      history.replaceState({ walk: walk.id, index: index }, "", walkConfig.page + hash);
    }
  }

  function focusStation() {
    const heading = main.querySelector("h1");
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
  }

  function enhanceStation(st) {
    const overview = document.createElement("nav");
    overview.className = "eda-station-map";
    overview.setAttribute("aria-label", walk.title + " stations");
    walk.stations.forEach(function (item, i) {
      const step = document.createElement("button");
      step.type = "button";
      step.innerHTML = '<span>' + pad(i + 1) + '</span>' + escapeHtml(item.shortTitle || item.title);
      if (i === index) step.setAttribute("aria-current", "step");
      step.addEventListener("click", function () { goTo(i); });
      overview.appendChild(step);
    });
    main.prepend(overview);
    const visual = main.querySelector(".walk-visual");
    if (st.visual === "image") {
      const image = visual.querySelector("img");
      const frame = document.createElement("div");
      frame.className = "walk-image-frame";
      image.replaceWith(frame);
      frame.appendChild(image);
      const zoom = document.createElement("button");
      zoom.type = "button";
      zoom.className = "eda-zoom";
      zoom.textContent = "Inspect image ↗";
      zoom.setAttribute("aria-label", "Enlarge: " + st.title);
      zoom.addEventListener("click", function () { openImage(st, zoom); });
      visual.appendChild(zoom);
      image.style.cursor = "zoom-in";
      image.addEventListener("click", function () { openImage(st, zoom); });
    }
    if (st.review) {
      const review = document.createElement("section");
      review.className = "eda-review";
      review.setAttribute("aria-label", "Review this design decision");
      review.innerHTML = '<div><h2>' + (walkConfig.agent === "eda" ? "What to notice" : "Design decision") + '</h2><p>' + escapeHtml(st.review.notice) + '</p></div><div><h2>' + (walkConfig.agent === 'eda' ? 'What to test' : 'Consider the tradeoff') + '</h2><p>' + escapeHtml(st.review.test) + '</p></div>';
      main.appendChild(review);
    }
    if (index === walk.stations.length - 1) {
      const end = document.createElement("section");
      end.className = "eda-wrap-up";
      const foundation = walkConfig.agent === "eda" ? "floor" : "ground";
      const nextId = walk.id === foundation ? "m365" : foundation;
      const isFoundation = walk.id === foundation;
      const summaryTitle = walkConfig.agent === "eda" ? (isFoundation ? "Put the questions to work." : "From observation to a test plan.") : (isFoundation ? "See the system in a product." : "Connect the product to its foundation.");
      const summaryCopy = walkConfig.agent === "eda" ? (isFoundation ? "Try Performance Monitoring to apply these questions to incident states, charts, and timelines." : "Take these questions into a working-product review. Screenshots explain design intent; interaction testing supplies the missing evidence.") : (isFoundation ? "Explore how a complex admin experience brings states, actions, and information hierarchy together." : "Revisit the shared values, component rules, and maintenance decisions behind a coherent product experience.");
      end.innerHTML = '<p class="walk-station-kicker">Take it further</p><h2>' + summaryTitle + '</h2><p>' + summaryCopy + '</p>';
      const next = document.createElement("a");
      next.className = "eda-related-link";
      next.href = walkConfig.page + "#" + nextId;
      next.textContent = (isFoundation ? "Walk through Performance Monitoring" : (walkConfig.agent === "eda" ? "Revisit accessibility foundations" : "Explore the ground layer")) + " →";
      next.addEventListener("click", function (event) { event.preventDefault(); if (session) session.clear(walkConfig.agent); startWalk(nextId, 0); });
      const read = document.createElement("a");
      read.className = "eda-related-link";
      read.href = walk.readUrl;
      read.textContent = "Read the full story ↗";
      end.append(next, read);
      (walk.sources || []).forEach(function (source) {
        const link = document.createElement("a");
        link.className = "eda-source-link"; link.href = source.url; link.target = "_blank"; link.rel = "noopener"; link.textContent = source.title + " ↗"; end.appendChild(link);
      });
      main.appendChild(end);
    }
  }

  function openImage(st, trigger) {
    const dialog = document.createElement("dialog");
    dialog.className = "eda-image-dialog";
    dialog.setAttribute("aria-label", st.title + " — enlarged evidence");
    const head = document.createElement("div"); head.className = "eda-image-head";
    const title = document.createElement("h2"); title.textContent = st.title;
    const close = document.createElement("button"); close.type = "button"; close.textContent = "Close ×";
    const viewport = document.createElement("div"); viewport.className = "eda-image-viewport";
    const img = document.createElement("img"); img.src = st.src; img.alt = st.alt || st.title;
    viewport.appendChild(img); head.append(title, close); dialog.append(head, viewport);
    document.body.appendChild(dialog);
    close.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (event) { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("close", function () { dialog.remove(); if (trigger.isConnected) trigger.focus(); });
    dialog.showModal(); close.focus();
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
      if (enhancedWalk) focusStation();
      else if (input) input.focus();
    });
  }

  function showPicker() {
    if (window.UX_WALK_EVIDENCE) window.UX_WALK_EVIDENCE.clear();
    if (session) session.clear(walkConfig.agent);
    stopTyping();
    if (abort) { abort.abort(); abort = null; }
    walk = null;
    index = 0;
    setMode("pick");
    if (enhancedWalk) picker.querySelector("h1").setAttribute("tabindex", "-1");
    if (enhancedWalk) picker.querySelector("h1").focus();
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
    if (enhancedWalk) focusStation();
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

    const request = new AbortController();
    abort = request;
    try {
      if (walkConfig.agent === "oslo") {
        await window.UX_OSLO.answer(message, body, { walkId: walk.id, stationIndex: index }, request.signal);
        hideLoader(body);
        if (session && abort === request) session.advanceSuggestions(asks, message, st.followUps, (walkConfig.agent === "oslo" ? window.UX_OSLO : window.UX_EDA).history({ walkId: walk.id, stationIndex: index }));
        return;
      }
      await window.UX_EDA.answer(message, body, { walkId: walk.id, stationIndex: index }, request.signal, function () {
        log.scrollTop = log.scrollHeight;
      });
      hideLoader(body);
      if (session && abort === request) session.advanceSuggestions(asks, message, st.followUps, (walkConfig.agent === "oslo" ? window.UX_OSLO : window.UX_EDA).history({ walkId: walk.id, stationIndex: index }));
    } catch (error) {
      if (error && error.name === "AbortError") {
        hideLoader(body);
        body.textContent = "Reply stopped. You can ask again.";
        return;
      }
      hideLoader(body);
      body.textContent =
        error && error.message
          ? error.message
          : "Something went wrong sending that message. Please try again.";
    } finally {
      if (abort !== request) return;
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

  function slideRailIn() {
    const rail = stage.querySelector(".walk-rail");
    if (reduceMotion || !rail) return;
    const root = document.documentElement;
    const done = function () {
      root.classList.remove("is-walk-entering");
    };
    root.classList.remove("is-walk-entering");
    void rail.offsetWidth;
    root.classList.add("is-walk-entering");
    rail.addEventListener("animationend", done, { once: true });
    window.setTimeout(done, 700);
  }

  picker.querySelectorAll("[data-walk]").forEach(function (button) {
    button.addEventListener("click", function () {
      startWalk(button.getAttribute("data-walk"), 0);
      slideRailIn();
    });
  });

  // Site navigation is an intentional exit, unlike evidence inspected inside the walk.
  document.querySelectorAll(".walk-exit, .walk-header a[href]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === "_blank" || link.hasAttribute("download")) return;
      if (session) session.clear(walkConfig.agent);
      stopTyping();
      if (abort) { abort.abort(); abort = null; }
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
    if (event.defaultPrevented || document.querySelector(".eda-image-dialog[open]")) return;
    if (event.key === "ArrowRight") { event.preventDefault(); goTo(index + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); goTo(index - 1); }
    if (event.key === "Escape") showPicker();
  });

  window.addEventListener("popstate", function () {
    const parsed = parseHash();
    if (parsed.id && WALKS[parsed.id]) startWalk(parsed.id, parsed.index);
    else showPicker();
  });

  input.addEventListener("input", function () { if (walk && session) session.checkpoint(); });
  log.addEventListener("scroll", function () { if (walk && session) session.checkpoint(); }, { passive: true });

  const parsed = parseHash();
  if (carried && carried.context.walkId && Object.hasOwn(WALKS, carried.context.walkId) && (!parsed.id || (parsed.id === carried.context.walkId && parsed.index === carried.context.stationIndex))) {
    startWalk(carried.context.walkId, carried.context.stationIndex);
    const context = { walkId: walk.id, stationIndex: index };
    const agent = walkConfig.agent === "oslo" ? window.UX_OSLO : window.UX_EDA;
    agent.resume(context, carried.history);
    stopTyping();
    setStatus("idle", "With you");
    session.restore(log, carried.turns, appendTurn, walkConfig.agent === "oslo" ? window.UX_OSLO.render : null);
    session.restoreSuggestions(asks, carried.suggestions);
    input.value = typeof carried.draft === "string" ? carried.draft.slice(0, 4000) : "";
    window.requestAnimationFrame(function () { log.scrollTop = carried.scrollTop || 0; });
    session.checkpoint();
  } else if (parsed.id && WALKS[parsed.id]) startWalk(parsed.id, parsed.index);
  else setMode("pick");
})();
