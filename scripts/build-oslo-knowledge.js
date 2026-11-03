"use strict";
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..");
function plain(html) {
  const entities = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—", hellip: "…", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", middot: "·", times: "×", rarr: "→", larr: "←" };
  return html.replace(/<(script|style)\b[\s\S]*?<\/\1>/g, "").replace(/<[^>]+>/g, " ")
    .replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (all, value) => {
      if (value.startsWith("#")) return String.fromCodePoint(value[1] === "x" ? parseInt(value.slice(2), 16) : Number(value.slice(1)));
      return entities[value] || all;
    }).replace(/\s+/g, " ").trim();
}
function build() {
  const result = {};
  const files = fs.readdirSync(path.join(root, "work")).filter(file => file.endsWith(".html")).map(file => "work/" + file).concat("systems.html");
  for (const file of files) {
    const html = fs.readFileSync(path.join(root, file), "utf8");
    const main = html.match(/<main\b[\s\S]*?<\/main>/)[0];
    const title = plain(main.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)[1]);
    const headings = [...main.matchAll(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/g)];
    const id = path.basename(file, ".html");
    const evidence = headings.flatMap((heading, index) => {
      const anchor = heading[1].match(/\bid="([^"]+)"/);
      if (!anchor) throw new Error("Add a stable evidence ID to " + file + ": " + plain(heading[2]));
      const text = plain(main.slice(heading.index + heading[0].length, headings[index + 1]?.index || main.length));
      return text ? [{ id: id + ":" + (anchor[1].startsWith("oslo-evidence-") ? anchor[1].slice("oslo-evidence-".length) : anchor[1]), title: plain(heading[2]), text, url: "/" + file + "#" + anchor[1] }] : [];
    });
    result[id] = { title, path: "/" + file, evidence };
  }
  return result;
}
if (require.main === module) fs.writeFileSync(path.join(root, "knowledge/projects.json"), JSON.stringify(build(), null, 2) + "\n");
module.exports = build;
