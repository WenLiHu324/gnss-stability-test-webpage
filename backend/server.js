import cors from "cors";
import express from "express";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.GNSS_DATA_DIR || path.join(__dirname, "data");
const PORT = Number(process.env.PORT || 8787);
const API_TOKEN = process.env.GNSS_BACKUP_TOKEN || "";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

function dateKey(value = new Date()) {
  return value.toISOString().slice(0, 10);
}

function safeSessionId(value) {
  return String(value || "unknown").replace(/[^a-zA-Z0-9_.-]/g, "_").slice(0, 120);
}

async function appendJsonLine(file, record) {
  await mkdir(path.dirname(file), { recursive: true });
  const previous = await readFile(file, "utf8").catch(() => "");
  await writeFile(file, previous + JSON.stringify(record) + "\n", "utf8");
}

function requireToken(req, res, next) {
  if (!API_TOKEN) return next();
  const token = req.get("x-gnss-token") || "";
  if (token !== API_TOKEN) {
    return res.status(401).json({ ok: false, error: "invalid token" });
  }
  return next();
}

app.get("/health", (req, res) => {
  res.json({ ok: true, dataDir: DATA_DIR });
});

app.post("/api/ingest", requireToken, async (req, res) => {
  const body = req.body || {};
  const kind = String(body.kind || "unknown");
  const session = body.session || {};
  const savedAt = body.savedAt || new Date().toISOString();
  const record = {
    kind,
    savedAt,
    session,
    payload: body.payload || null,
    client: {
      ip: req.ip,
      userAgent: req.get("user-agent") || ""
    }
  };
  const sessionId = safeSessionId(session.id);
  const dailyFile = path.join(DATA_DIR, `${dateKey(new Date(savedAt))}.jsonl`);
  const sessionFile = path.join(DATA_DIR, "sessions", `${sessionId}.jsonl`);
  await appendJsonLine(dailyFile, record);
  await appendJsonLine(sessionFile, record);
  res.json({ ok: true, kind, sessionId });
});

app.get("/api/sessions", requireToken, async (req, res) => {
  const dir = path.join(DATA_DIR, "sessions");
  const files = await readdir(dir).catch(() => []);
  res.json({
    ok: true,
    sessions: files
      .filter((name) => name.endsWith(".jsonl"))
      .map((name) => name.replace(/\.jsonl$/, ""))
  });
});

app.get("/api/export/:sessionId", requireToken, async (req, res) => {
  const sessionId = safeSessionId(req.params.sessionId);
  const file = path.join(DATA_DIR, "sessions", `${sessionId}.jsonl`);
  const content = await readFile(file, "utf8").catch(() => null);
  if (content == null) {
    return res.status(404).json({ ok: false, error: "session not found" });
  }
  res.type("application/x-ndjson").send(content);
});

app.listen(PORT, () => {
  console.log(`GNSS backup server listening on http://127.0.0.1:${PORT}`);
  console.log(`Data directory: ${DATA_DIR}`);
});
