# 0001: Apply the repo standard as a baseline, not a rewrite

Date: 2026-11-19. Status: accepted.

## Context
Steven's repo standard (TypeScript strict, Prettier + ESLint, Vitest with a coverage floor, CI, release-please, signed releases, a fixed docs set) is fully applied in spacedisco/playlog. This repo is dormant code in another stack (JavaScript), kept because Space Disco is being revived.

## Decision
Apply the parts that don't need a rewrite: the docs set (AGENTS.md, CLAUDE.md, CONTRIBUTING.md, SECURITY.md, docs/STATUS.md, decision records), `.editorconfig`, PR and issue templates, CODEOWNERS, Dependabot, and a CI workflow with least-privilege permissions and SHA-pinned actions that runs the checks that pass today, gitleaks on new commits and a Conventional Commit PR title check. Fix what blocked those checks.

Language-specific tooling (formatters, coverage floors, release-please, signing) waits until the repo is revived, so it's chosen for the stack it ends up with.

## Consequences
- CI is green and meaningful from day one, and every new commit is scanned for secrets.
- Old history is not scanned; known problems in it are listed in docs/STATUS.md.
