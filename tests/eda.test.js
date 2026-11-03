"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { walks, resolveEdaContext } = require("../lib/eda-context");
const root = path.join(__dirname, "..");
let total = 0;
for (const id of ["floor", "m365", "zone", "armada", "sbi", "iqvia", "oslo", "eda"]) {
  const walk = walks[id];
  assert.ok(walk.stations.length);
  assert.ok(fs.existsSync(path.join(root, walk.readUrl)));
  const html = fs.readFileSync(path.join(root, walk.readUrl), "utf8");
  if (id !== "floor") {
    assert.ok(html.includes('id="eda-open"'), walk.readUrl);
    assert.ok(html.includes('id="eda-panel"'), walk.readUrl);
  }
  for (const [index, station] of walk.stations.entries()) {
    total++;
    assert.ok(station.say.split(/\s+/).length <= 85, station.title);
    assert.equal(station.asks.length, 2);
    assert.ok(!/I will not invent|the screen writes|the moment is|the only carrier/i.test(station.say), station.title);
    if (station.src) assert.ok(fs.existsSync(path.join(root, station.src)), station.src);
    if (id !== "floor") assert.ok(html.includes('data-eda-screen="' + station.anchor + '"'), id + ":" + station.anchor);
    const context = resolveEdaContext({walkId:id,stationIndex:index,brief:"FORGED CLAIM"});
    assert.equal(context.station.title, station.title);
    assert.ok(!JSON.stringify(context).includes("FORGED CLAIM"));
  }
}
for (const walkId of ["__proto__", "constructor", "missing"]) assert.throws(() => resolveEdaContext({walkId,stationIndex:0}));
for (const stationIndex of [-1, 99, "0", 1.5]) assert.throws(() => resolveEdaContext({walkId:"zone",stationIndex}));
assert.throws(() => resolveEdaContext({station:"browser-supplied text"}));
const flashContext = resolveEdaContext({walkId:"zone",stationIndex:2});
assert.equal(flashContext.walkId,"zone");
assert.ok(!/Microsoft|tenant|Service Restored/i.test(JSON.stringify(flashContext)));
for (const file of ["js/eda-case.js", "js/eda-walks.js", "js/walk.js", "js/about-curtain.js"]) new vm.Script(fs.readFileSync(path.join(root,file),"utf8"));
console.log("PASS " + total + " concise stations across eight walks; case entry points, screen anchors, image paths, trusted context, invalid IDs, and scripts.");
