(function () {
  "use strict";

  // Shared by the sidebar and Oslo walks. No model-provided HTML or URLs execute.
  const osloConversations = new Map();
  function conversationScope(context) {
    return context.walkId ? "walk:" + context.walkId + ":" + context.stationIndex : "project:" + (context.projectId || "portfolio");
  }
  const session = window.UX_GUIDE_SESSION;
  function cleanHistory(input) {
    return Array.isArray(input) ? input.slice(-6).filter(turn => turn && ["user", "assistant"].includes(turn.role) && typeof turn.content === "string").map(turn => ({ role: turn.role, content: turn.content.slice(0, 3000) })) : [];
  }
  function renderOsloAnswer(result, body) {
    const safe = { claims: Array.isArray(result.claims) ? result.claims.filter(claim => claim && typeof claim.text === "string" && ["documented", "interpretation", "gap"].includes(claim.kind)).slice(0, 3) : [] };
    body.osloAnswer = safe;
    body.replaceChildren();
    const sources = new Map();
    safe.claims.forEach(function (claim) {
      const item = document.createElement("span");
      item.className = "oslo-claim";
      if (claim.kind === "interpretation") {
        const label = document.createElement("strong"); label.textContent = "Design analysis. "; item.appendChild(label);
      }
      item.appendChild(document.createTextNode(claim.text));
      (Array.isArray(claim.evidence) ? claim.evidence : []).forEach(function (source) {
        if (!source || typeof source.title !== "string" || !/^\/(?:work\/(?:armada|iqvia|oslo|performance-monitoring|sbi|zone-focus|eda)|systems|about)\.html#(?:oslo-evidence-\d+|implementation-note|practice-identity|(?:shifts|cut|core|trail|lay|proof|contact)-title)$/.test(source.url)) return;
        sources.set(source.url, source);
      });
      body.appendChild(item);
    });
    if (sources.size) {
      const references = document.createElement("span"); references.className = "oslo-evidence-list";
      references.setAttribute("aria-label", "Supporting project sections");
      sources.forEach(function (source) {
        const link = document.createElement("a"); link.className = "oslo-evidence accent-link"; link.href = source.url; link.textContent = source.title;
        references.appendChild(link);
      });
      body.appendChild(references);
    }
  }
  const osloIntroductions = {
    "sbi": "I see you’re exploring SBI. Jimmy’s design work helps teams connect equipment activity with decisions about parts and inventory. Anything you’d like to dig into?",
    "zone-focus": "I see you’re getting to know Flotrak. It’s about helping people learn photography by trying things themselves, with Coach there to guide them. Curious about how any of it works?",
    "armada": "I see you’re exploring Armada. Jimmy worked on helping operators keep track of multiple drones, follow their paths, and stay with what’s happening on the mission. What would you like to know?",
    "performance-monitoring": "I see you’re looking at the M365 work. Jimmy designed ways to help admins understand an issue, see who’s affected, and work out what to do next. Anything you’d like a closer look at?",
    "iqvia": "I see you’re exploring IQVIA. Jimmy worked on helping teams create, review, and approve medical content, with a clearer path through the process. What are you curious about?",
    "oslo": "You’re reading about how I fit into the site. The idea is to help you explore the work and ask about the decisions along the way. Happy to talk through how that came together.",
    "eda": "I see you’re getting to know Eda. Jimmy designed her to help people explore accessibility through the interfaces and decisions in this portfolio. Anything you’d like to understand better?",
    "systems": "I see you’re exploring Jimmy’s approach to design systems. It’s about giving teams a shared foundation they can put to work. What would you like to talk through?"
};
  window.UX_OSLO = {
    introduction(projectId) {
      return Object.prototype.hasOwnProperty.call(osloIntroductions, projectId)
        ? osloIntroductions[projectId]
        : "Hi, I’m Oslo. Take a look around, and ask me anything you’re curious about in the work.";
    },
    hasConversation(state) {
      return Boolean(state && state.guide === "oslo" &&
        ((Array.isArray(state.turns) && state.turns.some(turn => turn && turn.role === "user")) ||
         (Array.isArray(state.history) && state.history.some(turn => turn && turn.role === "user"))));
    },
    render: renderOsloAnswer,
    history(context) { return cleanHistory(osloConversations.get(conversationScope(context))); },
    resume(context, history) { osloConversations.set(conversationScope(context), cleanHistory(history)); },
    reset(context) { osloConversations.delete(conversationScope(context)); },
    async answer(message, body, context, signal) {
      const scope = conversationScope(context);
      const history = osloConversations.get(scope) || [];
      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: signal,
        body: JSON.stringify({ message: message, responseFormat: "grounded-v1", context: context, history: history })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Oslo could not answer. Please try again.");
      if (signal && signal.aborted) return;
      if (!Array.isArray(result.claims)) throw new Error("Oslo returned an incomplete answer. Please try again.");
      const answerText = result.claims.map(claim => claim.kind + ": " + claim.text).join("\n");
      // Memory is bounded per project/station; open guides can carry it within this tab.
      osloConversations.set(scope, history.concat([{role: "user", content: message}, {role: "assistant", content: answerText}]).slice(-6));
      renderOsloAnswer(result, body);
      attachGuideSupport(body, message, result.support);
      if (session) session.checkpoint();
    }
  };

  const edaConversations = new Map();
  window.UX_EDA = {
    history(context) { return cleanHistory(edaConversations.get(conversationScope(context))); },
    resume(context, history) { edaConversations.set(conversationScope(context), cleanHistory(history)); },
    reset(context) { edaConversations.delete(conversationScope(context)); },
    async answer(message, body, context, signal, onUpdate) {
      const scope = conversationScope(context);
      const history = edaConversations.get(scope) || [];
      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal,
        body: JSON.stringify({ agent: "eda", message, context, history })
      });
      if (!response.ok) {
        let detail = "Eda couldn’t answer. Please try again.";
        try { detail = (await response.json()).error || detail; } catch (_) {}
        throw new Error(detail);
      }
      if (!response.body) throw new Error("The reply could not load. Please try again.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      while (true) {
        const chunk = await reader.read();
        if (signal && signal.aborted) { await reader.cancel(); return; }
        if (chunk.done) break;
        reply += decoder.decode(chunk.value, { stream: true });
        body.textContent = reply;
        if (onUpdate) onUpdate();
      }
      reply = (reply + decoder.decode()).trim();
      if (!reply) throw new Error("Eda returned an empty reply. Please try again.");
      body.textContent = reply;
      let support;
      try { support = JSON.parse(atob(response.headers && response.headers.get("X-Guide-Support") || "")); } catch (_) {}
      attachGuideSupport(body, message, support);
      edaConversations.set(scope, history.concat([{ role: "user", content: message }, { role: "assistant", content: reply }]).slice(-6));
      if (session) session.checkpoint();
    }
  };

  // A visitor chooses what to share; questions never become source evidence automatically.
  function attachGuideSupport(body, question, support) {
    if (!body || !body.parentElement || typeof question !== "string" || question.length > 4000 || !support || !["oslo", "eda"].includes(support.guide)) return;
    const projects = { sbi: "SBI", "zone-focus": "Flotrak", "performance-monitoring": "M365", armada: "Armada", iqvia: "IQVIA", oslo: "Oslo", eda: "Eda", systems: "Systems", portfolio: "UX Terrain" };
    if (!Object.prototype.hasOwnProperty.call(projects, support.projectId) || !/^\/(?:index|systems|work\/(?:sbi|zone-focus|performance-monitoring|armada|iqvia|oslo|eda))\.html$/.test(support.page)) return;
    const existing = body.parentElement.querySelector(".guide-support");
    if (existing) existing.remove();
    const actions = document.createElement("div"); actions.className = "guide-support";
    const project = projects[support.projectId];
    if (support.needsFollowup) {
      const invitation = document.createElement("p"); invitation.textContent = "Want to go into more detail? You can ask Jimmy directly.";
      const email = document.createElement("a"); email.className = "accent-link"; email.textContent = "Ask Jimmy about this ↗";
      const pageUrl = "https://ux-terrain.vercel.app" + support.page;
      email.href = "mailto:uxterrain@gmail.com?subject=" + encodeURIComponent("A question about " + project) + "&body=" + encodeURIComponent("Hi Jimmy,\n\nI was exploring " + project + " with " + (support.guide === "eda" ? "Eda" : "Oslo") + " and wanted to ask:\n\n" + question + "\n\nCase study: " + pageUrl + "\n\nThanks!");
      actions.appendChild(invitation); actions.appendChild(email);
    }
    if (typeof support.token === "string" && support.token.length < 3000) {
      const details = document.createElement("details");
      const summary = document.createElement("summary"); summary.textContent = "Suggest a question for the portfolio";
      const label = document.createElement("label"); label.className = "guide-review-label"; label.textContent = "Question to share";
      const textarea = document.createElement("textarea"); textarea.maxLength = 600; textarea.rows = 3; textarea.value = question.slice(0, 600); label.appendChild(textarea);
      const notice = document.createElement("p"); notice.className = "guide-review-notice"; notice.textContent = "Only this question, the guide, and the page context will be saved privately for Jimmy to review. Your conversation and contact details aren’t included. Leave out personal or confidential information. Nothing is saved until you choose Share question.";
      const privacy = document.createElement("a"); privacy.className = "accent-link"; privacy.href = "/privacy.html"; privacy.target = "_blank"; privacy.rel = "noopener"; privacy.textContent = "How questions are used";
      const send = document.createElement("button"); send.type = "button"; send.className = "guide-review-send"; send.textContent = "Share question";
      const status = document.createElement("p"); status.className = "guide-review-status"; status.setAttribute("role", "status");
      send.addEventListener("click", async function () {
        if (!textarea.value.trim()) { status.textContent = "Add a question before sharing."; return; }
        send.disabled = true; textarea.disabled = true; status.textContent = "Sharing…";
        try {
          const response = await fetch("/api/guide-questions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: textarea.value.trim(), token: support.token, consent: true }) });
          const result = await response.json();
          if (!response.ok || !result.saved) throw new Error(result.error || "That didn’t save. Please try again.");
          status.textContent = "Thanks—Jimmy can use this to make the portfolio more useful. This isn’t an email request, so there’s no reply to wait for.";
          send.textContent = "Shared";
        } catch (error) { status.textContent = error.message || "That didn’t save. Please try again."; send.disabled = false; textarea.disabled = false; }
      });
      details.appendChild(summary); details.appendChild(label); details.appendChild(notice); details.appendChild(privacy); details.appendChild(send); details.appendChild(status); actions.appendChild(details);
    }
    if (actions.children.length) body.parentElement.appendChild(actions);
    body.guideSupport = { question, support };
  }
  window.UX_GUIDE_SUPPORT = { attach: attachGuideSupport };

  const THEME_KEY = "ux-terrain-theme";

  function getPreferredTheme() {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch (_) {}
    return "dark";
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
      try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
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
    const continuation = session && session.read();
    const resumeConversation = window.UX_OSLO.hasConversation(continuation);
    let conversationContext = resumeConversation ? continuation.context : null;
    function currentContext() {
      const match = window.location.pathname.match(/\/work\/([^/]+)\.html$/);
      return match ? { projectId: match[1] } : window.location.pathname === "/systems.html" ? { projectId: "systems" } : {};
    }
    const projectNames = {"performance-monitoring":"M365",sbi:"SBI",armada:"Armada",iqvia:"IQVIA","zone-focus":"Flotrak",systems:"Systems",oslo:"Oslo",eda:"Eda",m365:"M365",ground:"Systems"};
    function greetingText() {
      return window.UX_OSLO.introduction(currentContext().projectId);
    }
    if (!resumeConversation) {
      const greeting = log.querySelector(".chat-turn-agent .chat-turn-body");
      if (greeting) greeting.textContent = greetingText();
    }
    const pageContextLabel = document.createElement("p");
    pageContextLabel.className = "guide-conversation-context";
    const contextSwitch = document.createElement("button");
    contextSwitch.type = "button";
    contextSwitch.className = "accent-link guide-context-switch";
    panel.querySelector("header > div").appendChild(pageContextLabel);
    panel.querySelector("header > div").appendChild(contextSwitch);
    function updateContextIndicator() {
      const page = currentContext().projectId;
      const active = conversationContext && (conversationContext.projectId || conversationContext.walkId);
      const viewing = page ? (projectNames[page] || "this case study") : "Portfolio";
      const differs = Boolean(conversationContext && (active || "portfolio") !== (page || "portfolio"));
      pageContextLabel.textContent = "Viewing: " + viewing + (differs ? " · Conversation: " + (projectNames[active] || "Portfolio") : "");
      contextSwitch.hidden = !differs;
      contextSwitch.textContent = "Ask about " + viewing + " →";
    }
    contextSwitch.addEventListener("click", function () {
      conversationContext = currentContext();
      window.UX_OSLO.reset(conversationContext);
      log.replaceChildren();
      appendMessage("agent", greetingText());
      setPageSuggestions();
      updateContextIndicator();
      if (session) session.checkpoint();
      input.focus();
    });
    updateContextIndicator();
    function snapshot() {
      const context = conversationContext || currentContext();
      return { context, turns: session.capture(log), suggestions: session.captureSuggestions(panel, ".js-quick-inquiry"), history: window.UX_OSLO.history(context), draft: input.value, scrollTop: log.scrollTop };
    }

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
        updateContextIndicator();
        if (session) session.activate("oslo", snapshot);
        window.requestAnimationFrame(function () {
          input.focus();
        });
      } else {
        if (session) session.clear("oslo");
        if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
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
      if (!conversationContext) conversationContext = currentContext();
      await window.UX_OSLO.answer(message, body, conversationContext);
      hideAgentLoader(body);
    }

    async function sendUserMessage(message) {
      appendMessage("user", message);
      input.value = "";
      setBusy(true);

      const agentBody = appendMessage("agent", "");

      try {
        await streamAgentReply(message, agentBody);
        if (session) {
          const context = conversationContext || currentContext();
          const topics = {
            systems: ["How would you know the design system is working?", "How should a team review a token change?", "What would you prioritize on the first surface?"],
            ground: ["How would you know the design system is working?", "How should a team review a token change?", "What would you prioritize on the first surface?"],
            "performance-monitoring": ["How did admin research shape the incident cards?", "How did the charts connect duration and impact?", "What did prototype reviews help the team assess?"],
            m365: ["How did admin research shape the incident cards?", "How did the charts connect duration and impact?", "What did prototype reviews help the team assess?"],
            sbi: ["How could operating conditions explain replacement demand?", "How did filter combinations explain forecasting scenarios?", "What should an executive understand before buying stock?"],
            armada: ["How did the route tracer help operators track a flight?", "How were incidents connected to their map locations?", "Why keep the camera and mission status together?"],
            "zone-focus": ["How does Coach help a student learn manual exposure?", "How do the wedge and metering points support learning?", "Which hardware capabilities still need verification?"],
            oslo: ["How does Oslo connect an answer to supporting evidence?", "How should the Walk preserve a conversation?", "What happens when a question lacks supporting evidence?"],
            eda: ["What can Eda establish from a screenshot?", "Which accessibility checks need the working product?", "How does the visitor control the pace of a walk?"],
            iqvia: ["How did role-specific views organize the work?", "How did annotations stay connected to their content?", "What would you test in the multi-step forms?"]
          };
          const pool = topics[context.projectId || context.walkId] || ["How does the AI support decisions across these projects?", "How do Oslo and Eda serve different needs?", "Which project best shows the data visualization work?"];
          session.advanceSuggestions(panel, message, pool, window.UX_OSLO.history(context), ".js-quick-inquiry");
        }
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

    if (continuation && continuation.guide === "oslo") {
      if (resumeConversation) {
        window.UX_OSLO.resume(conversationContext, continuation.history);
        session.restore(log, continuation.turns, appendMessage, window.UX_OSLO.render);
      }
      input.value = typeof continuation.draft === "string" ? continuation.draft.slice(0, 4000) : "";
      if (continuation.open === false) session.activate("oslo", snapshot, false);
      else setOpen(true);
      window.requestAnimationFrame(function () { log.scrollTop = resumeConversation ? continuation.scrollTop || 0 : 0; });
    }
    input.addEventListener("input", function () { if (isOpen && session) session.checkpoint(); });
    log.addEventListener("scroll", function () { if (isOpen && session) session.checkpoint(); }, { passive: true });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const message = input.value.trim();
      if (!message) return;
      await sendUserMessage(message);
    });

    function setPageSuggestions() {
      const questions = currentContext().projectId === "zone-focus"
        ? ["How does Coach connect a photography question to a control?", "How do the wedge and metering points support learning?", "Which Flotrak features are prototypes or explorations?"]
        : currentContext().projectId ? ["Which design decision matters most here, and what evidence supports it?", "What tradeoff does this design make, and when might another approach work better?", "What outcomes were measured, and what is still undocumented?"]
        : ["Which project best shows the data visualization work?", "How do Oslo and Eda serve different needs?", "How does the AI support decisions across these projects?"];
      panel.querySelectorAll(".js-quick-inquiry").forEach(function (button, index) {
        (button.querySelector(".js-inquiry-label") || button).textContent = questions[index % questions.length];
      });
    }
    setPageSuggestions();
    if (resumeConversation) session.restoreSuggestions(panel, continuation.suggestions, ".js-quick-inquiry");
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

  function initGlassChrome() {
    const column = document.getElementById("site-column");
    if (!column) return;
    const header = column.querySelector(":scope > header");
    const footer = column.querySelector(":scope > footer");
    if (!header) return;
    function measure() {
      column.style.setProperty("--site-header-height", header.getBoundingClientRect().height + "px");
      column.style.setProperty("--site-footer-height", (footer ? footer.getBoundingClientRect().height : 0) + "px");
    }
    measure();
    column.classList.add("has-glass-chrome");
    measure();
    if (window.ResizeObserver) {
      const observer = new ResizeObserver(measure);
      observer.observe(header);
      if (footer) observer.observe(footer);
    } else window.addEventListener("resize", measure);
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
        scroller.scrollTop -
        (parseFloat(getComputedStyle(column).getPropertyValue("--site-header-height")) || 0) - 16;
      scroller.scrollTo({ top: Math.max(0, top), behavior: behavior });
      pinWindow();
    }

    document.addEventListener("click", function (event) {
      if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest("a[href]");
      if (!link || link.target === "_blank") return;
      const href = link.getAttribute("href");
      if (!href || href.indexOf("#") === -1) return;

      let url;
      try {
        url = new URL(link.href, window.location.href);
      } catch (error) {
        return;
      }
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;

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
      link.setAttribute("href", "mailto:" + address);
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
        path.removeAttribute("stroke");
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
          path.removeAttribute("stroke");
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
      path.removeAttribute("stroke");
    });

    window.setTimeout(loop, 1600 + Math.random() * 1200);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initMobileNav();
    initAgentPanel();
    initGlassChrome();
    initSiteColumnScroll();
    initContactMail();
    initHeroOrbitPulse();
  });
})();
