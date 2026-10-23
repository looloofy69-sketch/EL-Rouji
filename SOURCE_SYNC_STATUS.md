# EL-Rouji source sync

Status: deployed source imported; repository CI established; AppDeploy-compatible Tailwind CSS 3 remains the active baseline.

- Source app: `el-rouji-70120b`
- Source snapshot: `1792755107550`
- Target repository: https://github.com/loolooofy69-sketch/EL-Rouji
- Transferred source/config paths: `backend/index.ts`, `index.html`, `package.json`, `postcss.config.js`, `src/App.tsx`, `src/components/BuiltInTools.tsx`, `src/index.css`, `src/main.tsx`, `tailwind.config.js`, `tests/tests.json`, `tsconfig.json`, `vite.config.ts`.
- GitHub Actions includes `npm ci`, full-tree audit summary, production audit gate, TypeScript check and a Vite build using the CI-only AppDeploy SDK shim.
- No secret values were committed.

## Tailwind CSS 4 compatibility attempt

- Tailwind 4.3.3 passed the GitHub-only npm audit, typecheck and Vite bundle.
- Applying its `@import "tailwindcss";` entry to the actual AppDeploy app failed platform validation, which requires the Tailwind 3 directive form.
- The failed attempt was restored to AppDeploy version `1792755107550`; status was subsequently verified as `ready`.
- PR #10 was closed without merge. The live app remains on the AppDeploy-compatible Tailwind CSS 3 baseline.

## Still outstanding

- Verify the production-only npm audit gate and GitHub Actions on this maintenance branch and its merge commit.
- Latest full dependency-tree audit run #63 reported 3 moderate development/build-tool findings; earlier run #38 reported 7 (5 high, 2 moderate). The production-only audit gate returned zero vulnerabilities. Review and explicitly disposition the full-tree findings in issue #9.
- Complete hosted QA for research, auth/account isolation, history deletion, attachments and multilingual mobile/RTL rendering.
- Review backend authorization, input validation, rate limiting, privacy/retention and rollback procedure.
- No release tag has been created; the release checklist remains incomplete.
