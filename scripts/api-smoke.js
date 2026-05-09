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
    const health = await fetch(`${base}/api/health`).then(r => r.json());
    assert(health.ok === true, "health endpoint should return ok");

    const actions = await fetch(`${base}/api/actions`).then(r => r.json());
    assert(actions.ok === true, "actions endpoint should return ok");
    assert(Array.isArray(actions.actions), "actions should be an array");
    assert(actions.actions.some(a => a.id === "check-project" && a.implemented === true), "check-project should be implemented");
    assert(actions.actions.some(a => a.id === "run-local-ci" && a.implemented === false), "run-local-ci should be declared but not yet implemented");

    const runs = await fetch(`${base}/api/runs`).then(r => r.json());
    assert(runs.ok === true, "runs endpoint should return ok");
    assert(Array.isArray(runs.runs), "runs should be an array");

    console.log("PASS api-smoke");
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(err => {
  console.error(`FAIL api-smoke: ${err.message}`);
  process.exit(1);
});
