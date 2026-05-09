# CI Design

## Canonical command

```powershell
node .\scripts\ci-local.js
```

This is the primary client path because it only requires Node and does not assume PowerShell 7 exists.

## Optional PowerShell wrapper

```powershell
.\scripts\ci-local.ps1
```

The wrapper delegates to the Node CI runner. It is a convenience path, not the canonical dependency path.

## Checks

1. Node runtime exists.
2. Action contracts are valid.
3. Old hardcoded path scan passes.
4. Smoke actions pass.

## Output

Every CI run writes:

```text
runs/<timestamp>-ci-local/
  result.json
  CI_SUMMARY.md
  *.stdout.txt
  *.stderr.txt
```

## Product rule

No action should be accepted unless it has:

- contract
- permissions
- risk label
- validation list
- smoke or fixture path
- run evidence

## Windows / bridge lessons already verified

- Do not assume `pwsh` exists on a client machine.
- Do not assume current working directory persists between injected blocks.
- Prefer self-contained commands with explicit `$Root`.
- Avoid giant multi-document here-string patches in injected execution paths.
