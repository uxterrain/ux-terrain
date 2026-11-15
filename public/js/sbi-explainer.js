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

(function () {
  "use strict";
  const root = document.querySelector(".sbi-dashboard");
  if (!root) return;
  const detail = {
    kpi: ["01 / At-a-glance context", "A number needs a reference.", "The three KPI cards pair a value with a horizontal bar and a forecast marker. Weekly, monthly, and yearly controls establish a time frame. The exploration gives the summary a comparison cue instead of leaving each number isolated.", "Make the overview useful for orientation, then let the larger chart carry the explanation.", "Original wireframe close-up of KPI values, horizontal bars, forecast markers, and time controls"],
    forecast: ["02 / Operating pattern", "Keep the recorded pattern beside the simulation.", "The main panel gives rig count the largest visual area. A selected point exposes basin and size context, while the adjoining five-day simulation uses a dashed line and a separate background. The forecast can be examined beside the activity that frames it.", "Preserve the distinction between observed activity and a simulated continuation while keeping the time relationship visible.", "Original rig-count chart with point detail beside a dashed next-five-days simulation"],
    market: ["03 / External context", "Keep the wider market in peripheral view.", "The right rail groups Market Analysis and Commodity trend charts with operational measures and insight summaries. It creates a place to examine external and business signals alongside rig activity, without giving every signal equal visual weight.", "Support comparison and investigation; co-locating a market trend and a forecast does not establish that one causes the other.", "Original sidebar showing Market Analysis, Commodity trends, and operational metric values with percentage changes"],
    operations: ["04 / Supporting detail", "Give the overview somewhere to lead.", "Economy, Ordering, and Price tables sit beneath the main chart. Their columns explore the supporting detail: data and alert urgency, descriptions, and status. The structure connects the high-level forecasting view to operational questions that warrant closer review.", "Move from noticing a pattern to reviewing relevant business detail, rather than asking KPI cards to explain everything.", "Original wireframe tables labeled Economy, Ordering, and Price with placeholder rows and status columns"]
  };
  root.querySelectorAll("[data-dashboard]").forEach(function (button) {
    button.addEventListener("click", function () {
      const key = button.dataset.dashboard;
      root.querySelectorAll("[data-dashboard]").forEach(function (item) { item.setAttribute("aria-pressed", String(item === button)); });
      ["kicker", "heading", "copy", "intent"].forEach(function (field, i) { root.querySelector("[data-dashboard-" + field + "]").textContent = detail[key][i]; });
      root.querySelector("[data-dashboard-crop]").dataset.dashboardCrop = key;
      root.querySelector("[data-dashboard-image]").alt = detail[key][4];
    });
  });
})();
