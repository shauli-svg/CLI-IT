# Development Log

## Build source

This product ZIP was generated from the requested SPEC:

- Zero Friction
- Client First
- Deep Simplicity UI
- Action-based CI
- Evidence-first work
- ZIP-based delivery without Git dependency

## What was implemented

- Node runtime with no external dependencies.
- Action contracts under `actions/`.
- Recipes under `recipes/`.
- Policy gate.
- Artifact store.
- Three implemented actions:
  - `check-project`
  - `pull-browser-content`
  - `create-handoff`
- Local CI:
  - action validation
  - old path scan
  - smoke run
- GitHub Actions workflow file.
- Static UI prototype.
- Fixtures for project and browser extraction.
- Documentation set.

## Important engineering choices

### No external npm dependencies

Reason: reduce friction and avoid install failures.

### Fixtures before live connectors

Reason: CI can validate logic without relying on the user's machine, Chrome session, or auth state.

### Actions before scripts

Reason: the product should manage validated work units, not random shell execution.

### Evidence folders

Reason: every action must leave a reproducible run envelope.

## Current baseline

The product is a local MVP skeleton. It can run CI and actions, but it is not yet a universal connector.

## First real Windows client validation - 2026-05-10

Observed on the first local Windows run:

- ZIP extraction was correct.
- Node was available: `v25.2.1`.
- Canonical Node CI passed.
- Initial user-facing instruction incorrectly assumed `pwsh` existed.
- The first large documentation patch failed because a multi-here-string injected command was brittle.
- A later relative-path execution failed because injected blocks did not preserve current working directory.

Corrections applied:

- Canonical CI path is now `node .\scripts\ci-local.js`.
- `scripts\ci-local.ps1` now delegates to detected `node` and no longer depends on `pwsh`.
- Future terminal instructions for this environment must be self-contained and use explicit `$Root`.
- Large multi-file patches should be split into small verified stages.

Engineering lessons:

1. Verify the narrowest real client path first.
2. No optional shell assumptions in default instructions.
3. No relative-path assumptions across injected command blocks.
4. No documentation rewrite before the runtime fix is proven.
5. Every discovered mismatch must be recorded, not silently skipped.

## Sprint 2A - Local Control Surface

Implemented:

- Added local API surface above the existing runtime.
- Added `/api/health`.
- Added `/api/actions`.
- Added `/api/runs`.
- Added `scripts\api-smoke.js`.
- Extended CI from 4 checks to 5 checks.

Result:

- The product is no longer runtime-only.
- It now exposes a local control surface that can support a real UI.

## Sprint 2B - Live UI over Runtime

Implemented:

- Converted static UI into live UI.
- UI now loads implemented actions from `/api/actions`.
- UI can run safe demo actions through `/api/demo-run`.
- UI displays recent real runs from `/api/runs`.
- Added `scripts\ui-smoke.js`.
- Extended CI from 5 checks to 6 checks.

Result:

- UI became an actual control surface, not only a visual mock.

## Sprint 2C - Run Detail + Artifact Browser

Implemented:

- Added run detail endpoint: `/api/runs/<runName>`.
- Added artifact listing endpoint: `/api/runs/<runName>/artifacts`.
- Recent runs in the UI became clickable.
- Added Run Detail panel in the UI.
- Extended `ui-smoke` to verify detail and artifact endpoints.

Result:

- The product now shows evidence, not only status.
- Runs are inspectable from the client surface.

## Current product status after Sprint 2C

Working:

- action registry
- recipe registry
- local runtime
- local API
- live UI
- recent runs
- run detail
- artifact listing
- CI with 6 passing gates

Not yet working:

- real target selection from the UI
- action preview before execution
- live browser connector
- Native Messaging
- adapter builder
- persistent memory beyond run folders
- production packaging

## Terminal encoding validation - 2026-05-10

Observed:

- UTF-8 Markdown files without BOM were valid on disk.
- Windows PowerShell default readback rendered Hebrew incorrectly unless `-Encoding UTF8` was specified.
- Smart punctuation such as em dash was also not terminal-safe in default readback.

Decision:

- Keep runtime JSON and UI content UTF-8-capable.
- Keep terminal-facing Markdown docs ASCII-only.
- Store localized client labels in action contracts and UI, not in terminal docs.

Engineering action:

- Added `terminal-docs-audit` to CI.
- Rewrote `docs\ACTIONS.md` as ASCII-only.
- Normalized smart punctuation in README and docs.

## BOM hardening follow-up - 2026-05-10

Observed after adding `terminal-docs-audit`:

- `docs\ACTIONS.md` content was already ASCII-only.
- The audit still failed because Windows PowerShell had written a hidden UTF-8 BOM at the start of the file.
- The visible first line looked normal, but the actual first character was `U+FEFF`.

Correction applied:

- Removed the BOM from `docs\ACTIONS.md`.
- Revalidated first bytes as `23 20 41 63 74 69`.
- Re-ran `terminal-docs-audit` and full CI successfully.

Final rule:

- Terminal-facing Markdown docs must be ASCII-only and UTF-8 without BOM.

## Execution-flow smoke portability fix - 2026-05-10

Observed:

- `execution-flow-smoke` failed when run directly from the bridge.
- The same smoke test passed inside `ci-local`.
- Root cause: the smoke test built its fixture path from `process.cwd()`.
- Direct bridge execution used a different current working directory than CI.

Correction applied:

- Replaced `process.cwd()` with a self-rooting path derived from `__dirname`.
- Direct smoke run passed after the fix.
- Full CI passed after the fix.

Engineering lesson:

- Smoke tests must be self-rooting.
- Do not depend on ambient current working directory.
- A CI pass is not sufficient when the same test fails in direct execution.
