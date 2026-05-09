const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const runsRoot = path.join(root, "runs");
fs.mkdirSync(runsRoot, { recursive: true });

function pad(n) { return String(n).padStart(2, "0"); }
function timestamp() {
  const d = new Date();
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

const runDir = path.join(runsRoot, `${timestamp()}-ci-local`);
fs.mkdirSync(runDir, { recursive: true });

const checks = [
  { name: "node-version", cmd: "node", args: ["--version"] },
  { name: "validate-actions", cmd: "node", args: ["scripts/validate-actions.js"] },
  { name: "old-path-scan", cmd: "node", args: ["scripts/old-path-scan.js"] },
  { name: "terminal-docs-audit", cmd: "node", args: ["scripts/terminal-docs-audit.js"] },
  { name: "smoke-run", cmd: "node", args: ["scripts/smoke-run.js"] },
  { name: "api-smoke", cmd: "node", args: ["scripts/api-smoke.js"] },
  { name: "ui-smoke", cmd: "node", args: ["scripts/ui-smoke.js"] },
  { name: "execution-flow-smoke", cmd: "node", args: ["scripts/execution-flow-smoke.js"] }
];

const results = [];
for (const check of checks) {
  const res = spawnSync(check.cmd, check.args, {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32"
  });
  fs.writeFileSync(path.join(runDir, `${check.name}.stdout.txt`), res.stdout || "", "utf8");
  fs.writeFileSync(path.join(runDir, `${check.name}.stderr.txt`), res.stderr || "", "utf8");
  results.push({
    name: check.name,
    ok: res.status === 0,
    exitCode: res.status,
    stdoutFile: `${check.name}.stdout.txt`,
    stderrFile: `${check.name}.stderr.txt`
  });
}

const ok = results.every(r => r.ok);
const result = {
  ok,
  action: "ci-local",
  runDir,
  checks: results,
  createdAt: new Date().toISOString()
};

fs.writeFileSync(path.join(runDir, "result.json"), JSON.stringify(result, null, 2) + "\n", "utf8");

const summary = `# CI Local Summary

Status: ${ok ? "PASS" : "FAIL"}

Run directory:

\`${runDir}\`

## Checks

${results.map(r => `- ${r.ok ? "PASS" : "FAIL"} ${r.name} (exit ${r.exitCode})`).join("\n")}

## Next

${ok ? "Baseline is stable. Continue with connector expansion." : "Open the failed check logs in this run directory and patch before adding features."}
`;

fs.writeFileSync(path.join(runDir, "CI_SUMMARY.md"), summary, "utf8");
console.log(summary);
process.exit(ok ? 0 : 1);




