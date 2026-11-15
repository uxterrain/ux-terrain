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

(function () {
  "use strict";
  const root = document.querySelector(".flotrak-photo-story");
  if (!root) return;
  const scenes = {
    light: ["“I want the clouds to feel luminous, without losing their texture.”", "The sky is a large, bright part of the frame. Start with what matters about that light: its softness, its texture, and its relationship to the darker landscape.", "Give the exposure question a place in the scene.", "Coach can introduce the exposure reference and the role of point A. The photographer chooses the tone to expose for, then returns to the viewfinder to make that choice.", "Explore the A/B viewfinder →", "#oslo-evidence-3", "58%", "23%", "01 / LIGHT"],
    shadow: ["“I like the dark trees. How much detail do I want to keep?”", "The foreground and forested slopes give the image its darker weight. The question is about the photograph's mood as well as the information in those shadows.", "Make the shadow a deliberate comparison.", "Point B gives the photographer a shadow reference to compare with point A. Coach can explain the two points, while the student decides which shadow matters and what they want to retain.", "Explore the A/B viewfinder →", "#oslo-evidence-3", "77%", "75%", "02 / SHADOW"],
    depth: ["“I want the foreground trees and distant mountains to belong to the same picture.”", "The near trees, open water, and receding slopes create layers. Before choosing a setting, ask where the viewer's attention should settle and how the layers should relate.", "Connect the intention to focus and aperture.", "Coach's aperture lesson leads back to the control and the focus wedge. The indicated range gives the learner something to inspect while exploring how a setting relates to the photograph they want to make.", "Revisit the aperture learning loop →", "#flotrak-learning-title", "44%", "59%", "03 / DEPTH"]
  };
  root.querySelectorAll("[data-photo]").forEach(function (button) {
    button.addEventListener("click", function () {
      const scene = scenes[button.dataset.photo];
      root.querySelectorAll("[data-photo]").forEach(function (item) { item.setAttribute("aria-pressed", String(item === button)); });
      ["question", "notice", "heading", "bridge"].forEach(function (field, i) { root.querySelector("[data-photo-" + field + "]").textContent = scene[i]; });
      const link = root.querySelector("[data-photo-link]"); link.textContent = scene[4]; link.href = scene[5];
      const marker = root.querySelector("[data-photo-marker]"); marker.style.left = scene[6]; marker.style.top = scene[7];
      root.querySelector("[data-photo-marker-label]").textContent = scene[8];
    });
  });
})();
