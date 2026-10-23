# Dependency audit record

**Observed:** October 23, 2026, via `npm audit --json` in GitHub Actions after `npm ci`.

The report counted **7 advisories: 5 high, 2 moderate, 0 critical**. The listed package tree is centered on development/build tooling:

| Package | Reported severity | Reported issue / note |
|---|---|---|
| `tailwindcss` | High | Current Tailwind CSS 3 range has advisories; npm suggested Tailwind CSS 4.3.3 as a fix, which is a major-version migration. |
| `braces` | High | Stack-exhaustion denial of service via deeply nested patterns. |
| `chokidar` | High | Transitive dependency reported through the Tailwind CSS 3 dependency tree. |
| `fast-glob` | High | Advisory reported through `micromatch`; npm reported an available fix. |
| `micromatch` | High | Transitive pattern-matching dependency in the reported tree. |
| `postcss-nested` | Moderate | Advisory reported through `postcss-selector-parser`; npm reported an available fix. |
| `postcss-selector-parser` | Moderate | Quadratic-complexity selector parsing can cause CPU exhaustion. |

These advisories arose from the dependency/build-tool tree in the CI environment. The audit output did not establish that the listed dependencies are exposed to end users at runtime; this should not be interpreted as proof of zero runtime risk either.

Tracking issue: https://github.com/looloofy69-sketch/EL-Rouji/issues/9

## Recommended handling

- Keep the current audit result visible in CI; it is informational/non-blocking at present.
- Review a Tailwind CSS 4 migration separately because the application uses Tailwind CSS 3 configuration/CSS conventions. Run visual regression checks on RTL, responsive layout, and custom styles before merging any major-version migration.
- Apply compatible transitive fixes where possible, regenerate the lockfile, and rerun the audit.
- Do not create a release tag until the remaining advisories have been remediated or explicitly risk-accepted.

No package was automatically upgraded to Tailwind CSS 4 as part of the initial repository setup.
