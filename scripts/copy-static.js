"use strict";

const fs = require("fs");
const path = require("path");

const buildKnowledge = require("./build-oslo-knowledge");
fs.writeFileSync(path.join(__dirname, "../knowledge/projects.json"), JSON.stringify(buildKnowledge(), null, 2) + "\n");

const root = path.join(__dirname, "..");
const dest = path.join(root, "public");
const items = ["index.html", "about.html", "eda.html", "systems.html", "walk.html", "css", "js", "images", "work"];

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest);

for (const item of items) {
  fs.cpSync(path.join(root, item), path.join(dest, item), { recursive: true });
}
