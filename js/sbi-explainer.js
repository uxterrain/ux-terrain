(function () {
  "use strict";
  const root = document.querySelector(".sbi-explainer");
  if (!root) return;
  const steps = Array.from(root.querySelectorAll("[data-sbi-step]"));
  const scenes = Array.from(root.querySelectorAll("[data-sbi-scene]"));
  const next = root.querySelector("[data-sbi-next]");
  let current = 0;
  function select(index) {
    current = index;
    steps.forEach(function (button, i) { button.setAttribute("aria-pressed", String(i === index)); });
    scenes.forEach(function (scene, i) { scene.hidden = i !== index; });
    root.querySelector("[data-sbi-position]").textContent = "0" + (index + 1) + " / 04";
    next.textContent = index === 3 ? "Back to equipment use ↺" : "Next: " + steps[index + 1].querySelector("strong").textContent.toLowerCase() + " →";
    const scene = scenes[index];
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && scene.animate) {
      scene.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 240, easing: "ease-out" });
    }
  }
  steps.forEach(function (button, i) { button.addEventListener("click", function () { select(i); }); });
  next.addEventListener("click", function () { select((current + 1) % steps.length); });
})();

(function () {
  "use strict";
  const root = document.querySelector(".sbi-geo");
  if (!root) return;
  const content = {
    network: ["Regional context", "Read the location as part of a system.", "Nearby points are not the whole story. Connections between fields, gathering infrastructure, offshore sites, and refineries add operating context beyond a single map marker.", "Where is activity concentrated, and how does that region relate to the wider operating network?"],
    land: ["Onshore field", "Move from the region to the operating site.", "Selecting a rig should retain the regional frame while bringing its environment, drilling activity, and operating history into focus. Those details help someone examine the conditions behind a demand forecast.", "Does the selected site's activity help explain the timing of potential replacement demand?"],
    offshore: ["Offshore context", "Keep the shore from becoming the edge of the story.", "Offshore drilling belongs in the same operating picture as onshore assets and connected infrastructure. The environment matters when comparing sites; a nearby coastal point is not a substitute for understanding the actual connection.", "Which offshore locations and operating conditions are included in the forecast being examined?"]
  };
  const fields = ["kicker", "heading", "copy", "question"];
  root.querySelectorAll("[data-geo]").forEach(function (button) {
    button.addEventListener("click", function () {
      const key = button.dataset.geo;
      root.querySelectorAll("[data-geo]").forEach(function (item) { item.setAttribute("aria-pressed", String(item === button)); });
      fields.forEach(function (field, i) { root.querySelector("[data-geo-" + field + "]").textContent = content[key][i]; });
      root.querySelectorAll("[data-geo-highlight]").forEach(function (group) {
        group.classList.toggle("is-dim", key !== "network" && group.dataset.geoHighlight !== key);
        group.classList.toggle("is-selected", group.dataset.geoHighlight === key);
      });
    });
  });
})();
