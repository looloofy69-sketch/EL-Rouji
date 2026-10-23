# Dependency audit record

## Historical finding

On October 23, 2026, CI against the Tailwind CSS 3 dependency tree reported **7 npm advisories: 5 high, 2 moderate, 0 critical**. The dependency paths were primarily Tailwind build tooling: `braces`, `chokidar`, `fast-glob`, `micromatch`, `postcss-nested`, and `postcss-selector-parser`.

This is a historical result for the former Tailwind CSS 3 lockfile. It is not an outstanding advisory count for the candidate dependency tree in PR #10.

## Migration result

The branch `security/tailwind4-audit-fix` upgrades Tailwind CSS to **4.3.3**, uses `@tailwindcss/postcss` 4.3.3, switches the CSS entry to Tailwind 4's import form and explicitly loads the minimal existing config through `@config`.

GitHub Actions run **#55** on October 23, 2026, verified the committed migration lockfile using a clean locked install. The run reported:

- `npm ci`: passed.
- `npm audit`: **0 info, 0 low, 0 moderate, 0 high, 0 critical**.
- TypeScript check: passed.
- Vite frontend bundle: passed.

The Vite build uses the CI-only `@appdeploy/client` shim. It does not deploy or test AppDeploy's hosted services. The candidate lockfile contains 266 package entries versus 293 in the former lockfile.

## Code compatibility inspection

The interface uses bespoke CSS class names rather than Tailwind utility classes, and a static source inspection found no `@apply` directives or `@layer` usage in `src/index.css`. The stylesheet uses the Tailwind 4 import and explicitly loads the existing configuration file.

This lowers the amount of application-specific Tailwind syntax that needed migration. It does not prove visual parity: Tailwind's global reset and generated CSS can change across major versions, so desktop, mobile and Arabic RTL layouts still need visual review before the migration is treated as product-verified.

## Required follow-up

- [ ] Visually verify the candidate application at desktop and mobile sizes and for English, French, Arabic/RTL.
- [ ] Confirm the real AppDeploy hosted build/runtime independently; never deploy the CI-shim output.
- [ ] Rerun CI and `npm audit` after merge and again at release.
- [ ] Complete the separate application security review covering authorization, input validation, conversation storage/deletion, and secret handling.

A clean npm audit is evidence about the installed dependency tree, not a full application security audit.
