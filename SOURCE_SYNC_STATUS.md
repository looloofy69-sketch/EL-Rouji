# EL-Rouji source sync

Status: deployed source imported; CI established; dependency migration candidate passes locked CI and is awaiting review/visual QA.

- Source app: `el-rouji-70120b`
- Source snapshot imported: `1792755107550`
- Target repository: https://github.com/loolooofy69-sketch/EL-Rouji
- Transferred source/config paths: `backend/index.ts`, `index.html`, `package.json`, `postcss.config.js`, `src/App.tsx`, `src/components/BuiltInTools.tsx`, `src/index.css`, `src/main.tsx`, `tailwind.config.js`, `tests/tests.json`, `tsconfig.json`, `vite.config.ts`.
- Added repository docs, security/contribution guidance, issue/PR templates, Dependabot and GitHub Actions CI.
- Fixed source type-check issues and added an npm lockfile verified with `npm ci`.
- Historical Tailwind CSS 3 audit: 7 findings (5 high, 2 moderate).
- Candidate Tailwind CSS 4.3.3 migration in PR #10: Actions run #55 passed locked install, npm audit with zero findings, TypeScript check, and Vite bundle.
- CI now includes a hard dependency-audit gate (`npm audit --audit-level=low`) and passed again on run #61.
- Static class scan found no Tailwind `@apply` or `@layer` dependency. Visual parity is still unverified.
- No secret values were committed.

## Remaining before a production release

- Merge the candidate only after review and visual QA.
- Visually verify desktop/mobile and English/French/Arabic RTL.
- Verify the actual AppDeploy hosted build and runtime; CI uses a shim for AppDeploy's injected client module.
- End-to-end test live research credentials, authentication/account isolation, conversation storage/deletion and supported attachment flows.
- Review backend authorization, validation, rate limiting, privacy/retention and operational recovery.
- No release tag has been created; the release checklist remains incomplete.

The GitHub source sync and CI branch work did not modify the live AppDeploy deployment.
