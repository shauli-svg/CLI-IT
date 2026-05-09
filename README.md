# CLI-IT - Local Action Runtime MVP

CLI-IT is a local-first product skeleton for the **CLI ANYTHING / Universal Local Action Runtime** concept.

It turns client intent into verified work:

```text
Intent -> Action -> Evidence -> Validation -> Memory
```

This ZIP is not a slide deck. It contains a runnable MVP skeleton with:

- Action Registry
- Recipe Registry
- Policy Gate
- Artifact Store
- Local CI
- Smoke tests
- Browser-fixture extraction
- Project-check action
- Handoff generation
- Static "deep simplicity" UI prototype
- Development docs
- Failure / gap inventory

## Recommended local CI entrypoint

From the project root:

```powershell
node .\scripts\ci-local.js
```

This is the canonical client path because it only requires Node.

## Optional PowerShell wrapper

```powershell
.\scripts\ci-local.ps1
```

The wrapper delegates to Node and is compatible with Windows PowerShell and PowerShell 7.

## Important execution note

When commands are injected through an external bridge, do not assume the current working directory persists between blocks. Prefer absolute paths or reset `$Root` inside every block.

## Run actions manually

```powershell
node .\src\cli.js list-actions
node .\src\cli.js run check-project --target .\tests\fixtures\sample-project-good
node .\src\cli.js run pull-browser-content --input .\tests\fixtures\browser\notebooklm-sample.html
node .\src\cli.js run create-handoff --target .
```

## Start local UI prototype

```powershell
node .\src\ui\server.js
```

Then open:

```text
http://127.0.0.1:4317
```

## Status

This is a self-contained MVP baseline. It does not yet connect to a live browser, Native Messaging Host, real NotebookLM session, Git credentials, or remote CI runner.
