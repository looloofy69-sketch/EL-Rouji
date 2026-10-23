# Dependency audit record

## Earlier finding

On October 23, 2026, CI against the Tailwind CSS 3 dependency tree reported **7 npm advisories: 5 high, 2 moderate, 0 critical**. The dependency paths were primarily Tailwind build tooling: `braces`, `chokidar`, `fast-glob`, `micromatch`, `postcss-nested`, and `postcss-selector-parser`.

The upstream `postcss-selector-parser` 6.1.5 release backports a fix for CVE-2026-104844 in the legacy v6 line, even though the advisory's range still says versions before 7.1.6 are affected. The old Tailwind 3 audit also included the `braces` stack-exhaustion advisory for which the GitHub advisory database listed no patched release at that time.

## Migration trial result

The separate migration branch `security/tailwind4-audit-fix` upgrades Tailwind CSS to **4.3.3**, uses `@tailwindcss/postcss` 4.3.3, switches the CSS entry to Tailwind 4's import form, and regenerates `package-lock.json`.

GitHub Actions run **#48** on October 23, 2026, reported:

- `npm audit`: **0 info, 0 low, 0 moderate, 0 high, 0 critical**.
- TypeScript check: passed.
- Vite frontend bundle: passed.
- Build used the CI-only `@appdeploy/client` shim. It did not deploy or test AppDeploy's hosted services.

The new lockfile has 266 package entries (versus 293 on the prior Tailwind 3 lockfile). This branch-level test indicates the specific npm audit findings that blocked progress are removed from the resolved dependency tree.

## Remaining verification

- [ ] Review the rendered application at desktop and mobile widths, with English/French and Arabic RTL layouts, before merging the CSS migration.
- [ ] Verify the production AppDeploy build/runtime independently; do not deploy the CI-shim output.
- [ ] Re-run CI after any review adjustments.
- [ ] Complete the separate application security review covering authorization, input validation, conversation storage/deletion, and secret handling.

A clean npm audit is evidence about the installed dependency tree, not a full application security audit.
