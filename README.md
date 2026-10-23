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
- Tailwind CSS 3, PostCSS, and Autoprefixer
- `react-markdown`, `remark-gfm`, and `mathjs`

## Repository checks

The repository contains an npm lockfile and a GitHub Actions workflow that runs `npm ci`, TypeScript checking, and a Vite build. The CI build sets `EL_ROUJI_CI_BUILD=1` to use a **build-only shim** for the AppDeploy-provided `@appdeploy/client` module. The shim is not a functioning substitute for hosted authentication/image processing and its output must not be deployed.

For the hosted app, AppDeploy supplies the real client SDK and backend runtime. The CI check verifies type correctness and frontend bundling, not the behavior of hosted services.

## Research configuration

Research mode requires `TAVILY_API_KEY` in secure server-side AppDeploy settings. Do not put service credentials in source files, frontend environment variables, issue reports, or commits. A configured secret does not alone prove that an end-to-end search succeeds.

## Development commands

```sh
npm ci
npm run typecheck
```

The repository-only build command is:

```sh
EL_ROUJI_CI_BUILD=1 npm run build
```

**Do not deploy the CI-shim build.** Deploy through the AppDeploy workflow so the platform-provided SDK and backend runtime are used.

## Known release blockers

The latest observed npm audit (October 23, 2026) reported 7 advisories in the current dependency tree: 5 high and 2 moderate, centered on Tailwind CSS 3 and related build-time dependencies. See [the dependency audit record](docs/DEPENDENCY_AUDIT.md). A green CI build is not a security sign-off, and no release tag has been created.

See [architecture](docs/ARCHITECTURE.md), [integration notes](docs/INTEGRATIONS.md), [the roadmap](docs/ADDON_ROADMAP.md), [CI build boundary](docs/CI.md), and [the release checklist](docs/RELEASE_CHECKLIST.md).
