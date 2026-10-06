"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const dest = path.join(root, "public");
const items = ["index.html", "about.html", "eda.html", "systems.html", "walk.html", "css", "js", "images", "work"];

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest);

for (const item of items) {
  fs.cpSync(path.join(root, item), path.join(dest, item), { recursive: true });
}
