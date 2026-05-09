const path = require("path");
const { createServer } = require("../src/ui/server");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function main() {
  const server = createServer();
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const base = `http://127.0.0.1:${address.port}`;
  const root = path.resolve(__dirname, "..");
  const target = path.join(root, "tests", "fixtures", "sample-project-good");

  try {
    const preview = await fetch(`${base}/api/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        actionId: "check-project",
        options: { target }
      })
    }).then(r => r.json());

    assert(preview.ok === true, "preview should return ok");
    assert(preview.preview.actionId === "check-project", "preview should match action");
    assert(preview.preview.willDo.includes("Read the selected project folder."), "preview should explain work");
    assert(preview.preview.willNotDo.includes("Modify the selected project."), "preview should explain safety boundary");

    const run = await fetch(`${base}/api/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        actionId: "check-project",
        options: { target }
      })
    }).then(r => r.json());

    assert(run.ok === true, "real run should return ok");
    assert(run.result.action === "check-project", "real run should execute check-project");
    assert(run.result.ok === true, "real run should pass on fixture project");

    console.log("PASS execution-flow-smoke");
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(err => {
  console.error(`FAIL execution-flow-smoke: ${err.message}`);
  process.exit(1);
});

