# Security Model

## Current baseline

The MVP includes a policy gate and action permissions.

Permissions include:

- readFiles
- writeFiles
- execute
- network
- deleteFiles
- gitPush

## Current limitations

The policy gate is not a full sandbox. It prevents obvious high-risk action approval in runtime logic, but it does not isolate OS-level execution.

## Required future hardening

1. Command allowlist.
2. Path allowlist.
3. No shell string injection.
4. No arbitrary user input as command.
5. Explicit approval for:
   - delete
   - overwrite
   - git push
   - network send
   - credentials
6. Run envelope for every execution.
7. Immutable logs where possible.
