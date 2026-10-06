"use strict";

require("dotenv").config();

const fs = require("fs/promises");
const path = require("path");
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const INSTRUCTIONS = {
  oslo: path.join(ROOT, "skills.md"),
  eda: path.join(ROOT, "eda.md"),
};
const MAX_MESSAGE_LENGTH = 4000;

const instructionText = { oslo: "", eda: "" };

const app = express();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json({ limit: "48kb" }));
app.use(express.static(ROOT));

function logOpenAIError(error) {
  console.error("OpenAI /api/chat error:");
  console.error(error);
  if (error && typeof error === "object") {
    console.error("OpenAI error details:", {
      name: error.name,
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
      param: error.param,
    });
    if (error.error) {
      console.error("OpenAI nested error payload:", error.error);
    }
    if (error.cause) {
      console.error("OpenAI error cause:", error.cause);
    }
  }
}

function statusFromOpenAIError(error) {
  const status = Number(error && error.status);
  if (status === 401 || status === 403) return 401;
  if (status === 429) return 429;
  if (status >= 400 && status < 600) return status;
  if (error && (error.code === "ENOTFOUND" || error.code === "ECONNRESET" || error.code === "ETIMEDOUT")) {
    return 504;
  }
  return 502;
}

function publicErrorMessage(error) {
  const message = error && error.message ? String(error.message) : "";
  const lower = message.toLowerCase();

  if (error && (error.status === 401 || error.status === 403 || lower.includes("incorrect api key") || lower.includes("invalid api key"))) {
    return "The OpenAI API key is invalid or unauthorized.";
  }
  if (error && (error.status === 429 || lower.includes("quota") || lower.includes("rate limit") || lower.includes("insufficient_quota"))) {
    return "OpenAI billing quota or rate limit was reached.";
  }
  if (error && (error.code === "ETIMEDOUT" || lower.includes("timeout"))) {
    return "The OpenAI request timed out.";
  }
  if (message) return message;
  return "The agent could not complete that request.";
}

function sendJsonError(res, status, error) {
  if (res.headersSent) {
    res.end();
    return;
  }
  res.status(status).json({ error: publicErrorMessage(error) });
}

app.post("/api/chat", async function (req, res) {
  try {
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    const context = req.body && req.body.context && typeof req.body.context === "object" ? req.body.context : null;

    if (!message) {
      res.status(400).json({ error: "A non-empty message string is required." });
      return;
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      res.status(400).json({ error: "Message is too long." });
      return;
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_actual_key_here") {
      res.status(503).json({
        error: "OPENAI_API_KEY is not configured. Add it to your .env file.",
      });
      return;
    }

    const agent = req.body && req.body.agent === "eda" ? "eda" : "oslo";
    const systemText = instructionText[agent];
    const agentName = agent === "eda" ? "Eda" : "Oslo";

    if (!systemText) {
      res.status(503).json({ error: "Agent knowledge file is not loaded." });
      return;
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    let stream;

    let userContent = message;
    if (context) {
      const walkTitle = typeof context.walk === "string" ? context.walk.slice(0, 120) : "";
      const stationTitle = typeof context.station === "string" ? context.station.slice(0, 160) : "";
      const brief = typeof context.brief === "string" ? context.brief.slice(0, 400) : "";
      userContent =
        "The visitor is on an " +
        agentName +
        "-led walk. Stay on this station. Reply in " +
        agentName +
        "'s voice, plain sentences, no markdown. Invite them to press Next when they are ready to move on.\nWalk: " +
        walkTitle +
        "\nStation: " +
        stationTitle +
        "\nStation claim: " +
        brief +
        "\nTheir question: " +
        message;
    }

    try {
      stream = await client.chat.completions.create({
        model: "gpt-4o-mini",
        stream: true,
        messages: [
          { role: "system", content: systemText },
          { role: "user", content: userContent },
        ],
      });
    } catch (error) {
      logOpenAIError(error);
      sendJsonError(res, statusFromOpenAIError(error), error);
      return;
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    if (typeof res.flushHeaders === "function") {
      res.flushHeaders();
    }

    try {
      let wroteTokens = false;

      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content;
        if (token) {
          wroteTokens = true;
          res.write(token);
        }
      }

      if (!wroteTokens) {
        console.error("OpenAI /api/chat error: stream completed without any text tokens.");
      }

      res.end();
    } catch (error) {
      logOpenAIError(error);
      if (!res.headersSent) {
        sendJsonError(res, statusFromOpenAIError(error), error);
        return;
      }
      res.end();
    }
  } catch (error) {
    logOpenAIError(error);
    sendJsonError(res, 500, error);
  }
});

async function start() {
  try {
    instructionText.oslo = await fs.readFile(INSTRUCTIONS.oslo, "utf8");
    instructionText.eda = await fs.readFile(INSTRUCTIONS.eda, "utf8");
  } catch (error) {
    console.error("Failed to read an agent instruction file:", error.message);
    process.exit(1);
  }

  app.listen(PORT, function () {
    console.log("UX Terrain agent listening on http://localhost:" + PORT);
  });
}

start();
