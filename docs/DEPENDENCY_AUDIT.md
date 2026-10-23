# Dependency audit record

**Current dependency baseline:** Tailwind CSS 3, PostCSS and Autoprefixer, matching the last-known-good hosted AppDeploy source snapshot.

## Observed full-tree result

The October 23, 2026 CI audit reported **7 advisories: 5 high, 2 moderate, 0 critical** across the dependency tree. The reported paths are centered on build-time dependencies pulled in through Tailwind CSS 3: `braces`, `chokidar`, `fast-glob`, `micromatch`, `postcss-nested`, `postcss-selector-parser`, and the Tailwind package path itself.

This is **not zero findings across the full dependency tree**. CI will keep printing the full audit summary. A separate hard CI gate now runs `npm audit --omit=dev --audit-level=low` so a new low-or-higher advisory in production dependencies fails CI.

## Why Tailwind CSS 4 was not merged

Tailwind CSS 4.3.3 plus `@tailwindcss/postcss` produced a clean npm audit, TypeScript check and Vite bundle in GitHub Actions. But the real AppDeploy validator rejected `@import "tailwindcss";` and required the existing Tailwind 3 directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

The attempted AppDeploy deployment was rolled back to last-known-good version `1792755107550`; status returned to `ready`. PR #10 was closed without merge. Its green GitHub build was therefore not evidence of AppDeploy compatibility.

## Findings and disposition

| Finding | Current treatment |
|---|---|
| `braces` GHSA-vfj7-8cjw-p6xm / CVE-2026-93687 | The GitHub advisory lists versions through 3.0.3 as affected and no patched version. It concerns deeply nested brace patterns and stack exhaustion. The upstream maintainer disputes the assessment and argues the documented input-length bound limits the claimed depth. Keep this as an unresolved build-tool advisory rather than calling it fixed. |
| `postcss-selector-parser` GHSA-rj75-hqrm-r3gf / CVE-2026-104844 | The dependency tree resolves 6.1.5. The upstream 6.1.5 release notes explicitly say the quadratic-complexity fix was backported to the maintained 6.x line, even though older advisory metadata lists versions before 7.1.6 as affected. The npm audit may therefore overstate this specific subdependency finding until advisory metadata is reconciled. |
| `chokidar`, `fast-glob`, `micromatch`, `postcss-nested`, Tailwind CSS | Transitive paths in the build-tool dependency tree. Retain the full audit output and re-evaluate after each dependency/lockfile change. Do not upgrade to a major Tailwind version until the AppDeploy CSS entry is supported. |

References:
- GitHub advisory for `braces`: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm
- Upstream discussion of the `braces` finding: https://github.com/micromatch/braces/issues/70
- `postcss-selector-parser` releases, including the 6.1.5 backport: https://github.com/postcss/postcss-selector-parser/releases
- GitHub advisory for selector parser complexity: https://github.com/advisories/GHSA-rj75-hqrm-r3gf

## Risk boundaries

The findings are in packages classified as development/build dependencies in the committed lockfile. That reduces direct production-runtime exposure, but **does not mean build-time risk is zero**: these packages are executed during installs, tooling and builds. Keep CI's production dependency audit as a hard gate and the full-tree audit visible. Do not silently suppress the full-tree advisory output.

The remaining issue #9 is a decision/review item for development-tool findings and AppDeploy's supported Tailwind upgrade path. The repository owner should close it only after the remaining build-tool risk is accepted or upstream fixes/advisory corrections are available.

A clean production-only audit is not a full dependency or application security audit.
