# CLI-IT

CLI-IT is a local-first action runtime concept for turning user intent into verified digital work.

This repository starts with a minimal product foundation:

- action contracts
- recipe contracts
- local CI entrypoint
- GitHub Actions CI
- artifact-producing smoke checks
- product documentation

Core mantra:

```text
Intent -> Action -> Evidence -> Validation -> Memory
```

## Run local CI

```powershell
pwsh ./scripts/ci-local.ps1
```

The CI creates a timestamped run folder under `runs/` with:

- `result.json`
- `CI_SUMMARY.md`
- validation outputs

## Current status

Initial scaffold committed through the GitHub connector. Next step is to expand the runtime and action validators from this baseline.
