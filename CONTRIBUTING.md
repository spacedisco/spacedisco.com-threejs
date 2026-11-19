# Contributing

1. Branch from the default branch. Name it after the change (`fix/venue-tags`, `docs/status`).
2. Run the checks locally (see AGENTS.md):

   ```sh
   npm ci
   npm run dev
   npm run build
   ```

3. Commit with Conventional Commits (`fix: ...`, `feat: ...`, `docs: ...`).
4. Open a PR with a Conventional Commit title and fill in the template: what changed and why, how you tested it, and what you couldn't run.
5. CI must be green. PRs are squash merged; the PR title becomes the commit message.
6. Update `docs/STATUS.md` if the change alters what works or what's next.
