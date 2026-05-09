# Roadmap

## Phase 1 - Stable ZIP MVP

- Local CI
- Action registry
- Recipe registry
- Smoke tests
- Static UI
- Development docs

Status: included.

## Phase 2 - Local API

- HTTP API on localhost
- Run action endpoint
- Run status endpoint
- Run history endpoint
- Artifact browser endpoint

Status: not included.

## Phase 3 - Real Browser Connector

- Read active tab via extension
- Extract DOM safely
- Save page snapshot
- Validate extraction

Status: not included.

## Phase 4 - Native Messaging

- Chrome extension
- Native host
- Windows installer script
- Handshake test

Status: not included.

## Phase 5 - Agentic Adapter Builder

- Optional LLM planner
- Adapter sandbox
- Dry-run first
- Validation before memory

Status: not included.

## Phase 6 - Safe Git Workflow

- Read status
- Summarize diff
- Create commit plan
- Push only with explicit approval

Status: not included.

## Updated status after Sprint 2C

Completed:

- Phase 1 - Stable ZIP MVP
- Partial Phase 2 - Local API
- Live UI control surface
- Run detail and artifact inspection

Next highest-priority product step:

### Phase 2D - Client-first execution flow

- action preview
- visible "what will happen / what will not happen" copy
- real target input for `check-project`
- separation between demo execution and real execution
- smoke tests for preview and real-run path

Reason:

- Before adding more connectors, the product must complete the client loop:
  `choose action -> preview plan -> run on real target -> inspect evidence`.
