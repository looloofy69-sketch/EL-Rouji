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

The latest rechecked full-tree npm audit on main (CI run #94, October 24, 2026) reported 3 moderate, 0 high and 0 critical findings in development/build tooling. The production-only audit gate passed with zero vulnerabilities in the same run. See the [run log](https://github.com/looloofy69-sketch/EL-Rouji/actions/runs/40099475237). CI now also guards the patched PostCSS selector-parser version floor and the AppDeploy-required Tailwind CSS 3 major version. npm audit still reports the moderate entries because its advisory metadata has not yet acknowledged the selector-parser 6.1.5 backport; this is not described as an audit-free dependency tree. See [the dependency audit record](docs/DEPENDENCY_AUDIT.md).

The CI build sets `EL_ROUJI_CI_BUILD=1` to use a **build-only shim** for the AppDeploy-provided `@appdeploy/client` module. That shim is not a functional substitute for hosted authentication or image processing and its output must not be deployed.

## Hosting and research configuration

GitHub `main` now rejects direct HTTP(S) page URLs in Research mode before any remote fetch. The source guard and URL-safety regression tests passed CI, but this change is **not confirmed deployed** to the live AppDeploy app. The last documented verified AppDeploy snapshot remains `1792755107550`; until a controlled deployment and live tests are recorded, assume the hosted app may still allow direct page scraping. Search-based research remains available in source when `TAVILY_API_KEY` is configured.


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

Project-wide repository boundaries and delivery gates: [EL-Rouji ecosystem map](docs/EL_ROUJI_ECOSYSTEM.md).

Operational references: [next-mile readiness](docs/NEXT_MILE_READINESS.md), [QA test plan](docs/QA_TEST_PLAN.md), [operations runbook](docs/OPERATIONS_RUNBOOK.md), [architecture](docs/ARCHITECTURE.md), [integration notes](docs/INTEGRATIONS.md), [add-on roadmap](docs/ADDON_ROADMAP.md), [Algeria-centric engine roadmap](docs/ALGERIA_CENTRIC_ENGINE_ROADMAP.md), [CI boundary](docs/CI.md), [dependency audit](docs/DEPENDENCY_AUDIT.md), [release checklist](docs/RELEASE_CHECKLIST.md) and [security review checklist](docs/SECURITY_REVIEW.md).
