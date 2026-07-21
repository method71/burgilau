# Validation

Apply these instructions when changing dependencies, automated checks, tests,
build configuration, or when selecting verification for another change.

## Setup

- Install declared dependencies with `npm install`.
- Install the Chromium runtime once with `npx playwright install chromium`
  before running browser tests in a new environment.
- Do not edit generated output in `dist/`, `playwright-report/`, or
  `test-results/`.

## Commands

- `npm run format` formats maintained source, configuration, and instruction
  files; `npm run format:check` verifies formatting without writes.
- `npm run lint:js` checks JavaScript and configuration files.
- `npm run lint:styles` checks SCSS; `npm run lint` runs both linters.
- `npm run test:unit` runs business-logic tests in `tests/unit/`.
- `npm run test:e2e` runs the Chromium main-flow test in `tests/e2e/` and may
  reuse the Vite server on port 4173.
- `npm test` runs unit and browser tests.
- `npm run check` is the complete non-visual gate: formatting, both linters,
  unit and browser tests, and the production build.

## Required checks by change type

- Pricing, formatting, or WhatsApp logic: run `npm run lint:js` and
  `npm run test:unit`.
- DOM behavior or user-flow changes: run `npm run lint:js`,
  `npm run test:e2e`, and `npm run build`.
- SCSS changes: run `npm run lint:styles`, `npm run build`, and visually inspect
  affected desktop and mobile states.
- Tooling, dependency, test, or build changes: run `npm run check`.
- Before completing a refactoring stage or another cross-cutting change, run
  `npm run check` and perform the relevant visual browser inspection.

Keep tests deterministic. Unit tests must not depend on the DOM or network;
browser tests must not follow external WhatsApp links and should validate their
decoded query parameters instead.
