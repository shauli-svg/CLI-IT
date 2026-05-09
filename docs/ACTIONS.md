# Action Registry

## check-project

Client-facing label source: `actions/check-project.action.json -> clientLabel`

Purpose:

- Read a project folder.
- Detect basic indicators.
- Create a report.
- Store result evidence.

## pull-browser-content

Client-facing label source: `actions/pull-browser-content.action.json -> clientLabel`

Purpose:

- Read saved HTML fixture.
- Extract readable text.
- Create artifact JSON.
- Validate text is non-empty.

## create-handoff

Client-facing label source: `actions/create-handoff.action.json -> clientLabel`

Purpose:

- Read recent runs.
- Generate Past / Present / Next document.
- Store continuation artifact.

## run-local-ci

Client-facing label source: `actions/run-local-ci.action.json -> clientLabel`

Purpose:

- Execute local CI pipeline.
- Create CI summary and result envelope.

## Encoding policy

- Runtime JSON may contain UTF-8 client labels.
- Terminal-facing Markdown docs stay ASCII-only.
- This keeps PowerShell readback stable while preserving localized UI text.
