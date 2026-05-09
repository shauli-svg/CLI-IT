# HANDOFF - CLI-IT ZIP Baseline

## Past

The product was specified as a local-first action runtime:

```text
Intent -> Action -> Evidence -> Validation -> Memory
```

The requested delivery shifted away from Git and toward a compressed ZIP artifact.

## Present

This ZIP contains a runnable MVP baseline:

- `src/` runtime
- `actions/` contracts
- `recipes/` reusable recipes
- `scripts/` local CI
- `tests/fixtures/` smoke fixtures
- `web/` static UI
- `docs/` development documentation

Run:

```bash
node scripts/ci-local.js
```

or:

```powershell
pwsh ./scripts/ci-local.ps1
```

## Next

1. Run CI locally on the user's Windows machine.
2. Paste only `runs/<latest>-ci-local/CI_SUMMARY.md`.
3. Patch Windows-specific failures.
4. Add live browser connector.
5. Add Native Messaging Host.
6. Wire local UI to action runtime.
7. Add safe Git workflow only after CI is stable.

## Boundary

This baseline was built without live access to the user's local machine, browser, credentials, or remote execution environment.
