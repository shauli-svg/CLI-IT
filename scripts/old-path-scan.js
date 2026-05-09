const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const bannedPatterns = [
  /C:\\Users\\Lior\\Desktop\\תוסף/,
  /C:\\Users\\Lior\\Desktop\\main-NOTEBOOKE_LM_CLI_ADDON/,
  /visible-live-run-\d+/,
  /\.tmp\\local-bridge/i
];

const skipDirs = new Set([".git", "node_modules", "runs"]);
const findings = [];

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(full);
    } else {
      const rel = path.relative(root, full);
      if (/\.(png|jpg|jpeg|gif|zip|pdf)$/i.test(ent.name)) continue;
      const text = fs.readFileSync(full, "utf8");
      for (const pattern of bannedPatterns) {
        if (pattern.test(text)) findings.push({ file: rel, pattern: String(pattern) });
      }
    }
  }
}

walk(root);

if (findings.length) {
  console.error("FAIL old-path-scan");
  console.error(JSON.stringify(findings, null, 2));
  process.exit(1);
}

console.log("PASS old-path-scan");
