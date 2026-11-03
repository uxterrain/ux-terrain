"use strict";
const fs = require("node:fs");
const vm = require("node:vm");
const projects = require("../knowledge/projects.json");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(require.resolve("../js/eda-walks.js"), "utf8"), sandbox, { timeout: 1000 });
const walks = sandbox.window.EDA_WALKS;
const projectIds = { m365: "performance-monitoring", zone: "zone-focus", armada: "armada", sbi: "sbi", iqvia: "iqvia", oslo: "oslo", eda: "eda" };
function resolveEdaContext(input) {
  if (!input || input.walkId === undefined) throw new Error("Refresh the page so Eda can identify the current case study and screen.");
  if (typeof input.walkId !== "string" || !Object.hasOwn(walks, input.walkId) ||
      !Number.isInteger(input.stationIndex) || input.stationIndex < 0 || input.stationIndex >= walks[input.walkId].stations.length) {
    throw new Error("Unknown Eda station. Refresh the page and choose a station.");
  }
  const walk = walks[input.walkId];
  const station = walk.stations[input.stationIndex];
  const project = projects[projectIds[input.walkId]];
  return {
    walkId: input.walkId,
    walk: walk.title,
    station: { title: station.title, summary: station.lede, notes: station.say },
    caseEvidence: project ? project.evidence.map(({title,text}) => ({title,text})) : [],
    referenceSources: walk.sources || [],
  };
}
module.exports = { resolveEdaContext, walks };
