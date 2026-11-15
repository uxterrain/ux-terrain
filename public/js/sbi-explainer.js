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
