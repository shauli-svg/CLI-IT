# Failure / Gap / Non-Completion Inventory

This file is intentionally blunt. It lists what was not completed, what may have been overclaimed earlier, and where future work must not pretend to be done.

## 1. Git work was not completed cleanly

Status: not completed in this ZIP workflow.

What happened:

- A GitHub repository was inspected.
- A direct file creation flow was started.
- The user stopped the Git direction because the workflow was not smooth.

Risk:

- Do not claim a clean Git commit/PR baseline unless verified in GitHub.
- Treat this ZIP as the source of truth for the next step, not the partial Git attempt.

## 2. No live browser connector

Status: not implemented.

Reason:

- This environment does not have access to the user's live Chrome session or NotebookLM page.
- The ZIP includes a saved HTML fixture extractor only.

Future action:

- Add Browser Connector.
- Add Chrome Extension or Native Messaging Host.
- Add live extraction smoke test separately.

## 3. No Native Messaging Host

Status: not implemented.

Reason:

- Requires local OS registration and browser extension packaging.
- Cannot be fully validated inside this ZIP-only build.

Future action:

- Add `native-host/` folder.
- Add manifest templates.
- Add Windows install/uninstall scripts.
- Add local handshake test.

## 4. No real universal connector

Status: not implemented.

Reason:

- A true universal connector requires connector discovery, auth handling, capability registry, fallbacks, and validated recipes.
- This MVP only creates the skeleton.

Future action:

- Add capability registry.
- Add adapter builder.
- Add recipe memory.
- Add connector health checks.

## 5. No LLM integration

Status: not implemented.

Reason:

- ZIP must be runnable without API keys or external model dependencies.

Future action:

- Add optional LLM planner interface.
- Keep runtime usable without LLM.
- Enforce policy gate before any generated adapter runs.

## 6. No Git safe-push workflow

Status: not implemented.

Reason:

- User explicitly moved away from Git flow.
- Git operations are high-risk and should be added only after CI baseline is stable.

Future action:

- Add read-only Git status first.
- Add diff summary second.
- Add commit draft third.
- Add push only with explicit approval.

## 7. No full Apple-level UI

Status: prototype only.

Reason:

- Static UI demonstrates design philosophy but does not yet control runtime actions.

Future action:

- Add local API.
- Wire UI to actions.
- Add progress timeline.
- Add run history page.

## 8. No Windows-specific hardening

Status: partial only.

Reason:

- CI is cross-platform Node-based.
- PowerShell wrapper exists, but advanced Windows path / encoding cases are not deeply tested here.

Future action:

- Test Hebrew paths.
- Test long paths.
- Test PowerShell execution policy.
- Test spaces and Unicode in paths.

## 9. No deep security sandbox

Status: partial policy gate only.

Reason:

- Current policy gate labels risk but does not enforce OS sandboxing.

Future action:

- Add command allowlist.
- Add path allowlist.
- Add dry-run modes.
- Add high-risk approval envelope.

## 10. No production-grade persistence

Status: filesystem only.

Reason:

- MVP stores runs in folders.

Future action:

- Add local SQLite or JSON index.
- Add recipe history.
- Add failure memory.
- Add migration strategy.

## 11. No claim of production readiness

Status: not production-ready.

This ZIP is a product baseline and development seed, not a finished universal automation platform.

## 12. Initial client instructions assumed `pwsh` existed

Status: found and corrected.

What happened:

- The first client-facing command recommended `pwsh .\scripts\ci-local.ps1`.
- On the actual Windows client machine, Node existed but `pwsh` was not available in PATH.
- The product runtime worked, but the documented default path failed.

Why this matters:

- This violated the Zero Friction requirement.
- It exposed an unverified environment assumption.

Correction applied:

- Canonical CI command changed to `node .\scripts\ci-local.js`.
- PowerShell wrapper kept only as optional convenience.

## 13. Oversized injected patch used brittle here-strings

Status: found during live collaboration and corrected in workflow.

What happened:

- A multi-file documentation patch was sent as one large block with multiple here-strings.
- The injected execution path failed with a missing here-string terminator parse error.

Why this matters:

- The patch style was not compatible with the actual terminal bridge behavior.

Correction applied:

- Switched back to small stage-based patches.
- Used line arrays instead of giant here-strings.

## 14. Relative-path execution assumed persistent working directory

Status: found and corrected.

What happened:

- After a prior block changed directory, a later block attempted `.\scripts\ci-local.ps1`.
- The bridge executed the later block in a different working directory.
- The relative path therefore pointed nowhere.

Why this matters:

- It proves terminal instructions must not assume persistent shell state across injected runs.

Correction applied:

- Future commands use explicit `$Root` and absolute `Join-Path` execution.

Residual work:

- Add bridge-aware command templates to future product docs.
- Add a dedicated terminal-operation guide if this becomes a repeated deployment pattern.

## 15. Terminal-facing docs were not safe under default Windows PowerShell readback

Status: found and corrected.

What happened:

- UTF-8 Markdown without BOM was valid on disk.
- Default Windows PowerShell readback displayed Hebrew as mojibake.
- Smart punctuation such as em dash also rendered poorly in terminal readback.

Why this matters:

- Development docs are operational artifacts, not decorative files.
- If terminal readback is unreliable, handoff and audit workflows lose trust.

Correction applied:

- Terminal-facing Markdown docs are now ASCII-only.
- Localized labels remain in runtime JSON and UI.
- Added a permanent CI gate: `terminal-docs-audit`.

Residual work:

- Any future doc intended for terminal readback must remain ASCII-only.
- Any future localized documentation should be explicitly classified as non-terminal-facing.

## 16. ASCII-only terminal docs still failed because of hidden UTF-8 BOM

Status: found and corrected.

What happened:

- `docs\ACTIONS.md` had already been rewritten to ASCII-only content.
- The new `terminal-docs-audit` still failed on line 1.
- Root cause: Windows PowerShell `Set-Content -Encoding UTF8` had written a hidden BOM.

Why this matters:

- A file can look terminal-safe to the eye and still contain a leading non-ASCII character.
- CI must validate bytes, not only visible text.

Correction applied:

- Removed the BOM with explicit UTF-8-no-BOM writing.
- Revalidated first bytes: `23 20 41 63 74 69`.
- Re-ran `terminal-docs-audit` and full CI successfully.

Final rule:

- Terminal-facing Markdown docs must be ASCII-only and UTF-8 without BOM.

## 17. Execution-flow smoke passed in CI but failed in direct execution

Status: found and corrected.

What happened:

- `execution-flow-smoke` built its fixture path from `process.cwd()`.
- In CI, child processes were launched with the project root as working directory.
- In direct bridge execution, the working directory was different.
- Result: direct smoke failed while CI still passed.

Why this matters:

- CI can hide a portability bug when the test itself depends on the CI environment.
- A smoke test is not trustworthy if it only works inside one launcher.

Correction applied:

- Replaced `process.cwd()` with a self-rooting path derived from `__dirname`.
- Verified direct smoke pass.
- Verified full CI pass.

Final rule:

- Smoke tests must locate fixtures from their own file location, not from ambient current working directory.
