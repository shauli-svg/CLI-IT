const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const docsDir = path.join(root, "docs");
const files = [
  path.join(root, "README.md"),
  ...fs.readdirSync(docsDir)
    .filter(name => name.endsWith(".md"))
    .sort()
    .map(name => path.join(docsDir, name))
];

const findings = [];

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (/[^\x00-\x7F]/.test(line)) {
      findings.push({
        file: path.relative(root, file),
        line: index + 1,
        text: line
      });
    }
  });
}

if (findings.length) {
  console.error("FAIL terminal-docs-audit");
  console.error(JSON.stringify(findings, null, 2));
  process.exit(1);
}

console.log("PASS terminal-docs-audit");
