const { createServer } = require("../src/ui/server");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function main() {
  const server = createServer();
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const base = `http://127.0.0.1:${address.port}`;

  try {
    const html = await fetch(`${base}/`).then(r => r.text());
    assert(html.includes("What do you want to do?"), "home should contain client question");
    assert(html.includes("./app.js"), "home should load app.js");

    const app = await fetch(`${base}/app.js`).then(r => r.text());
    assert(app.includes("/api/actions"), "app should load actions from API");
    assert(app.includes("/api/demo-run"), "app should run safe demos through API");

    const demo = await fetch(`${base}/api/demo-run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actionId: "check-project" })
    }).then(r => r.json());
    assert(demo.ok === true, "demo run should pass");
    assert(demo.result.action === "check-project", "demo run should execute check-project");

    const runs = await fetch(`${base}/api/runs`).then(r => r.json());
    assert(runs.runs.some(run => run.action === "check-project"), "recent runs should include check-project");

    const checkRun = runs.runs.find(run => run.action === "check-project");
    const detail = await fetch(`${base}/api/runs/${encodeURIComponent(checkRun.name)}`).then(r => r.json());
    assert(detail.ok === true, "run detail should return ok");
    assert(detail.run.result.action === "check-project", "run detail should include result action");

    const artifacts = await fetch(`${base}/api/runs/${encodeURIComponent(checkRun.name)}/artifacts`).then(r => r.json());
    assert(artifacts.ok === true, "artifact endpoint should return ok");
    assert(Array.isArray(artifacts.artifacts), "artifacts should be an array");

    console.log("PASS ui-smoke");
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(err => {
  console.error(`FAIL ui-smoke: ${err.message}`);
  process.exit(1);
});

