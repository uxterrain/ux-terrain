(function () {
  "use strict";
  const canvas = document.getElementById("about-data-curtain");
  if (!canvas) return;
  const context = canvas.getContext("2d");
  if (!context) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const glyphs = "01{}[]<>/\\:+*UXAI=101001";
  let width = 0, height = 0, visible = true, frame = null;
  let wantsPlay = !reduced.matches, clock = 0, previous = null, lastDraw = 0;
  function draw(time) {
    context.clearRect(0, 0, width, height);
    const colors = getComputedStyle(document.documentElement);
    const blue = colors.getPropertyValue("--oslo").trim();
    const amber = colors.getPropertyValue("--color-accent").trim();
    const ink = colors.getPropertyValue("--color-text").trim();
    const size = Math.max(11, Math.min(16, width / 24));
    const columns = Math.max(1, Math.floor(width / (size * .95)));
    context.font = size + "px monospace";
    context.textAlign = "center";
    for (let column = 0; column < columns; column++) {
      const tail = 8 + column * 7 % 14;
      const speed = 18 + column * 13 % 30;
      const cycle = height + tail * size;
      const end = (time * speed + column * 79) % cycle;
      for (let row = 0; row < tail; row++) {
        const y = end - row * size;
        if (y < 0 || y > height) continue;
        context.globalAlpha = (1 - row / tail) * .85;
        context.fillStyle = row === 0 ? ink : column % 6 === 0 ? amber : blue;
        const index = (column * 11 + row * 7 + Math.floor(time * 3)) % glyphs.length;
        context.fillText(glyphs[index], (column + .5) * width / columns, y);
      }
    }
    context.globalAlpha = 1;
  }
  function active() { return wantsPlay && visible && !document.hidden; }
  function tick(now) {
    frame = null;
    if (!active()) { previous = null; return; }
    if (previous !== null) clock += Math.min(now - previous, 100) / 1000;
    previous = now;
    if (now - lastDraw >= 50) { draw(clock + 8); lastDraw = now; }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null; previous = null;
    draw(clock + 8);
    if (active()) frame = requestAnimationFrame(tick);
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width; height = rect.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    sync();
  }
  reduced.addEventListener("change", function () { if (reduced.matches) { wantsPlay = false; sync(); } });
  document.addEventListener("visibilitychange", sync);
  new ResizeObserver(resize).observe(canvas);
  if ("IntersectionObserver" in window) new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting; sync();
  }).observe(canvas);
  new MutationObserver(function () { draw(clock + 8); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  resize();
})();
