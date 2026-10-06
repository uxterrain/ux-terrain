(function () {
  "use strict";

  const THEME_KEY = "ux-terrain-theme";

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
      toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }
  }

  function initTheme() {
    applyTheme(getPreferredTheme());

    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", function () {
      const next =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "light"
          : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  function initMobileNav() {
    const button = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-menu");
    if (!button || !menu) return;

    button.addEventListener("click", function () {
      const open = menu.classList.toggle("hidden") === false;
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 767px)").matches) {
          menu.classList.add("hidden");
          button.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  /* -------------------------------------------------------------------------
     Agent column — local UI only (inline split layout, not a modal).
     Connect the backend API route for the AI agent in sendChatMessage().
     ------------------------------------------------------------------------- */
  function initAgentPanel() {
    const panel = document.getElementById("agent-panel");
    const closeBtn = document.getElementById("agent-close");
    const openButtons = document.querySelectorAll(".js-agent-open");
    const form = document.getElementById("chat-form");
    const input = document.getElementById("chat-input");
    const log = document.getElementById("chat-log");
    if (!panel || !form || !input || !log) return;

    let isOpen = false;
    let lastFocus = null;

    function setOpen(open) {
      isOpen = open;
      const orbit = document.querySelector(".hero-orbit");
      if (orbit && typeof orbit.osloListen === "function") {
        orbit.osloListen(open);
      }
      document.documentElement.classList.toggle("is-agent-open", open);
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      openButtons.forEach(function (button) {
        button.setAttribute("aria-expanded", open ? "true" : "false");
      });

      panel.inert = !open;

      if (open) {
        window.requestAnimationFrame(function () {
          input.focus();
        });
      } else if (lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus();
      }
    }

    openButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        lastFocus = button;
        const menu = document.getElementById("nav-menu");
        const navToggle = document.getElementById("nav-toggle");
        if (menu && !menu.classList.contains("hidden")) {
          menu.classList.add("hidden");
          if (navToggle) navToggle.setAttribute("aria-expanded", "false");
        }
        setOpen(!isOpen);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        setOpen(false);
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen) {
        setOpen(false);
      }
    });

    function toPlainReply(text) {
      return String(text || "")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/__(.+?)__/g, "$1")
        .replace(/(^|[\s(])\*(?!\s)([^*\n]+)\*(?=[\s).,;:!?]|$)/g, "$1$2")
        .replace(/`+/g, "")
        .replace(/^\s*[-*]\s+/gm, "");
    }

    function appendMessage(role, text) {
      const turn = document.createElement("article");
      turn.className =
        "chat-turn " + (role === "user" ? "chat-turn-user" : "chat-turn-agent");

      const label = document.createElement("p");
      label.className = "chat-turn-label";
      label.textContent = role === "user" ? "You" : "Oslo";

      const body = document.createElement("p");
      body.className = "chat-turn-body";
      body.textContent = text;

      turn.appendChild(label);

      if (role === "agent" && !text) {
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

    function hideAgentLoader(body) {
      const turn = body.parentElement;
      if (!turn) return;
      const loader = turn.querySelector(".chat-loader");
      if (loader) loader.remove();
    }

    function setBusy(busy) {
      form.querySelector("button[type='submit']").disabled = busy;
      input.disabled = busy;
      panel.querySelectorAll(".js-quick-inquiry").forEach(function (button) {
        button.disabled = busy;
      });
    }

    async function streamAgentReply(message, body) {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message }),
      });

      if (!response.ok) {
        let detail = "The agent could not reply.";
        try {
          const payload = await response.json();
          if (payload && payload.error) detail = payload.error;
        } catch (parseError) {
          /* non-JSON error body */
        }
        throw new Error(detail);
      }

      if (!response.body) {
        throw new Error("Streaming is not available in this browser.");
      }

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
          hideAgentLoader(body);
          started = true;
        }
        if (started) {
          body.textContent = plain;
          log.scrollTop = log.scrollHeight;
        }
      }

      reply += decoder.decode();
      hideAgentLoader(body);
      body.textContent = toPlainReply(reply) || "The agent returned an empty reply.";
    }

    async function sendUserMessage(message) {
      appendMessage("user", message);
      input.value = "";
      setBusy(true);

      const agentBody = appendMessage("agent", "");

      try {
        await streamAgentReply(message, agentBody);
      } catch (error) {
        hideAgentLoader(agentBody);
        agentBody.textContent =
          error && error.message
            ? error.message
            : "Something went wrong sending that message. Please try again.";
        console.error(error);
      } finally {
        setBusy(false);
        input.focus();
      }
    }

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const message = input.value.trim();
      if (!message) return;
      await sendUserMessage(message);
    });

    panel.querySelectorAll(".js-quick-inquiry").forEach(function (button) {
      button.addEventListener("click", function () {
        const label = button.querySelector(".js-inquiry-label");
        const message = (label ? label.textContent : button.textContent)
          .replace(/\s+/g, " ")
          .trim();
        if (!message) return;
        sendUserMessage(message);
      });
    });
  }

  function initSiteColumnScroll() {
    const column = document.getElementById("site-column");
    if (!column) return;
    const scroller = column.querySelector("main") || column;

    try {
      history.scrollRestoration = "manual";
    } catch (error) {}

    function pinWindow() {
      if (window.scrollX || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop) {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    }

    function scrollToHash(hash, behavior) {
      pinWindow();
      const id = (hash || "").replace(/^#/, "");
      if (!id || id === "top" || (scroller.id && scroller.id === id)) {
        scroller.scrollTo({ top: 0, behavior: behavior });
        pinWindow();
        return;
      }
      const target = document.getElementById(id);
      if (!target || !scroller.contains(target)) {
        pinWindow();
        return;
      }
      const top =
        target.getBoundingClientRect().top -
        scroller.getBoundingClientRect().top +
        scroller.scrollTop;
      scroller.scrollTo({ top: Math.max(0, top), behavior: behavior });
      pinWindow();
    }

    document.addEventListener("click", function (event) {
      const link = event.target.closest("a[href]");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || href.indexOf("#") === -1) return;

      let url;
      try {
        url = new URL(link.href, window.location.href);
      } catch (error) {
        return;
      }
      if (url.pathname !== window.location.pathname) return;

      event.preventDefault();
      if (url.hash) {
        history.pushState(null, "", url.hash);
        scrollToHash(url.hash, "smooth");
      } else {
        history.pushState(null, "", window.location.pathname);
        scrollToHash("", "smooth");
      }
    });

    window.addEventListener(
      "scroll",
      function () {
        pinWindow();
      },
      { passive: true }
    );

    window.addEventListener("popstate", function () {
      scrollToHash(window.location.hash, "auto");
    });

    if (window.location.hash) {
      pinWindow();
      window.requestAnimationFrame(function () {
        scrollToHash(window.location.hash, "auto");
      });
    }
  }

  function studioInbox() {
    return ["uxterrain", "gmail.com"].join(String.fromCharCode(64));
  }

  function initContactMail() {
    const links = document.querySelectorAll(".js-mail");
    if (!links.length) return;

    const address = studioInbox();

    links.forEach(function (link) {
      if (!link.hasAttribute("data-mail-label")) link.textContent = address;
      link.setAttribute("aria-label", "Email " + address);
      link.setAttribute("href", "#contact");
      link.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = "mailto:" + address;
      });
    });
  }

  function initHeroOrbitPulse() {
    const orbit = document.querySelector(".hero-orbit");
    if (!orbit) return;

    const paths = Array.prototype.slice.call(orbit.querySelectorAll("path"));
    if (!paths.length) return;

    runOrbit(orbit, paths);
  }

  function runOrbit(orbit, paths) {

    const BASE = [255, 175, 52];
    const ACCENTS = [
      [194, 65, 12],
      [47, 95, 163],
      [122, 62, 158],
    ];
    let pulsing = 0;
    let pulseGen = 0;

    function resetStrokes() {
      pulseGen += 1;
      pulsing = 0;
      paths.forEach(function (path) {
        path.setAttribute("stroke", "#FFAF34");
        path.removeAttribute("data-orbit-pulse");
      });
    }

    orbit.osloListen = resetStrokes;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function easeInOut(t) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function mix(a, b, t) {
      return [
        Math.round(a[0] + (b[0] - a[0]) * t),
        Math.round(a[1] + (b[1] - a[1]) * t),
        Math.round(a[2] + (b[2] - a[2]) * t),
      ];
    }

    function toStroke(rgb) {
      return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
    }

    function tweenStroke(path, from, to, duration) {
      return new Promise(function (resolve) {
        const start = performance.now();
        const gen = pulseGen;
        function frame(now) {
          if (gen !== pulseGen) {
            resolve();
            return;
          }
          const t = Math.min(1, (now - start) / duration);
          path.setAttribute("stroke", toStroke(mix(from, to, easeInOut(t))));
          if (t < 1) {
            window.requestAnimationFrame(frame);
          } else {
            resolve();
          }
        }
        window.requestAnimationFrame(frame);
      });
    }

    function pulseOne() {
      if (document.documentElement.classList.contains("is-agent-open")) return;
      if (pulsing > 1) return;
      const path = paths[Math.floor(Math.random() * paths.length)];
      if (path.dataset.orbitPulse === "1") return;

      path.dataset.orbitPulse = "1";
      path.setAttribute("stroke-width", "0.3");
      pulsing += 1;
      const accent = ACCENTS[Math.floor(Math.random() * ACCENTS.length)];
      const up = 900 + Math.round(Math.random() * 500);
      const down = 1100 + Math.round(Math.random() * 600);
      const gen = pulseGen;

      tweenStroke(path, BASE, accent, up)
        .then(function () {
          if (gen !== pulseGen) return;
          return tweenStroke(path, accent, BASE, down);
        })
        .then(function () {
          if (gen !== pulseGen) return;
          path.setAttribute("stroke", "#FFAF34");
          path.removeAttribute("data-orbit-pulse");
          pulsing = Math.max(0, pulsing - 1);
        });
    }

    function loop() {
      pulseOne();
      if (Math.random() < 0.12) {
        window.setTimeout(pulseOne, 450 + Math.random() * 650);
      }
      window.setTimeout(loop, 2800 + Math.random() * 3400);
    }

    paths.forEach(function (path) {
      path.setAttribute("stroke-width", "0.3");
      path.setAttribute("stroke", "#FFAF34");
    });

    window.setTimeout(loop, 1600 + Math.random() * 1200);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initMobileNav();
    initAgentPanel();
    initSiteColumnScroll();
    initContactMail();
    initHeroOrbitPulse();
  });
})();
