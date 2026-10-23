# CI build boundary

GitHub Actions:
1. Installs exactly from the committed lockfile with `npm ci`.
2. Prints a full dependency-tree npm audit summary for triage.
3. Fails if a production dependency has a low-or-higher npm audit finding (`npm audit --omit=dev --audit-level=low`).
4. Runs `npm run typecheck`.
5. Builds the frontend with Vite.

## AppDeploy client shim

The hosted runtime injects its own `@appdeploy/client` module, which is not an ordinary npm dependency in this repository. For repository CI only, `EL_ROUJI_CI_BUILD=1` makes Vite alias this module to `ci/appdeploy-client-shim.ts`. The shim exists only to type-check and bundle the source outside AppDeploy.

**Never deploy the CI-shim bundle.** It does not implement hosted authentication or the actual image-resize behavior.

## Audit semantics

The complete dependency audit currently reports advisories in development/build tooling. The production dependency check is intentionally blocking; the full-tree audit remains visible but informational so a documented upstream-no-fix build-tool advisory does not prevent every code change. This is a risk-triage compromise, not a claim that the full dependency tree has zero findings. See `docs/DEPENDENCY_AUDIT.md`.

## AppDeploy compatibility

AppDeploy's current validator rejected Tailwind CSS 4's `@import "tailwindcss";` entry and requires the Tailwind CSS 3 directive form. The Tailwind 4 branch/PR was closed without merge and the live app restored to snapshot `1792755107550`. Revisit migration only after AppDeploy documents or validates an equivalent supported CSS entry.

A green CI job proves the repository can install, type-check and bundle under its CI setup. It does not prove hosted service behavior or visual parity.
