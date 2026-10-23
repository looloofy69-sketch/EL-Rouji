# EL-Rouji

EL-Rouji is a multilingual AI assistant interface designed for Arabic, Algerian Darija, French, and English.

**Live application:** https://el-rouji-70120b.v2.appdeploy.ai/

## Current capabilities

- Assistant, research, writing, study, coding, and planning modes
- Built-in task prompts and a local calculator
- Browser-local conversation history and optional account-based sync
- Research mode with source links when server-side search is configured
- Image/text analysis for PNG, JPEG, WebP, TXT, MD, CSV, and JSON files

PDF and Office-document analysis are not part of the current upload flow.

## Stack

- React, TypeScript, and Vite
- AppDeploy-hosted backend and client SDK
- Tailwind CSS 4 and the `@tailwindcss/postcss` plugin (migration proposed in PR #10)
- `react-markdown`, `remark-gfm`, and `mathjs`

## Repository checks

The repository contains an npm lockfile and GitHub Actions CI that runs `npm ci`, TypeScript checking, an npm audit summary, and a Vite build. The CI build sets `EL_ROUJI_CI_BUILD=1` to use a **build-only shim** for the AppDeploy-provided `@appdeploy/client` module. The shim is not a functioning substitute for hosted authentication/image processing and its output must not be deployed.

The Tailwind CSS 4 dependency migration passed the initial CI trial (run #48) with zero npm audit findings, a passing TypeScript check, and a passing Vite bundle. It remains in [draft PR #10](https://github.com/loolooofy69-sketch/EL-Rouji/pull/10) pending visual verification of mobile responsiveness and Arabic RTL layout. The live AppDeploy application still uses its deployed version and has not been changed by the GitHub branch.

## Research configuration

Research mode requires `TAVILY_API_KEY` in secure server-side AppDeploy settings. Do not put service credentials in source files, frontend environment variables, issue reports, or commits. A configured secret does not alone prove that an end-to-end search succeeds.

## Development commands

```sh
npm ci
npm run typecheck
```

The repository-only bundle command is:

```sh
EL_ROUJI_CI_BUILD=1 npm run build
```

**Do not deploy the CI-shim build.** Deploy through AppDeploy so the platform-provided SDK and backend runtime are used.

See [architecture](docs/ARCHITECTURE.md), [integration notes](docs/INTEGRATIONS.md), [the roadmap](docs/ADDON_ROADMAP.md), [CI build boundary](docs/CI.md), [dependency audit record](docs/DEPENDENCY_AUDIT.md), and [the release checklist](docs/RELEASE_CHECKLIST.md).
