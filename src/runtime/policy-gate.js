function evaluatePolicy(action, options = {}) {
  const permissions = action.permissions || {};
  const risks = [];

  if (permissions.deleteFiles) risks.push("deleteFiles");
  if (permissions.gitPush) risks.push("gitPush");
  if (permissions.network) risks.push("network");
  if (permissions.execute) risks.push("execute");

  const requiresApproval = risks.some(r => ["deleteFiles", "gitPush", "network"].includes(r));

  return {
    ok: !requiresApproval || options.approved === true,
    requiresApproval,
    risks,
    message: requiresApproval
      ? `Action requires approval for: ${risks.join(", ")}`
      : "Action is allowed within current policy."
  };
}

module.exports = { evaluatePolicy };
