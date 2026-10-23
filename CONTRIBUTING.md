# Contributing to EL-Rouji

Thanks for helping improve EL-Rouji.

## Before proposing a change

- Search existing issues and pull requests to avoid duplicate work.
- For substantial changes, open an issue first to agree on scope.
- Keep changes focused and preserve Arabic, Algerian Darija, French, and English support where relevant.
- Never include API keys, account tokens, private user data, or production conversation content in commits, issues, tests, or logs.

## Development

1. Use a current Node.js LTS release.
2. Install dependencies with `npm install` (use `npm ci` after a lockfile has been checked in).
3. Set required server-side secrets in the development/deployment environment, not in source files.
4. Run `npm run build` before opening a pull request.

## Pull requests

Describe the problem and the chosen approach, list user-visible changes, identify risks, and explain how you tested the change. Include screenshots only when useful and make sure they contain no private data.

The project is still being prepared for a reproducible release; the current CI checks are not a substitute for manual testing of language direction, sign-in/sync, research, and file analysis.