# spacedisco.com-threejs: notes for agents

- What it is: the source of the live spacedisco.com, the landing page for the Space Disco Orbital Lounge and House Music Club (Steven's party brand, revived 2026-11-19). Deployed to the Vercel project `spacedisco.com` (team stevenzeiler).
- Stack: JavaScript, Vite, Three.js, one Vercel function (`api/board.js`) that writes boarding pass requests to the shared Supabase table `public.spacedisco_boarding_requests` (service role, env `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` on Vercel).
- Layout: `index.html` the page; `src/main.js` (reveal, form), `src/sky.js` (Three.js stars and mirror ball), `src/boarding.js` (validation shared with the API), `src/style.css`; `public/media/` compressed video and stills; `api/board.js`; `test/` (node:test); `legacy/2022/` the old page, kept for history only.
- Boarding requests are personal data: never print, export or publish them. The old spacedisco.party repos hold guests' phone numbers; none of it may reach this site (a test checks the published files).
- Commands:

  ```sh
  npm ci
  npm run dev
  npm test
  npm run build
  ```

- CI runs: `npm test`, `npm run build`, plus gitleaks on new commits and a PR title check.
- Every change comes with a test when there is something testable; every bug fix with a test that failed before the fix.
- Commits and PR titles use Conventional Commits (`feat:`, `fix:`, `docs:`, `ci:`, `build:`, `chore:`, `test:`, `refactor:`).
- One PR per change, squash merged into the default branch. Agents merge their own PRs once CI is green. Say plainly in the PR what wasn't built or run.
- Never commit secrets or personal data. Config comes from environment variables; real values live in Steven's Bitwarden vault.
- Production deploys are a standing yes (Steven, 2026-11-19). Never without Steven's yes: publishing a package or app, making the repo public, changing repo settings, deleting data or rewriting history, spending money.
- Update docs/STATUS.md when a PR merges.
- The full repo standard and its model repo: spacedisco/playlog (docs/plan/repo-standard.md).
