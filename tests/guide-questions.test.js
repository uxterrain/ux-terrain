"use strict";
const assert = require("node:assert/strict");
const { issueReviewToken, normalizeSubmission, saveQuestion, summarize } = require("../lib/guide-questions");
async function run() {
  const options = { secret: "test-signing-key-only", now: 1794700000000 };
  const token = issueReviewToken({ guide: "oslo", projectId: "sbi", page: "/work/sbi.html", reason: "knowledge-gap" }, options);
  const body = { token, question: "Was a design system used?", consent: true, email: "ignored@example.test", history: ["Not collected"], projectId: "forged" };
  const record = normalizeSubmission(body, options);
  assert.equal(record.projectId, "sbi"); assert.equal(record.email, undefined); assert.equal(record.history, undefined);
  assert.throws(() => normalizeSubmission({ ...body, consent: false }, options), /Choose/);
  assert.throws(() => normalizeSubmission({ ...body, token: token + "tampered" }, options));
  assert.throws(() => normalizeSubmission(body, { ...options, now: options.now + 86400001 }), /expired/);
  assert.throws(() => normalizeSubmission({ ...body, question: "x".repeat(601) }, options), /600/);
  let stored;
  await saveQuestion(record, async (pathname, data, config) => { stored = { pathname, record: JSON.parse(data), config }; });
  assert.equal(stored.config.access, "private"); assert.equal(stored.config.allowOverwrite, false);
  assert.deepEqual(stored.record, record);
  const groups = summarize([record, { ...record, guide: "eda", question: "Was a design system used!" }, { ...record, question: "Who did the research?" }]);
  assert.equal(groups[0].topic, "Design systems"); assert.equal(groups[0].count, 2); assert.equal(groups[0].questions[0].count, 2);
  assert.equal(groups[1].topic, "Research & testing");
  console.log("PASS question review: explicit consent, signed expiring context, no transcript/contact capture, private idempotent writes, and recurring-topic grouping.");
}
run().catch(error => { console.error(error); process.exitCode = 1; });
