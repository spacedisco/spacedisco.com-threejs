# Security

Report a problem privately to the repository owner (Steven Zeiler) through GitHub, not in a public issue.

- Secrets never go in the repo. CI scans new commits with gitleaks.
- Some old commits in this repo predate that check. Anything they contain is treated as exposed and must be revoked at its provider; see docs/STATUS.md.
