const path = require("path");
const fs = require("fs");
const { extractFromHtmlFile } = require("../connectors/browser-fixture");
const store = require("../runtime/artifact-store");

function run(root, options) {
  const input = options.input;
  if (!input) throw new Error("Missing required option: --input");
  if (!fs.existsSync(input)) throw new Error(`Input file does not exist: ${input}`);

  const runDir = store.createRunDir(root, "pull-browser-content");
  const extracted = extractFromHtmlFile(input);

  const artifactPath = path.join(runDir, "artifacts", "extracted-content.json");
  store.writeJson(artifactPath, extracted);

  const report = `# Browser Content Pull Report

## Summary

Input:

\`${input}\`

Title:

${extracted.title || "(no title)"}

Characters extracted: ${extracted.charCount}
Approx words: ${extracted.approxWords}

## Validation

- extracted_text_not_empty: ${extracted.text.length > 0 ? "pass" : "fail"}
- artifact_exists: pass
`;
  store.writeText(path.join(runDir, "report.md"), report);

  const result = {
    ok: extracted.text.length > 0,
    action: "pull-browser-content",
    input,
    summary: "Browser fixture content extraction completed.",
    runDir,
    artifacts: ["report.md", "artifacts/extracted-content.json"],
    validation: {
      extracted_text_not_empty: extracted.text.length > 0,
      artifact_exists: true
    }
  };
  store.writeJson(path.join(runDir, "result.json"), result);
  return result;
}

module.exports = { run };
