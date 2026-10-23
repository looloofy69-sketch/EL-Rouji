# EL-Rouji

EL-Rouji is a multilingual AI assistant interface designed for Arabic, Algerian Darija, French and English.

**Live application:** https://el-rouji-70120b.v2.appdeploy.ai/

## Current capabilities

- Assistant, research, writing, study, coding and planning modes
- Built-in task prompts and a local calculator
- Browser-local conversation history and optional account-based sync
- Research mode with source links when server-side search is configured
- Image/text analysis for PNG, JPEG, WebP, TXT, MD, CSV and JSON

PDF and Office-document analysis are not part of the current upload flow.

## Stack

- React, TypeScript and Vite
- AppDeploy-hosted backend and client SDK
- Tailwind CSS 3, PostCSS and Autoprefixer (kept to match the supported AppDeploy CSS template)
- `react-markdown`, `remark-gfm` and `mathjs`

## Repository checks

GitHub Actions runs `npm ci`, a full dependency-audit summary, a blocking production dependency audit, TypeScript checking and a Vite build. The production audit gate is `npm audit --omit=dev --audit-level=low`.

The latest full-tree npm audit run (#67) reported 3 moderate findings in development/build tooling; an earlier run reported 7 (5 high, 2 moderate). The production-only audit gate passed with zero vulnerabilities in run #67, but this does not mean the entire dependency tree is audit-free. See [the dependency audit record](docs/DEPENDENCY_AUDIT.md).

The CI build sets `EL_ROUJI_CI_BUILD=1` to use a **build-only shim** for the AppDeploy-provided `@appdeploy/client` module. That shim is not a functional substitute for hosted authentication or image processing and its output must not be deployed.

## Hosting and research configuration

The live app uses AppDeploy's real client SDK and backend runtime. Research mode requires `TAVILY_API_KEY` in secure server-side AppDeploy settings. Do not put service credentials in source files, frontend environment variables, issue reports or commits. A configured secret does not by itself prove that live search works.

A Tailwind CSS 4 migration trial was rejected by AppDeploy's current validator because the CSS entry is unsupported. The app was rolled back to last-known-good version `1792755107550` and returned to `ready`; the hosted app remains on Tailwind CSS 3.

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

## Readiness

No release tag has been created. Product QA, account/data-access review, live research verification and formal disposition of the full-tree build-tool audit findings remain outstanding.

Operational references: [next-mile readiness](docs/NEXT_MILE_READINESS.md), [QA test plan](docs/QA_TEST_PLAN.md), [operations runbook](docs/OPERATIONS_RUNBOOK.md), [architecture](docs/ARCHITECTURE.md), [integration notes](docs/INTEGRATIONS.md), [add-on roadmap](docs/ADDON_ROADMAP.md), [CI boundary](docs/CI.md), [dependency audit](docs/DEPENDENCY_AUDIT.md) and [release checklist](docs/RELEASE_CHECKLIST.md) and [security review checklist](docs/SECURITY_REVIEW.md).
