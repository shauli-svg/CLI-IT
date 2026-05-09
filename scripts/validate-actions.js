const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const actionsDir = path.join(root, "actions");

const required = ["id", "label", "clientLabel", "description", "risk", "inputs", "outputs", "permissions", "validation"];
const allowedRisk = new Set(["safe", "low", "medium", "high", "dangerous"]);

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
}

if (!fs.existsSync(actionsDir)) {
  fail("actions directory missing");
} else {
  const files = fs.readdirSync(actionsDir).filter(f => f.endsWith(".json"));
  if (files.length === 0) fail("no action contracts found");

  const ids = new Set();
  for (const file of files) {
    const full = path.join(actionsDir, file);
    let action;
    try {
      action = JSON.parse(fs.readFileSync(full, "utf8"));
    } catch (err) {
      fail(`${file}: invalid JSON`);
      continue;
    }

    for (const key of required) {
      if (!(key in action)) fail(`${file}: missing ${key}`);
    }

    if (ids.has(action.id)) fail(`${file}: duplicate action id ${action.id}`);
    ids.add(action.id);

    if (!allowedRisk.has(action.risk)) fail(`${file}: invalid risk ${action.risk}`);
    if (!Array.isArray(action.validation) || action.validation.length === 0) {
      fail(`${file}: validation must be non-empty`);
    }

    const permissions = action.permissions || {};
    for (const dangerous of ["deleteFiles", "gitPush", "network"]) {
      if (permissions[dangerous] === true && action.risk === "low") {
        fail(`${file}: ${dangerous}=true cannot be low risk`);
      }
    }
  }
}

if (!process.exitCode) {
  console.log("PASS validate-actions");
}
