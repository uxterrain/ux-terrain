"use strict";
const crypto = require("node:crypto");
const { put } = require("@vercel/blob");
const MAX_QUESTION = 600;
const TTL = 24 * 60 * 60 * 1000;
function sign(payload, secret) { return crypto.createHmac("sha256", secret).update(payload).digest("base64url"); }
function issueReviewToken(context, options = {}) {
  const secret = options.secret || process.env.GUIDE_QUESTION_SECRET;
  if (!secret || !options.secret && !process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) return null;
  const payload = Buffer.from(JSON.stringify({ ...context, id: crypto.randomUUID(), issuedAt: options.now || Date.now() })).toString("base64url");
  return payload + "." + sign(payload, secret);
}
function verifyReviewToken(token, options = {}) {
  const secret = options.secret || process.env.GUIDE_QUESTION_SECRET;
  if (!secret || typeof token !== "string" || token.length > 3000) throw new Error("Please ask the guide again before sharing this question.");
  const [payload, signature, extra] = token.split(".");
  const expected = sign(payload || "", secret);
  if (extra || !signature || signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw new Error("This review link is not valid. Please ask the guide again.");
  const data = JSON.parse(Buffer.from(payload, "base64url").toString());
  const age = (options.now || Date.now()) - data.issuedAt;
  if (!Number.isFinite(age) || age < 0 || age > TTL || !["oslo", "eda"].includes(data.guide) || !/^[a-f0-9-]{36}$/.test(data.id)) throw new Error("This review link has expired. Please ask the guide again.");
  return data;
}
function normalizeSubmission(body, options) {
  if (!body || body.consent !== true) throw new Error("Choose to share your question before submitting it.");
  const verified = verifyReviewToken(body.token, options);
  const question = typeof body.question === "string" ? body.question.trim().replace(/[\u0000-\u001f\u007f]/g, " ") : "";
  if (!question || question.length > MAX_QUESTION) throw new Error("Please keep the question between 1 and 600 characters.");
  return { version: 1, id: verified.id, guide: verified.guide, projectId: verified.projectId, page: verified.page, station: verified.station || null, reason: verified.reason, question, submittedAt: new Date(options && options.now || Date.now()).toISOString() };
}
async function saveQuestion(record, writer = put) {
  try {
    await writer("guide-questions/" + record.id + ".json", JSON.stringify(record), { access: "private", contentType: "application/json", addRandomSuffix: false, allowOverwrite: false });
  } catch (error) {
    // Retrying the same consented submission is idempotent.
    if (!error || error.name !== "BlobPathnameMismatchError" && error.name !== "BlobAlreadyExistsError" && !/already exists/i.test(error.message || "")) throw error;
  }
}
function topicFor(question) {
  const topics = [["Design systems", /design[ -]+system|component|token|library/i], ["Research & testing", /research|interview|test|participant|usability/i], ["Accessibility", /accessib|wcag|keyboard|screen.reader|contrast/i], ["Outcomes", /outcome|result|metric|improv|impact|success/i], ["Collaboration & role", /team|collaborat|role|owned|contribut|handoff/i], ["Implementation", /implement|engineer|code|built|integrat/i]];
  return (topics.find(([, pattern]) => pattern.test(question)) || ["Other questions"])[0];
}
function summarize(records) {
  const groups = new Map();
  for (const record of records) {
    const key = record.projectId + ":" + topicFor(record.question);
    if (!groups.has(key)) groups.set(key, { projectId: record.projectId, topic: topicFor(record.question), count: 0, questions: new Map() });
    const group = groups.get(key); group.count++;
    const normalized = record.question.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
    const item = group.questions.get(normalized) || { question: record.question, count: 0, guides: new Set() }; item.count++; item.guides.add(record.guide); group.questions.set(normalized, item);
  }
  return [...groups.values()].sort((a, b) => b.count - a.count).map(group => ({ ...group, questions: [...group.questions.values()].map(item => ({ ...item, guides: [...item.guides] })) }));
}
module.exports = { issueReviewToken, verifyReviewToken, normalizeSubmission, saveQuestion, summarize };
