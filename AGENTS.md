# Agent Instructions

This file is the mandatory entry point for agents working in this repository.
It contains universal rules and routes tasks to detailed instructions stored
under `.agents/`.

## General approach

- Treat the existing implementation as evidence, not automatically as a
  standard to follow.
- Follow the user's current request and preserve unrelated user changes.
- Prefer the smallest change that fully solves the task.
- Do not broaden a task with unrelated cleanup unless it is required for a
  correct and maintainable solution.
- Verify changes with the most relevant available checks.

## Task-specific instructions

Read only the detailed instructions that apply to the current task. If a task
spans several listed areas, read each applicable file.

- Creating, changing, organizing, or reviewing agent instructions:
  `.agents/README.md`
- Performing work that implements or affects the active refactoring plan:
  `.agents/refactoring.md`
- Changing HTML, CSS/SCSS, or JavaScript that interacts with the DOM:
  `.agents/frontend-conventions.md`
- Changing JavaScript application structure, pricing, calculator logic, or
  WhatsApp integration: `.agents/javascript-architecture.md`
- Changing dependencies, formatting, linting, tests, build configuration, or
  validation workflows: `.agents/validation.md`
- Creating, editing, selecting, or reviewing advertising content or creatives
  for the window air-inlet valve: `.agents/content-matrix.md` (temporary; use
  until the user replaces or withdraws this content matrix).

Detailed topic instructions will be added here as the project develops. Do
not assume that an unlisted file under `.agents/` applies to a task.

## Before finishing a task

Consider whether the work revealed durable project knowledge that would
materially help future agents. If it did, read `.agents/README.md` and update
the instruction system as part of the task. If it did not, leave the
instructions unchanged.
