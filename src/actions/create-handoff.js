const path = require("path");
const fs = require("fs");
const store = require("../runtime/artifact-store");

function run(root, options) {
  const target = options.target || ".";
  const runDir = store.createRunDir(root, "create-handoff");
  const recent = store.listRecentRuns(root, 8);

  const doc = `# HANDOFF — CLI-IT Local Action Runtime

## 1. Product line

CLI-IT is a local-first action runtime that converts intent into validated work.

Core loop:

\`\`\`text
Intent -> Action -> Evidence -> Validation -> Memory
\`\`\`

## 2. Past

- Product SPEC was translated into a runnable MVP skeleton.
- Action registry was created under \`actions/\`.
- Recipe registry was created under \`recipes/\`.
- Local CI scripts were created under \`scripts/\`.
- Runtime modules were created under \`src/\`.
- Smoke fixtures were created under \`tests/fixtures/\`.
- Static UI prototype was created under \`web/\`.

## 3. Present

Target:

\`${target}\`

Recent local runs:

${recent.length ? recent.map(r => `- ${r.name}`).join("\n") : "- no prior runs"}

Current MVP supports:

- project folder check
- saved HTML content extraction
- handoff generation
- local CI validation
- simple local UI prototype

## 4. Next

Recommended next work:

1. Add real browser connector.
2. Add Native Messaging Host.
3. Add richer project audit.
4. Add adapter builder.
5. Add Git/GitHub safe-push workflow only after CI is stable.
6. Add persistent recipe memory.
7. Harden Windows path handling.

## 5. Known boundaries

This handoff was generated without live access to the user's Windows machine, Chrome session, credentials, or external Git workflow.
`;

  const handoffPath = path.join(runDir, "HANDOFF.md");
  store.writeText(handoffPath, doc);
  store.writeText(path.join(runDir, "report.md"), doc);

  const result = {
    ok: true,
    action: "create-handoff",
    target,
    summary: "Handoff created.",
    runDir,
    artifacts: ["HANDOFF.md", "report.md"],
    validation: {
      handoff_exists: fs.existsSync(handoffPath),
      contains_past_present_next: /## 2\. Past[\s\S]*## 3\. Present[\s\S]*## 4\. Next/.test(doc)
    }
  };
  store.writeJson(path.join(runDir, "result.json"), result);
  return result;
}

module.exports = { run };
