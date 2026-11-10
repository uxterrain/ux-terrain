(function () {
  "use strict";
  const main = document.getElementById("walk-main");
  if (!main) return;
  const pages = /^\/(?:systems|work\/(?:armada|iqvia|oslo|performance-monitoring|sbi|zone-focus|eda))\.html$/;
  let original = null;
  let scroll = 0;
  let request = null;
  function close(restore) {
    if (request) request.abort();
    request = null;
    if (restore && original) {
      main.replaceChildren(original);
      main.scrollTop = scroll;
    }
    original = null;
  }
  window.UX_WALK_EVIDENCE = { clear: function () { close(false); } };
  function copy(node, base) {
    if (node.nodeType === 3) return document.createTextNode(node.textContent);
    if (node.nodeType !== 1 || /^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|FORM|INPUT|BUTTON|LINK|META)$/.test(node.tagName)) return document.createDocumentFragment();
    const clone = node.namespaceURI === "http://www.w3.org/2000/svg"
      ? document.createElementNS(node.namespaceURI, node.localName) : document.createElement(node.localName);
    Array.from(node.attributes).forEach(function (attr) {
      if (/^on/i.test(attr.name) || /^(id|style|srcdoc|target)$/i.test(attr.name)) return;
      if (/^(href|src|xlink:href)$/i.test(attr.name)) {
        const url = new URL(attr.value, base);
        if (attr.name === "href" && node.tagName === "A" && url.href === "mailto:uxterrain@gmail.com") {
          clone.setAttribute("href", url.href);
          return;
        }
        if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
        clone.setAttribute(attr.name, url.href);
      } else if (/^(class|alt|title|role|aria-[\w-]+|viewBox|width|height|d|x\d?|y\d?|cx|cy|r|rx|ry|fill|stroke[\w-]*|points|transform|text-anchor)$/i.test(attr.name)) clone.setAttribute(attr.name, attr.value);
    });
    node.childNodes.forEach(function (child) { clone.append(copy(child, base)); });
    return clone;
  }
  async function open(url) {
    if (request) request.abort();
    const controller = new AbortController();
    request = controller;
    if (!original) {
      scroll = main.scrollTop;
      original = document.createDocumentFragment();
      while (main.firstChild) original.append(main.firstChild);
    }
    const view = document.createElement("section");
    view.className = "walk-evidence-view";
    const back = document.createElement("button");
    back.className = "walk-evidence-back";
    back.textContent = "← Back to this station";
    back.onclick = function () { close(true); inputFocus(); };
    const content = document.createElement("div");
    content.setAttribute("aria-live", "polite");
    content.textContent = "Loading supporting detail…";
    view.append(back, content);
    main.replaceChildren(view);
    main.scrollTop = 0;
    try {
      const response = await fetch(url.pathname, { signal: controller.signal });
      if (!response.ok) throw new Error("Unavailable");
      const doc = new DOMParser().parseFromString(await response.text(), "text/html");
      const heading = doc.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!heading) throw new Error("Missing section");
      const section = heading.closest("section") || heading.parentElement;
      if (request !== controller) return;
      content.replaceChildren(copy(section, url.href));
      back.focus({ preventScroll: true });
    } catch (error) {
      if (error.name !== "AbortError" && request === controller) content.textContent = "This supporting detail couldn’t load. Return to the station and try again.";
    }
  }
  function inputFocus() { document.getElementById("walk-input").focus({ preventScroll: true }); }
  document.addEventListener("click", function (event) {
    if (event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest(".walk-rail a[href], .walk-evidence-view a[href]");
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !pages.test(url.pathname) || !url.hash) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    open(url);
  }, true);
})();
