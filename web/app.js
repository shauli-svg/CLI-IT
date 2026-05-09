const els = {
  systemStatus: document.getElementById("system-status"),
  actionCards: document.getElementById("action-cards"),
  latestResult: document.getElementById("latest-result"),
  recentRuns: document.getElementById("recent-runs"),
  runDetail: document.getElementById("run-detail")
};

async function getJson(url, options) {
  const res = await fetch(url, options);
  const body = await res.json();
  if (!res.ok || body.ok === false) {
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return body;
}

function setStatus(text, tone = "neutral") {
  els.systemStatus.textContent = text;
  els.systemStatus.dataset.tone = tone;
}

function renderActions(actions) {
  const visible = actions.filter(a => a.implemented);
  els.actionCards.innerHTML = "";
  for (const [index, action] of visible.entries()) {
    const button = document.createElement("button");
    button.className = "card action-card";
    button.dataset.actionId = action.id;
    button.innerHTML = `
      <span>${String(index + 1).padStart(2, "0")}</span>
      <strong>${action.clientLabel || action.label}</strong>
      <small>${action.description}</small>
      <em>Run safe demo</em>
    `;
    button.addEventListener("click", () => runDemo(action.id, button));
    els.actionCards.appendChild(button);
  }
}

function renderRuns(runs) {
  if (!runs.length) {
    els.recentRuns.innerHTML = `<div class="empty-state">No runs yet.</div>`;
    return;
  }
  els.recentRuns.innerHTML = runs.slice(0, 6).map(run => `
    <button class="run-row" data-run-name="${run.name}">
      <strong>${run.action || run.name}</strong>
      <span>${run.ok === true ? "PASS" : run.ok === false ? "FAIL" : "UNKNOWN"}</span>
      <small>${run.summary || run.name}</small>
    </button>
  `).join("");
  for (const row of els.recentRuns.querySelectorAll("[data-run-name]")) {
    row.addEventListener("click", () => loadRunDetail(row.dataset.runName));
  }
}

async function loadRunDetail(runName) {
  els.runDetail.className = "empty-state";
  els.runDetail.textContent = "Loading evidence…";
  try {
    const detail = await getJson(`/api/runs/${encodeURIComponent(runName)}`);
    const artifacts = await getJson(`/api/runs/${encodeURIComponent(runName)}/artifacts`);
    const result = detail.run.result || {};
    els.runDetail.className = "detail-card";
    els.runDetail.innerHTML = `
      <strong>${result.action || detail.run.name}</strong>
      <span>${result.ok === true ? "PASS" : result.ok === false ? "FAIL" : "UNKNOWN"}</span>
      <p>${result.summary || "No summary available."}</p>
      <div><b>Files:</b> ${detail.run.files.length ? detail.run.files.join(", ") : "none"}</div>
      <div><b>Artifacts:</b> ${artifacts.artifacts.length ? artifacts.artifacts.map(a => a.name).join(", ") : "none"}</div>
      <code>${detail.run.name}</code>
    `;
  } catch (err) {
    els.runDetail.className = "detail-card fail";
    els.runDetail.textContent = err.message;
  }
}

function renderResult(result) {
  els.latestResult.className = "result-card";
  els.latestResult.innerHTML = `
    <strong>${result.action}</strong>
    <span>${result.ok ? "PASS" : "FAIL"}</span>
    <p>${result.summary}</p>
    <code>${result.runDir}</code>
  `;
}

async function refreshRuns() {
  const body = await getJson("/api/runs");
  renderRuns(body.runs);
}

async function runDemo(actionId, button) {
  const previous = button.innerHTML;
  button.disabled = true;
  button.innerHTML = `<strong>Running…</strong>`;
  try {
    const body = await getJson("/api/demo-run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actionId })
    });
    renderResult(body.result);
    await refreshRuns();
  } catch (err) {
    els.latestResult.className = "result-card fail";
    els.latestResult.textContent = err.message;
  } finally {
    button.disabled = false;
    button.innerHTML = previous;
  }
}

async function boot() {
  try {
    const health = await getJson("/api/health");
    setStatus(health.ok ? "Local runtime ready" : "Runtime issue", health.ok ? "pass" : "fail");
    const actionBody = await getJson("/api/actions");
    renderActions(actionBody.actions);
    await refreshRuns();
  } catch (err) {
    setStatus(err.message, "fail");
  }
}

boot();

