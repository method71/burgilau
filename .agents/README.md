# Maintaining Agent Instructions

This directory contains detailed, topic-specific instructions for agents. The
root `AGENTS.md` is the mandatory entry point and routing table; files in this
directory are loaded only when its routing rules say they apply.

## Purpose

The instruction system should accumulate durable, verified knowledge about
how to develop and maintain the project. It must not merely describe accidental
patterns found in the current codebase.

Agents are authorized and expected to update these instructions while
completing other tasks when they discover knowledge that will materially help
future work.

## What belongs in instructions

Add guidance only when it is:

- confirmed by project configuration, documentation, tests, repeated evidence,
  or an explicit user decision;
- expected to remain useful beyond the current task; and
- specific enough to guide an agent's actions or verification.

Useful additions include:

- reliable setup, development, build, lint, test, and release commands;
- architectural boundaries and dependency rules;
- locations and responsibilities of important modules;
- naming, typing, error-handling, and data-handling conventions;
- required validation for particular kinds of changes;
- compatibility, security, migration, or deployment constraints;
- generated files, external artifacts, and areas that require special care;
- recurring pitfalls whose prevention is not obvious from the code.

Do not add:

- task-specific progress, plans, or implementation notes;
- guesses based on a single example or an unverified assumption;
- temporary workarounds presented as permanent conventions;
- generic software-engineering advice with no project-specific consequence;
- rules that only restate what is immediately obvious from the relevant file;
- secrets, credentials, personal data, or sensitive environment-specific
  values.

## Placement and routing

- Keep universal rules and task routing in the root `AGENTS.md`.
- Put detailed guidance in `.agents/<topic>.md`.
- Extend an existing topic before creating a new one.
- Create a topic only when there is durable, actionable content for it; do not
  create empty placeholder files.
- Whenever a topic file is created, renamed, or removed, update the routing
  table in the root `AGENTS.md` in the same change.
- Every routing entry must state the concrete task condition that requires the
  file to be read.
- Keep topic files independent where practical so agents can load relevant
  context without reading the entire instruction set.
- Use a nested `AGENTS.md` only when instructions must automatically apply to
  every task within a particular directory tree. It should contain only rules
  specific to that subtree and may route to detailed files in `.agents/`.

## Temporary instructions

- A temporary instruction must state, or make objectively clear, the condition
  that makes it obsolete.
- Keep temporary instructions in a topic file under `.agents/` and mark their
  temporary scope in the root routing entry when it is not already clear.
- When the completion condition is met, remove the temporary file and its root
  routing entry in the same change.
- Before removal, preserve any still-valid, durable rules by moving them to the
  appropriate permanent topic instruction.

## Writing and maintenance

- During the current session, explicitly tell the user about any changes being
  made to the instruction system.
- Keep entries concise, actionable, and grouped under descriptive headings.
- Record the current rule, not the history of how it was discovered.
- State scope explicitly when a rule applies only to part of the repository.
- Prefer exact commands and paths when they are stable and verified.
- Link to detailed rationale instead of duplicating it when another maintained
  source is authoritative.
- Update or remove instructions when the project changes; do not retain
  obsolete guidance for historical purposes.
- Merge duplicates and move misplaced guidance when the instruction set grows.
- Resolve contradictions using current configuration, tests, documentation,
  and explicit user decisions. If the intended rule remains unclear, do not
  guess or silently rewrite it.
- Whenever practical, enforce critical rules with configuration or automated
  checks and keep the text as operational guidance rather than the only
  safeguard.

## Update triggers

Review the applicable instructions when work:

- introduces or substantially changes a module, service, or public interface;
- changes architecture or dependency boundaries;
- changes development, build, test, migration, deployment, or release flows;
- introduces generated artifacts or special handling requirements;
- establishes a convention expected to be reused;
- reveals a recurring, non-obvious failure mode;
- makes an existing instruction inaccurate or redundant;
- completes the initiative governed by a temporary instruction.

An update trigger requires review, not necessarily a documentation change. If
no durable guidance emerged, leave the instruction system unchanged.

## Final check

After changing instructions, verify that:

- every statement reflects the resulting project state;
- routing points to existing files and has unambiguous activation conditions;
- no rule is duplicated or contradicted elsewhere in the applicable scope;
- the change helps future tasks rather than documenting only the completed one.
