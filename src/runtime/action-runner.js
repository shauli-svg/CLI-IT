const { getAction } = require("./action-loader");
const { evaluatePolicy } = require("./policy-gate");

const implementations = {
  "check-project": require("../actions/check-project"),
  "pull-browser-content": require("../actions/pull-browser-content"),
  "create-handoff": require("../actions/create-handoff")
};

function isImplemented(actionId) {
  return Boolean(implementations[actionId]);
}

function listImplementedActionIds() {
  return Object.keys(implementations).sort();
}

function runAction(root, actionId, options = {}) {
  const action = getAction(root, actionId);
  if (!action) throw new Error(`Unknown action: ${actionId}`);

  const policy = evaluatePolicy(action, options);
  if (!policy.ok) {
    throw new Error(policy.message);
  }

  const impl = implementations[actionId];
  if (!impl) {
    throw new Error(`No implementation wired for action: ${actionId}`);
  }

  return impl.run(root, options);
}

module.exports = { runAction, isImplemented, listImplementedActionIds };
