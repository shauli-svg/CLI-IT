const fs = require("fs");
const path = require("path");

function pad(n) {
  return String(n).padStart(2, "0");
}

function timestamp() {
  const d = new Date();
  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate())
  ].join("") + "-" + [
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())
  ].join("");
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function createRunDir(root, actionId) {
  const safeAction = String(actionId || "run").replace(/[^a-zA-Z0-9_.-]/g, "-");
  const runDir = path.join(root, "runs", `${timestamp()}-${safeAction}`);
  ensureDir(runDir);
  ensureDir(path.join(runDir, "artifacts"));
  return runDir;
}

function writeJson(filePath, obj) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

function writeText(filePath, text) {
  fs.writeFileSync(filePath, String(text), "utf8");
}

function listRecentRuns(root, limit = 10) {
  const runsDir = path.join(root, "runs");
  if (!fs.existsSync(runsDir)) return [];
  return fs.readdirSync(runsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => {
      const full = path.join(runsDir, d.name);
      const stat = fs.statSync(full);
      return { name: d.name, path: full, mtimeMs: stat.mtimeMs };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs)
    .slice(0, limit);
}

module.exports = {
  createRunDir,
  ensureDir,
  writeJson,
  writeText,
  listRecentRuns
};
