const fs = require("fs");
const path = require("path");

function loadJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(name => name.endsWith(".json"))
    .sort()
    .map(name => {
      const filePath = path.join(dir, name);
      return {
        path: filePath,
        data: JSON.parse(fs.readFileSync(filePath, "utf8"))
      };
    });
}

function loadActions(root) {
  return loadJsonFiles(path.join(root, "actions")).map(x => x.data);
}

function getAction(root, id) {
  return loadActions(root).find(a => a.id === id);
}

module.exports = { loadActions, getAction };
