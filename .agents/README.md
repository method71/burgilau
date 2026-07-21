# Maintaining Agent Instructions

Read this file only when creating, changing, organizing, or reviewing agent
instructions.

## Content

Record guidance only when it is:

- confirmed by project configuration, documentation, tests, repeated evidence,
  or an explicit user decision;
- expected to remain useful beyond the current task; and
- actionable for future implementation or verification.

Do not record task progress, history, guesses, obvious facts, generic advice,
temporary workarounds as permanent rules, or sensitive data.

## Placement and routing

- Keep universal rules and task routing in `AGENTS.md`.
- Keep detailed guidance in focused `.agents/<topic>.md` files.
- Extend an existing topic before creating a new one.
- Give every topic an explicit activation condition in `AGENTS.md`.
- When creating, renaming, or removing a topic, update its route in the same
  change.
- Keep topics independent so agents need to load only those matched by the
  current task.

## Temporary instructions

State the condition that makes a temporary instruction obsolete. When that
condition is met, remove its file and route together, preserving any still-valid
guidance in the appropriate permanent topic.

## Update triggers

Review the applicable instructions when a task:

- changes a stable architecture boundary, data contract, or public interface;
- changes setup, build, validation, deployment, or release workflows;
- introduces generated files or a recurring non-obvious pitfall;
- establishes a reusable convention through an explicit user decision; or
- makes an existing instruction inaccurate, redundant, or obsolete.

Update instructions only when the resulting guidance meets the content criteria
above. Extend an existing topic when it covers the same task condition. Create
a new topic only when the guidance needs a distinct activation condition.
Remove instructions when they no longer describe the project.

## Maintenance

- Keep rules concise, current, actionable, and scoped.
- Record the current rule, not the history of how it was discovered.
- Remove obsolete guidance and merge duplication.
- Resolve conflicts using current configuration, tests, documentation, and
  explicit user decisions; do not guess when intent remains unclear.
- Tell the user when the instruction system is changed.

## Final check

Verify that routes resolve to existing files, activation conditions are
unambiguous, statements match the resulting project, and applicable rules do
not conflict or duplicate one another.
