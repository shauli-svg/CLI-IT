const path = require("path");
const { getAction } = require("./action-loader");
const { evaluatePolicy } = require("./policy-gate");

function describePlan(root, actionId, options = {}) {
  const action = getAction(root, actionId);
  if (!action) throw new Error(`Unknown action: ${actionId}`);

  const policy = evaluatePolicy(action, options);
  const normalizedOptions = { ...options };

  if (actionId === "check-project") {
    return {
      ok: true,
      actionId,
      clientLabel: action.clientLabel,
      risk: action.risk,
      requiresApproval: policy.requiresApproval,
      targetSummary: normalizedOptions.target || "No target selected yet.",
      willDo: [
        "Read the selected project folder.",
        "Detect basic project indicators.",
        "Create a local project report.",
        "Store run evidence under runs/."
      ],
      willNotDo: [
        "Delete files.",
        "Push to Git.",
        "Send data outside the machine.",
        "Modify the selected project."
      ]
    };
  }

  if (actionId === "pull-browser-content") {
    return {
      ok: true,
      actionId,
      clientLabel: action.clientLabel,
      risk: action.risk,
      requiresApproval: policy.requiresApproval,
      targetSummary: normalizedOptions.input || "No HTML input selected yet.",
      willDo: [
        "Read the selected saved HTML file.",
        "Extract readable text.",
        "Create a local extraction artifact.",
        "Store run evidence under runs/."
      ],
      willNotDo: [
        "Open a live browser session.",
        "Modify the source file.",
        "Send data outside the machine.",
        "Use credentials."
      ]
    };
  }

  if (actionId === "create-handoff") {
    return {
      ok: true,
      actionId,
      clientLabel: action.clientLabel,
      risk: action.risk,
      requiresApproval: policy.requiresApproval,
      targetSummary: normalizedOptions.target || root,
      willDo: [
        "Read recent local runs.",
        "Summarize past, present, and next work.",
        "Create a local handoff document.",
        "Store run evidence under runs/."
      ],
      willNotDo: [
        "Modify source code.",
        "Push to Git.",
        "Send data outside the machine.",
        "Delete prior runs."
      ]
    };
  }

  return {
    ok: true,
    actionId,
    clientLabel: action.clientLabel,
    risk: action.risk,
    requiresApproval: policy.requiresApproval,
    targetSummary: "No custom preview defined.",
    willDo: ["Run the selected action inside current policy boundaries."],
    willNotDo: ["No additional claims available for this action yet."]
  };
}

module.exports = { describePlan };
