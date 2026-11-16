"use strict";
// Owner-only command. There is deliberately no public endpoint for reading questions.
require("dotenv").config();
const { list, get } = require("@vercel/blob");
const { summarize } = require("../lib/guide-questions");
async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) throw new Error("Load this project's private Blob credentials before reviewing questions.");
  const records = []; let cursor;
  do {
    const page = await list({ prefix: "guide-questions/", limit: 100, cursor });
    for (const blob of page.blobs) {
      const result = await get(blob.pathname, { access: "private" });
      if (result && result.statusCode === 200) {
        const record = await new Response(result.stream).json();
        if (record.version === 1 && typeof record.question === "string") records.push(record);
      }
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  console.log(JSON.stringify({ total: records.length, groups: summarize(records) }, null, 2));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
