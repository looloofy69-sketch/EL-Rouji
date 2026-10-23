# EL-Rouji source sync

Status: deployed source imported and repository CI checks established.

- Source app: `el-rouji-70120b`
- Source snapshot: `1792755107550`
- Target repository: https://github.com/looloofy69-sketch/EL-Rouji
- Transferred source/config paths: `backend/index.ts`, `index.html`, `package.json`, `postcss.config.js`, `src/App.tsx`, `src/components/BuiltInTools.tsx`, `src/index.css`, `src/main.tsx`, `tailwind.config.js`, `tests/tests.json`, `tsconfig.json`, `vite.config.ts`.
- Added repository files: documentation, security/contribution guidance, issue/PR templates, Dependabot, GitHub Actions CI, and a CI-only AppDeploy SDK shim.
- Added `package-lock.json` from the CI runner and verified it with a successful `npm ci` workflow.
- GitHub Actions run #38 succeeded: locked install, dependency-audit summary, TypeScript check, and Vite production bundle. The Vite step used the CI-only shim, not the hosted AppDeploy SDK.
- No secret values were committed.

## Still outstanding

- npm audit reported 7 advisories (5 high, 2 moderate) in the Tailwind CSS 3 build-tool dependency tree; see `docs/DEPENDENCY_AUDIT.md`.
- End-to-end behavior of hosted research/search credentials has not been verified by this source-sync operation.
- Hosted authentication, account isolation, conversation data retention/deletion, attachment handling, and production security controls still need dedicated testing.
- No release tag has been created; the release checklist remains incomplete.

The source synchronization did not change the live AppDeploy deployment.
