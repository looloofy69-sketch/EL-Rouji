# EL-Rouji Ecosystem — Repository Boundaries and Readiness

**Snapshot date:** 25 October 2026  
**Purpose:** one source-of-truth map for the EL-Rouji project repositories.

This document excludes unrelated projects. Repository contents and CI were inspected for this snapshot; a green GitHub build is not proof of successful hosted end-to-end behavior.

## Repository map

| Component | Source of truth | What exists now | What is not yet established |
|---|---|---|---|
| Core application | [EL-Rouji](https://github.com/looloofy69-sketch/EL-Rouji) | React/TypeScript/Vite client, AppDeploy backend handlers, CI, API and operations documentation | Complete hosted QA, account-isolation proof, full application security review, and final release decision |
| MCP adapter | [Mcps-EL-Rouji-](https://github.com/looloofy69-sketch/Mcps-EL-Rouji-) | Initial executable Python MCP adapter merged via [PR #1](https://github.com/looloofy69-sketch/Mcps-EL-Rouji-/pull/1); its CI passed; health is read-only and generation tools are opt-in | Local MCP-host verification, live API smoke tests, and server-side quota/abuse-control review |
| Jobs and scheduling | [EL-Rouji-jobs](https://github.com/looloofy69-sketch/EL-Rouji-jobs) | Product/API/security specs plus merged [ADR-001](https://github.com/looloofy69-sketch/EL-Rouji-jobs/blob/main/docs/ADR-001-APPDEPLOY-JOB-RUNTIME.md) proposing AppDeploy-native cron/database for a low-volume MVP | No executable queue, cron configuration, durable job workflow, worker, or job API; owner model/use case and bounded queue access still need approval |
| Dataset governance | [EL-Rouji-datasetes](https://github.com/looloofy69-sketch/EL-Rouji-datasetes) | Templates plus a merged standard-library JSONL/manifest validator, unit tests, and GitHub Actions CI | No production dataset; no dataset has been claimed licensed, consented, privacy-reviewed, or approved for training |
| E-commerce | [E-commerce-EL-Rouji-](https://github.com/looloofy69-sketch/E-commerce-EL-Rouji-) | Requirements/docs plus merged [JSON Schema contracts and CI](https://github.com/looloofy69-sketch/E-commerce-EL-Rouji-/tree/main/schemas) for product, checkout request/response, and error envelope | No running storefront/backend, database, catalog/checkout endpoint, payment/shipping integration, or selected provider/business model |

## Core application status

Current source uses React, TypeScript, Vite, Tailwind CSS 3, and an AppDeploy backend. The documented routes include health, chat, research, image/document analysis, and account-protected conversation sync. Direct HTTP(S) page scraping has been removed from GitHub main until the hosted fetcher's destination/redirect protections are verified; query-based search remains available. Core main commit `e08fbc8` passed [CI run #94](https://github.com/looloofy69-sketch/EL-Rouji/actions/runs/40099475237), including locked install, dependency audit summary (3 moderate, 0 high/critical), production-only audit (0), URL-safety regression tests, typecheck and frontend build with the CI-only shim. The live AppDeploy version has not been updated or validated after these changes. The full dependency-tree audit reports three moderate build-tool advisory entries, while the production-only audit reports zero. A clean production-only audit is not a clean full dependency tree, and the source change has not been deployed to AppDeploy.

Open release blockers are tracked in [Next-mile readiness](NEXT_MILE_READINESS.md), [QA plan](QA_TEST_PLAN.md), [security review](SECURITY_REVIEW.md), [dependency audit](DEPENDENCY_AUDIT.md), the [Algeria-centric engine roadmap](ALGERIA_CENTRIC_ENGINE_ROADMAP.md), [Issue #9](https://github.com/looloofy69-sketch/EL-Rouji/issues/9), and [Issue #13](https://github.com/looloofy69-sketch/EL-Rouji/issues/13). Do not create a release tag until the release checklist is supported by test evidence and explicit risk decisions.

The open Dependabot changes are separate proposals, not automatic approval to upgrade. Major changes must be evaluated against the actual AppDeploy build boundary. Tailwind CSS 4 already failed the hosted platform's CSS validation in an earlier trial; keep Tailwind CSS 3 until a compatible hosted path is demonstrated.

## Integration rules

1. **Core API ownership:** only the core repository defines the existing application API. Clients and adapters must not invent new endpoints or assume undocumented behavior.
2. **MCP is a client adapter:** its generation tools remain disabled by default. Local opt-in does not provide authentication, per-user quotas, or rate limiting on the hosted backend.
3. **Jobs are not enabled by Planning mode:** no recurring execution should be implied until durable storage, identity ownership, idempotency, retry, cancellation, schedule semantics, and operational controls have been implemented and tested.
4. **Datasets are governed assets:** validator success means structural integrity only. Licensing, consent, personal-data assessment, sensitive-data review, source provenance, and intended use require human review.
5. **Commerce is separate from core assistant APIs:** do not use production orders/customer data or implement payment behavior before the business model, market, currency, provider eligibility, privacy, and reconciliation requirements are chosen.
6. **No secrets in source:** deployment credentials and provider keys belong in secret storage, not in GitHub files, prompts, or test fixtures.

## Delivery order and exit gates

### Gate 1 — Core reliability and security
- Run live health and synthetic end-to-end tests against the actual hosted version.
- Verify each API response path and supported attachment type.
- Test sync/read/write/delete with two synthetic accounts and prove cross-account isolation.
- Review input limits, URL-fetch restrictions, abuse/rate controls, data retention/deletion, and error/log exposure.
- Resolve or explicitly accept the full dependency-tree advisory findings and disposition open dependency PRs.
- Record the tested deployment version and rollback target.

### Gate 2 — MCP adapter
- Merge only after CI passes.
- Start it through a real MCP host and verify tool discovery and health.
- Keep generation disabled for the first integration smoke test.
- Test timeout, malformed response, unavailable service, and oversized response behavior.
- Enable generation only after the endpoint cost and abuse-control decision has been recorded.

### Gate 3 — Jobs service decision
The merged jobs ADR identifies AppDeploy cron/database as a candidate runtime for a low-volume MVP; it is not approved implementation. Confirm the first use case, owner model, and bounded due-job selection strategy, then define allow-listed job types, state machine, idempotency, quotas, retries, retention, and monitoring. Only then build one authenticated single-shot job end to end. Recurring schedules come later, after time-zone/DST and missed-run semantics are accepted.

### Gate 4 — Dataset evaluation
- Add a small synthetic-only evaluation set with source references and explicit rubrics.
- Validate JSONL structure, unique IDs, schema version, record counts, and SHA-256 before releases.
- Add a reviewed quality report and compare evaluations before and after application changes.
- Do not add scraped, private, or user-submitted content without a documented legal/privacy approval path.

### Gate 5 — Commerce decisions and implementation
- Treat the merged JSON Schemas as draft interface contracts, not live API enforcement; add server-side validation and contract tests once a runtime is selected.
- Choose merchant vs marketplace, initial scope, supported languages/currency, identity and guest checkout requirements.
- Validate local payment-provider eligibility and terms, shipping/fulfillment, tax/invoice, returns/refunds, and reconciliation.
- Only then select the stack and implement catalog/cart/order/payment workflows with idempotency, server-calculated amounts, access-control tests, and test-provider evidence.

## Status language

Use these terms consistently:
- **Implemented:** source code exists.
- **CI verified:** a specific automated run passed.
- **Hosted verified:** the exact deployed artifact passed a live test.
- **Approved:** the named owner accepted the release, privacy, licensing, or risk decision.
- **Planned:** documented only; it is not an operational capability.

No SLA, complete security certification, production scheduler, production dataset, or commerce payment flow is asserted by this ecosystem snapshot.
