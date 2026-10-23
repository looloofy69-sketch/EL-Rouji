# Changelog

Notable changes to EL-Rouji will be recorded here.

## Unreleased

- Imported the current deployed AppDeploy source snapshot into GitHub.
- Added README, source import notes, architecture/integration docs, contribution/security guidance, issue and pull-request templates, and an add-on roadmap.
- Added GitHub Actions CI for locked dependency install, TypeScript checking, a CI-only Vite bundle, and dependency audit reporting.
- Added the first committed npm lockfile and verified `npm ci` in CI.
- Fixed unused imports/constants and completed the AppDeploy client type declarations needed for TypeScript checks.
- Migrated the candidate dependency tree to Tailwind CSS 4.3.3; the locked CI run reported zero npm audit findings.
- Added next-mile readiness, QA test plan, operations/rollback runbook, and release gates.
- Added a CI gate that fails when npm audit reports any low-or-higher severity finding.
- Documented that real AppDeploy behavior, UI visual parity and full application security are separate verification gates.
