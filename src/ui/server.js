const http = require("http");
const fs = require("fs");
const path = require("path");
const { loadActions } = require("../runtime/action-loader");
const { runAction, isImplemented } = require("../runtime/action-runner");
const { describePlan } = require("../runtime/action-preview");
const { listRecentRuns } = require("../runtime/artifact-store");

const root = path.resolve(__dirname, "../..");
const web = path.join(root, "web");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload, null, 2));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function summarizeRun(run) {
  const resultPath = path.join(run.path, "result.json");
  let result = null;
  if (fs.existsSync(resultPath)) {
    try {
      result = JSON.parse(fs.readFileSync(resultPath, "utf8"));
    } catch (err) {
      result = { ok: false, summary: "Invalid result.json" };
    }
  }
  return {
    name: run.name,
    mtimeMs: run.mtimeMs,
    action: result && result.action ? result.action : null,
    ok: result && typeof result.ok === "boolean" ? result.ok : null,
    summary: result && result.summary ? result.summary : null
  };
}

function safeDemoOptions(actionId) {
  if (actionId === "check-project") {
    return { target: path.join(root, "tests", "fixtures", "sample-project-good") };
  }
  if (actionId === "pull-browser-content") {
    return { input: path.join(root, "tests", "fixtures", "browser", "notebooklm-sample.html") };
  }
  if (actionId === "create-handoff") {
    return { target: root };
  }
  return {};
}

function createServer() {
  return http.createServer(async (req, res) => {
    try {
      if (req.method === "GET" && req.url === "/api/health") {
        return sendJson(res, 200, { ok: true, service: "cli-it-local-api" });
      }

      if (req.method === "GET" && req.url === "/api/actions") {
        const actions = loadActions(root).map(action => ({
          id: action.id,
          label: action.label,
          clientLabel: action.clientLabel,
          description: action.description,
          risk: action.risk,
          implemented: isImplemented(action.id)
        }));
        return sendJson(res, 200, { ok: true, actions });
      }

      if (req.method === "GET" && req.url === "/api/runs") {
        const runs = listRecentRuns(root, 10).map(summarizeRun);
        return sendJson(res, 200, { ok: true, runs });
      }

      if (req.method === "GET" && req.url.startsWith("/api/runs/")) {
        const parts = req.url.split("/").filter(Boolean);
        const runName = decodeURIComponent(parts[2] || "");
        const artifactMode = parts[3] === "artifacts";
        const safeRunName = path.basename(runName);
        const runDir = path.join(root, "runs", safeRunName);
        if (!safeRunName || !runDir.startsWith(path.join(root, "runs")) || !fs.existsSync(runDir)) {
          return sendJson(res, 404, { ok: false, error: "Run not found" });
        }

        if (artifactMode) {
          const artifactsDir = path.join(runDir, "artifacts");
          const artifacts = fs.existsSync(artifactsDir)
            ? fs.readdirSync(artifactsDir, { withFileTypes: true })
                .filter(ent => ent.isFile())
                .map(ent => {
                  const full = path.join(artifactsDir, ent.name);
                  const stat = fs.statSync(full);
                  return { name: ent.name, sizeBytes: stat.size };
                })
            : [];
          return sendJson(res, 200, { ok: true, runName: safeRunName, artifacts });
        }

        const files = ["result.json", "report.md", "CI_SUMMARY.md", "HANDOFF.md"]
          .filter(name => fs.existsSync(path.join(runDir, name)));
        let result = null;
        const resultPath = path.join(runDir, "result.json");
        if (fs.existsSync(resultPath)) {
          try { result = JSON.parse(fs.readFileSync(resultPath, "utf8")); }
          catch (err) { result = { ok: false, summary: "Invalid result.json" }; }
        }
        return sendJson(res, 200, {
          ok: true,
          run: {
            name: safeRunName,
            files,
            result
          }
        });
      }

      if (req.method === "POST" && req.url === "/api/preview") {
        const body = await readJsonBody(req);
        const actionId = body.actionId;
        if (!actionId) return sendJson(res, 400, { ok: false, error: "Missing actionId" });
        const preview = describePlan(root, actionId, body.options || {});
        return sendJson(res, 200, { ok: true, preview });
      }

      if (req.method === "POST" && req.url === "/api/run") {
        const body = await readJsonBody(req);
        const actionId = body.actionId;
        if (!actionId) return sendJson(res, 400, { ok: false, error: "Missing actionId" });
        const result = runAction(root, actionId, body.options || {});
        return sendJson(res, 200, { ok: true, result });
      }

      if (req.method === "POST" && req.url === "/api/demo-run") {
        const body = await readJsonBody(req);
        const actionId = body.actionId;
        if (!actionId) return sendJson(res, 400, { ok: false, error: "Missing actionId" });
        const result = runAction(root, actionId, safeDemoOptions(actionId));
        return sendJson(res, 200, { ok: true, result });
      }

      const url = req.url === "/" ? "/index.html" : req.url;
      const safe = path.normalize(url).replace(/^(\.\.[\/\\])+/, "");
      const file = path.join(web, safe);
      if (!file.startsWith(web) || !fs.existsSync(file)) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      res.writeHead(200, { "Content-Type": types[path.extname(file)] || "text/plain; charset=utf-8" });
      res.end(fs.readFileSync(file));
    } catch (err) {
      sendJson(res, 500, { ok: false, error: err.message });
    }
  });
}

function startServer(port = process.env.PORT || 4317) {
  const server = createServer();
  server.listen(port, "127.0.0.1", () => {
    console.log(`CLI-IT UI running at http://127.0.0.1:${port}`);
  });
  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = { createServer, startServer };


