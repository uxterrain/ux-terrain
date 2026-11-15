(function () {
  "use strict";
  const root = document.querySelector(".flotrak-learning");
  if (!root) return;
  const scenes = {
    ask: ["01 / A question with somewhere to go", "Give the explanation a visible reference.", "The student asks about aperture. Coach connects its explanation to the focus wedge and suggests moving one control, rather than changing several settings at once. The lesson gives the learner something specific to look for.", "“What should I watch when I change aperture?”", "Teach toward an action, not just a definition.", "COACH / EXPLANATION", "current-coach.png", "Prototype Coach reply about aperture directs the student to move one control and watch the focus wedge", "Working prototype · Coach response and aperture lesson entry. Select to inspect the full screen."],
    adjust: ["02 / Put the choice in the learner's hands", "Bring the lesson to the dial.", "The aperture control appears with its teaching callout over the viewfinder. The explanation points to the bright line on the wedge, while the dial gives the student a concrete adjustment to make. Guidance stays beside the action.", "“Which control do I move, and what am I looking for?”", "Keep the explanation and the relevant control together.", "APERTURE / CONTROL", "current-controls.png", "Prototype aperture dial at f/2.8 with teaching guidance explaining the focus-wedge lines", "Working prototype · Aperture dial and contextual teaching callout. This captured screen is not a live dial."],
    observe: ["03 / A reference for what to notice", "Let the viewfinder carry the feedback.", "The wedge gives focus information a spatial reference, with labeled A and B points available for the photographer's metering choices. The full screen also keeps the focus distance and indicated sharp range visible. The student can relate the guidance back to the tool.", "“Where do I look to understand the setting?”", "Make the relationship visible without making the choice for the student.", "VIEWFINDER / SPATIAL REFERENCE", "current-viewfinder.png", "Prototype viewfinder close-up with focus wedge, horizontal reference lines, and labeled metering points A and B", "Working prototype · Wedge and A/B points. These captures illustrate the interface, not a before-and-after aperture experiment."]
  };
  root.querySelectorAll("[data-learning]").forEach(function (button) {
    button.addEventListener("click", function () {
      const key = button.dataset.learning;
      const scene = scenes[key];
      root.querySelectorAll("[data-learning]").forEach(function (item) { item.setAttribute("aria-pressed", String(item === button)); });
      ["kicker", "heading", "copy", "question", "principle", "label"].forEach(function (field, i) { root.querySelector("[data-learning-" + field + "]").textContent = scene[i]; });
      const image = root.querySelector("[data-learning-image]");
      image.src = "../images/work/zone/" + scene[6];
      image.alt = scene[7];
      root.querySelector("[data-learning-link]").href = image.getAttribute("src");
      root.querySelector("[data-learning-caption]").textContent = scene[8];
      const crop = root.querySelector("[data-learning-crop]");
      crop.dataset.learningCrop = key;
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && crop.animate) {
        crop.animate([{opacity: .3, transform: "translateY(6px)"}, {opacity: 1, transform: "translateY(0)"}], {duration: 220, easing: "ease-out"});
      }
    });
  });
})();
