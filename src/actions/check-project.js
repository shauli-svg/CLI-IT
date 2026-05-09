const path = require("path");
const { detectProject } = require("../connectors/file-system");
const store = require("../runtime/artifact-store");

function renderReport(project) {
  const scripts = project.packageJson && project.packageJson.scripts
    ? Object.keys(project.packageJson.scripts)
    : [];

  return `# Project Check Report

## Summary

Target exists: ${project.exists ? "yes" : "no"}

Absolute path:

\`${project.abs}\`

## Detected indicators

${project.indicators.length ? project.indicators.map(x => `- ${x}`).join("\n") : "- none"}

## Top-level files

${project.files.length ? project.files.map(x => `- ${x}`).join("\n") : "- none"}

## Package scripts

${scripts.length ? scripts.map(x => `- ${x}`).join("\n") : "- none"}

## Result

${project.exists ? "The project folder was readable and a baseline report was created." : "The target folder was not found."}
`;
}

function run(root, options) {
  const target = options.target;
  if (!target) throw new Error("Missing required option: --target");

  const runDir = store.createRunDir(root, "check-project");
  const project = detectProject(target);
  const report = renderReport(project);

  store.writeText(path.join(runDir, "report.md"), report);
  const result = {
    ok: project.exists,
    action: "check-project",
    target,
    summary: project.exists ? "Project check completed." : "Target folder not found.",
    runDir,
    artifacts: ["report.md"],
    validation: {
      target_exists: project.exists,
      report_exists: true,
      summary_exists: true
    }
  };
  store.writeJson(path.join(runDir, "result.json"), result);
  return result;
}

module.exports = { run };
