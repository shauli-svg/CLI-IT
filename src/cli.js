#!/usr/bin/env node
const path = require("path");
const { loadActions } = require("./runtime/action-loader");
const { runAction } = require("./runtime/action-runner");

const root = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token.startsWith("--")) {
      const key = token.slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true;
      args[key] = val;
    }
  }
  return args;
}

function main() {
  const [cmd, actionId, ...rest] = process.argv.slice(2);

  if (!cmd || cmd === "help") {
    console.log(`CLI-IT

Usage:
  node src/cli.js list-actions
  node src/cli.js run <action-id> [--target path] [--input file]

Examples:
  node src/cli.js list-actions
  node src/cli.js run check-project --target tests/fixtures/sample-project-good
  node src/cli.js run pull-browser-content --input tests/fixtures/browser/notebooklm-sample.html
  node src/cli.js run create-handoff --target .
`);
    return;
  }

  if (cmd === "list-actions") {
    const actions = loadActions(root);
    for (const action of actions) {
      console.log(`${action.id}\t${action.clientLabel || action.label}\t${action.risk}`);
    }
    return;
  }

  if (cmd === "run") {
    const options = parseArgs(rest);
    const result = runAction(root, actionId, options);
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  throw new Error(`Unknown command: ${cmd}`);
}

try {
  main();
} catch (err) {
  console.error(`ERROR: ${err.message}`);
  process.exit(1);
}
