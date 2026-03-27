# Claude Rules for math-game

## Branching
- Always work on a local feature branch for any code changes. If no suitable branch exists, create one.
- Never commit directly to local `main`.
- When pushing, always push to `origin main` (not to a remote feature branch): `git push origin HEAD:main`.

## Testing & Pushing
- After completing code changes, always commit locally first.
- Prompt the user to test locally and wait for explicit confirmation before pushing to origin.
- Never push to origin without the user confirming local testing passed.

## Privacy
- Never include personal information (real name, email, etc.) in commits, code, or any generated content.
- Always use the GitHub alias `ddzzdugu` and email `ddzzdugu@users.noreply.github.com` for git operations.
- If personal information is detected anywhere (commit history, code, config files), warn immediately before proceeding.
