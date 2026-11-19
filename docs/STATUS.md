# Status

Updated 2026-11-19, when the repo standard baseline was applied.

**State:** dormant. Space Disco is being revived (spacedisco.com); this repo is kept as part of that.

## What works
- `npm ci` and `vite build` pass on Node 22 (CI builds it on every PR).

## Known broken or missing
- `space_disco_2020_highlight_1080p.mp4` (about 50 MB) is committed to git; it should live in a media host or Git LFS.

## Next
- This is the natural seed for the revived spacedisco.com: decide whether to build the new site from it.

## Not done yet from the repo standard
- Default branch `main`, branch protection with required checks and squash-only merges: repo settings, Steven's to-do.
- release-please, signed releases and a coverage floor: added when the repo is revived and has something to release.

## Log
- 2026-11-19: repo standard baseline (AGENTS.md, CLAUDE.md, CONTRIBUTING, SECURITY, STATUS, decision record, editorconfig, templates, CODEOWNERS, Dependabot, CI).
- `package-lock.json` was missing `gsap`, so `npm ci` failed; regenerated it with `npm install` and removed `yarn.lock` (the standard is npm).
