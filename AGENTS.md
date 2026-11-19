# spacedisco.com-threejs: notes for agents

- What it is: the Three.js mirror-ball landing page for the Space Disco Orbital Lounge and House Music Club. Part of the Space Disco org (Steven's party and music brand, being revived). Dormant code: keep changes small and say what you couldn't run.
- Stack: JavaScript, Vite, Three.js, GSAP.
- Layout: `index.html`, `main.js`, `style.css` the landing page; `mirror-balls.html` + `mirror_balls.js` the mirror-ball scene; `src/`, `assets/` and the images at the root.
- Commands:

  ```sh
  npm ci
  npm run dev
  npm run build
  ```

- CI runs: `npm run build`, plus gitleaks on new commits and a PR title check.
- Every change comes with a test when there is something testable; every bug fix with a test that failed before the fix.
- Commits and PR titles use Conventional Commits (`feat:`, `fix:`, `docs:`, `ci:`, `build:`, `chore:`, `test:`, `refactor:`).
- One PR per change, squash merged into the default branch. Agents merge their own PRs once CI is green. Say plainly in the PR what wasn't built or run.
- Never commit secrets or personal data. Config comes from environment variables; real values live in Steven's Bitwarden vault.
- Never without Steven's yes: deploying, publishing a package or app, making the repo public, changing repo settings, deleting data or rewriting history, spending money.
- Update docs/STATUS.md when a PR merges.
- The full repo standard and its model repo: spacedisco/playlog (docs/plan/repo-standard.md).
