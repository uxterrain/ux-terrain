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
  const walk = window.EDA_WALKS && window.EDA_WALKS.m365;
  if (!panel || !openBtn || !log || !form || !input || !walk) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scroller = document.querySelector("#site-column main");

  let isOpen = false;
  let index = 0;
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
    if (!id || !scroller) return;
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
      window.requestAnimationFrame(function () {
        input.focus();
      });
    } else {
      clearAnchor();
      if (abort) abort.abort();
      if (panel.contains(document.activeElement)) openBtn.focus();
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
      setStatus("idle", "On this screen");
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
        setStatus("idle", "On this screen");
      }
    }, 14);
    body.addEventListener(
      "click",
      function () {
        stopTyping();
        body.textContent = text;
        setStatus("idle", "On this screen");
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
    if (abort) abort.abort();

    stationEl.replaceChildren();
    const kicker = document.createElement("span");
    kicker.textContent = pad(index + 1) + " / " + pad(walk.stations.length) + " · This screen";
    const title = document.createElement("strong");
    title.textContent = st.title;
    stationEl.append(kicker, title);

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
    abort = new AbortController();
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abort.signal,
        body: JSON.stringify({
          message: message,
          agent: "eda",
          context: {
            walk: walk.title,
            station: st.title,
            brief: st.lede,
          },
        }),
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
      let begun = false;
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        reply += decoder.decode(chunk.value, { stream: true });
        const plain = toPlainReply(reply);
        if (!begun && plain) {
          hideLoader(body);
          begun = true;
        }
        if (begun) {
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
      setBusy(false);
      setStatus("idle", "On this screen");
      if (isOpen) input.focus();
    }
  }

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
