const fs = require("fs");
const path = require("path");
const { runAction } = require("../src/runtime/action-runner");

const root = path.resolve(__dirname, "..");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function latestRun(actionId) {
  const runsDir = path.join(root, "runs");
  const dirs = fs.readdirSync(runsDir)
    .filter(x => x.includes(actionId))
    .map(x => path.join(runsDir, x))
    .sort();
  return dirs[dirs.length - 1];
}

const projectResult = runAction(root, "check-project", {
  target: path.join(root, "tests/fixtures/sample-project-good")
});
assert(projectResult.ok === true, "check-project should pass on sample project");
assert(fs.existsSync(path.join(projectResult.runDir, "report.md")), "check-project report missing");

const browserResult = runAction(root, "pull-browser-content", {
  input: path.join(root, "tests/fixtures/browser/notebooklm-sample.html")
});
assert(browserResult.ok === true, "pull-browser-content should pass");
assert(browserResult.validation.extracted_text_not_empty === true, "extracted text should not be empty");

const handoffResult = runAction(root, "create-handoff", { target: root });
assert(handoffResult.ok === true, "create-handoff should pass");
assert(fs.existsSync(path.join(handoffResult.runDir, "HANDOFF.md")), "handoff missing");

console.log("PASS smoke-run");
