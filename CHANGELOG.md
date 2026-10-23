# Changelog

Notable changes to EL-Rouji will be recorded here.

## Unreleased

- Imported the deployed AppDeploy source snapshot into GitHub.
- Added README, architecture/integration docs, contribution/security guidance, issue/PR templates, Dependabot, CI and the CI-only AppDeploy SDK shim.
- Added the npm lockfile and verified `npm ci`, TypeScript and Vite bundling in GitHub Actions.
- Added a blocking production dependency audit while preserving full development-tree audit results for review.
- Added the next-mile readiness matrix, hosted QA plan, operations/rollback runbook and release checklist.
- Investigated Tailwind CSS 4.3.3; GitHub-only build passed but AppDeploy's validator rejected the CSS import. The failed trial was rolled back to version `1792755107550`; PR #10 was closed without merge.
- Documented the remaining 7-finding full-tree development/build-tool audit (5 high, 2 moderate) and platform compatibility constraints. No release tag has been created.
