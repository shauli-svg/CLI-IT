# SPEC - CLI-IT / Local Action Runtime

## Product definition

CLI-IT converts client intent into validated work.

Core loop:

```text
Intent -> Action -> Evidence -> Validation -> Memory
```

## Philosophy

- Client first.
- Zero friction at the surface.
- Deep simplicity in the UI.
- Evidence always available.
- Technical depth hidden by default, exposed on demand.
- No wild agent loops.
- No action without validation.

## MVP scope

Included in this ZIP:

1. Action Registry
2. Recipe Registry
3. Node runtime without external dependencies
4. Policy Gate
5. Artifact Store
6. Local CI
7. Smoke tests
8. Saved HTML extraction fixture
9. Project check action
10. Handoff action
11. Static UI prototype

## Non-goals in this ZIP

- Real Chrome Native Messaging.
- Live NotebookLM scraping.
- Git push automation.
- Credentials handling.
- Remote execution.
- Full IDE replacement.
