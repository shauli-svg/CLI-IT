const fs = require("fs");

function exists(filePath) {
  return fs.existsSync(filePath);
}

function nonEmptyTextFile(filePath) {
  return exists(filePath) && fs.readFileSync(filePath, "utf8").trim().length > 0;
}

function validateRunBasics(runDir) {
  return {
    resultJson: exists(`${runDir}/result.json`),
    reportMd: exists(`${runDir}/report.md`)
  };
}

module.exports = {
  exists,
  nonEmptyTextFile,
  validateRunBasics
};
