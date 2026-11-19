# Status

Updated 2026-11-19, when the repo standard baseline was applied.

**State:** live. This repo is the source of spacedisco.com (new landing page, 2026-11-19, issue #7).

## What works
- `npm ci`, `npm test` and `vite build` pass on Node 22 (CI runs them on every PR).
- spacedisco.com serves the new page; boarding requests land in Supabase `public.spacedisco_boarding_requests`.

## Known broken or missing
- `legacy/2022/space_disco_2020_highlight_1080p.mp4` (about 50 MB) is still in git history; the site uses a 3.7 MB compressed loop.
- No confirmation email yet: a request gets a pass on screen only. Inviting people is manual until the party product (see the proposal on #7) is built.
- Vercel is not linked to this repo for git deploys (the project still points at an old repo); deploys are from the CLI.

## Next
- Steven decides on the party product proposal (issue #7).

## Not done yet from the repo standard
- Default branch `main`, branch protection with required checks and squash-only merges: repo settings, Steven's to-do.
- release-please, signed releases and a coverage floor: added when the repo is revived and has something to release.

## Log
- 2026-11-19: new spacedisco.com landing page (#7), boarding request API and tests; old page moved to legacy/2022.
- 2026-11-19: repo standard baseline (AGENTS.md, CLAUDE.md, CONTRIBUTING, SECURITY, STATUS, decision record, editorconfig, templates, CODEOWNERS, Dependabot, CI).
- `package-lock.json` was missing `gsap`, so `npm ci` failed; regenerated it with `npm install` and removed `yarn.lock` (the standard is npm).
