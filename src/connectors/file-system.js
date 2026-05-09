const fs = require("fs");
const path = require("path");

function detectProject(target) {
  const abs = path.resolve(target);
  if (!fs.existsSync(abs)) {
    return { exists: false, abs, files: [], packageJson: null, indicators: [] };
  }

  const names = fs.readdirSync(abs).sort();
  const indicators = [];
  const packagePath = path.join(abs, "package.json");
  let packageJson = null;

  if (fs.existsSync(packagePath)) {
    indicators.push("node-project");
    try {
      packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    } catch (err) {
      indicators.push("package-json-invalid");
    }
  }

  if (fs.existsSync(path.join(abs, ".git"))) indicators.push("git-repository");
  if (names.some(n => n.endsWith(".ps1"))) indicators.push("powershell-scripts");

  return {
    exists: true,
    abs,
    files: names,
    packageJson,
    indicators
  };
}

module.exports = { detectProject };
