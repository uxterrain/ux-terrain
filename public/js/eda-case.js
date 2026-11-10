(function () {
  "use strict";

  const panel = document.getElementById("eda-panel");
  const openBtn = document.getElementById("eda-open");
  const closeBtn = document.getElementById("eda-close");
  const stationEl = document.getElementById("eda-station");
  const log = document.getElementById("eda-log");
  const asks = document.getElementById("eda-asks");
  const form = document.getElementById("eda-form");
  const input = document.getElementById("eda-input");
  const statusEl = document.getElementById("eda-status");
  const backBtn = document.getElementById("eda-back");
  const nextBtn = document.getElementById("eda-next");
  const dots = document.getElementById("eda-dots");
  const session = window.UX_GUIDE_SESSION;
  const continuation = session && session.read();
  const carried = continuation && continuation.guide === "eda" ? continuation : null;
  const pageWalkId = openBtn && openBtn.getAttribute("data-eda-walk") || "m365";
  const walkId = carried ? carried.context.walkId : openBtn && openBtn.getAttribute("data-eda-walk") || "m365";
  let walk = window.EDA_WALKS && Object.hasOwn(window.EDA_WALKS, walkId) ? window.EDA_WALKS[walkId] : null;
  if (!panel || !openBtn || !log || !form || !input || !walk) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scroller = document.querySelector("#site-column main");

  let isOpen = false;
  let index = carried ? carried.context.stationIndex : 0;
  if (!Number.isInteger(index) || index < 0 || index >= walk.stations.length) index = 0;
  let started = false;
  let typeTimer = 0;
  let abort = null;
  let anchorToken = 0;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function station() {
    return walk.stations[index];
  }

  function idleLabel() {
    return new URL(walk.readUrl, window.location.origin + "/").pathname === window.location.pathname ? "On this screen" : "Continuing " + walk.kicker;
  }

  function setStatus(state, label) {
    if (!statusEl) return;
    statusEl.dataset.state = state;
    statusEl.textContent = label;
  }

  function closeOslo() {
    if (!document.documentElement.classList.contains("is-agent-open")) return;
    const osloClose = document.getElementById("agent-close");
    if (osloClose) osloClose.click();
  }

  function clearAnchor() {
    document.querySelectorAll("[data-eda-screen]").forEach(function (figure) {
      figure.classList.remove("is-eda-anchor");
      figure.removeAttribute("aria-current");
    });
  }

  function anchorScreen(id) {
    const token = ++anchorToken;
    clearAnchor();
    if (!id || !scroller || new URL(walk.readUrl, window.location.origin + "/").pathname !== window.location.pathname) return;
    const target = scroller.querySelector('[data-eda-screen="' + id + '"]');
    if (!target) return;
    target.classList.add("is-eda-anchor");
    target.setAttribute("aria-current", "true");
    function scroll() {
      if (token !== anchorToken || !isOpen) return;
      const top =
        target.getBoundingClientRect().top -
        scroller.getBoundingClientRect().top +
        scroller.scrollTop -
        20;
      scroller.scrollTo({
        top: Math.max(0, top),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }
    scroll();
    window.setTimeout(scroll, 340);
  }

  function setOpen(open) {
    isOpen = open;
    document.documentElement.classList.toggle("is-eda-open", open);
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    openBtn.setAttribute("aria-expanded", open ? "true" : "false");
    panel.inert = !open;
    if (open) {
      closeOslo();
      if (!started) {
        started = true;
        renderStation();
      } else {
        anchorScreen(station().anchor);
      }
      if (session) session.activate("eda", function () {
        const context = { walkId: walk.id, stationIndex: index };
        return { context, turns: session.capture(log), history: window.UX_EDA.history(context), draft: input.value, scrollTop: log.scrollTop };
      });
      window.requestAnimationFrame(function () {
        input.focus();
      });
    } else {
      if (session) session.clear("eda");
      clearAnchor();
      if (abort) { abort.abort(); abort = null; }
      setBusy(false);
      if (walk.id !== pageWalkId && Object.hasOwn(window.EDA_WALKS, pageWalkId)) {
        walk = window.EDA_WALKS[pageWalkId]; index = 0; started = false;
      }
      if (panel.contains(document.activeElement)) (openBtn.hidden ? document.querySelector(".site-lockup") : openBtn).focus();
    }
  }

  function stopTyping() {
    if (typeTimer) {
      window.clearInterval(typeTimer);
      typeTimer = 0;
    }
  }

  function appendTurn(role, text) {
    const turn = document.createElement("article");
    turn.className = "chat-turn " + (role === "user" ? "chat-turn-user" : "chat-turn-agent");
    const label = document.createElement("p");
    label.className = "chat-turn-label";
    label.textContent = role === "user" ? "You" : "Eda";
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

  function typeNarration(text, body) {
    stopTyping();
    if (reduceMotion) {
      hideLoader(body);
      body.textContent = text;
      setStatus("idle", idleLabel());
      return;
    }
    setStatus("walking", "Reading");
    hideLoader(body);
    let i = 0;
    body.textContent = "";
    typeTimer = window.setInterval(function () {
      i += 1;
      body.textContent = text.slice(0, i);
      log.scrollTop = log.scrollHeight;
      if (i >= text.length) {
        stopTyping();
        setStatus("idle", idleLabel());
      }
    }, 14);
    body.addEventListener(
      "click",
      function () {
        stopTyping();
        body.textContent = text;
        setStatus("idle", idleLabel());
      },
      { once: true }
    );
  }

  function renderDots() {
    dots.innerHTML = "";
    walk.stations.forEach(function (st, i) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "walk-dot" + (i === index ? " is-current" : "");
      button.setAttribute("aria-label", st.title);
      if (i === index) button.setAttribute("aria-current", "step");
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

  function renderStation() {
    const st = station();
    if (!st) return;
    stopTyping();
    if (abort) { abort.abort(); abort = null; }

    window.UX_EDA.reset({ walkId: walk.id, stationIndex: index });
    setBusy(false);
    stationEl.replaceChildren();
    const kicker = document.createElement("span");
    kicker.textContent = pad(index + 1) + " / " + pad(walk.stations.length) + " · " + walk.kicker;
    const title = document.createElement("strong");
    title.textContent = st.title;
    stationEl.append(kicker, title);
    if (new URL(walk.readUrl, window.location.origin + "/").pathname !== window.location.pathname) {
      const source = document.createElement("a"); source.className = "guide-context-link accent-link";
      source.href = walk.id === "floor" ? "/eda.html#floor/" + index : "/" + walk.readUrl; source.textContent = "View this screen →";
      stationEl.appendChild(source);
    }

    log.innerHTML = "";
    const body = appendTurn("agent", "");
    typeNarration(st.say, body);
    renderAsks(st);
    renderDots();
    anchorScreen(st.anchor);

    backBtn.disabled = index === 0;
    nextBtn.disabled = false;
    nextBtn.textContent = index === walk.stations.length - 1 ? "Done" : "Next →";
    input.value = "";
  }

  function goTo(nextIndex) {
    if (nextIndex < 0) return;
    if (nextIndex >= walk.stations.length) {
      setOpen(false);
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

  function setBusy(busy) {
    asks.querySelectorAll("button").forEach(function (button) {
      button.disabled = busy;
    });
    form.querySelector("button[type='submit']").disabled = busy;
    input.disabled = busy;
  }

  async function sendAsk(message) {
    const st = station();
    if (!st || !message) return;
    stopTyping();
    setBusy(true);
    setStatus("answering", "Answering");
    appendTurn("user", message);
    input.value = "";
    const body = appendTurn("agent", "");
    const request = new AbortController();
    abort = request;
    try {
      await window.UX_EDA.answer(message, body, { walkId: walk.id, stationIndex: index }, request.signal, function () {
        log.scrollTop = log.scrollHeight;
      });
      hideLoader(body);
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
      setBusy(false);
      setStatus("idle", idleLabel());
      if (isOpen) input.focus();
    }
  }

  if (carried) {
    started = true;
    renderStation();
    const context = { walkId: walk.id, stationIndex: index };
    window.UX_EDA.resume(context, carried.history);
    session.restore(log, carried.turns, appendTurn);
    stopTyping();
    setStatus("idle", idleLabel());
    input.value = typeof carried.draft === "string" ? carried.draft.slice(0, 4000) : "";
    setOpen(true);
    window.requestAnimationFrame(function () { log.scrollTop = carried.scrollTop || 0; });
  }
  input.addEventListener("input", function () { if (isOpen && session) session.checkpoint(); });
  log.addEventListener("scroll", function () { if (isOpen && session) session.checkpoint(); }, { passive: true });

  openBtn.addEventListener("click", function () {
    setOpen(!isOpen);
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      setOpen(false);
    });
  }

  document.querySelectorAll(".js-agent-open").forEach(function (button) {
    button.addEventListener("click", function () {
      if (isOpen) setOpen(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen) setOpen(false);
  });

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
})();
