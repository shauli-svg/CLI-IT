# UX Direction - Deep Simplicity

## Principle

The client should not see the machinery first.

Default user flow:

```text
Choose work -> Preview safe plan -> Run -> See result -> Open evidence if needed
```

## UI rules

- One primary action per screen.
- Hide logs by default.
- Show technical details on demand.
- Use calm language.
- Always explain what will not happen:
  - no delete
  - no upload
  - no git push
  - no external send

## Current UI

A static prototype exists in:

```text
web/index.html
web/styles.css
```

Start with:

```bash
node src/ui/server.js
```

## Missing

- Live action buttons.
- Progress timeline.
- Run history.
- Result pages.
- Approval dialogs.

## Verified UI progress

Implemented after the initial prototype:

- Actions are loaded from the live local API.
- Safe demo actions can be launched from the interface.
- Recent runs are loaded from live run history.
- Runs can be selected and inspected.
- Run detail shows files and artifacts.

Still missing for a true client-first flow:

- target picker
- action preview
- explicit safe-plan copy before execution
- distinction between demo mode and real mode
- human-readable artifact opening
