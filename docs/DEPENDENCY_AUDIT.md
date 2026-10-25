# Dependency audit record

**Current baseline:** AppDeploy-compatible Tailwind CSS 3, PostCSS and Autoprefixer.

## Latest observed audit

GitHub Actions main run **#94** on October 24, 2026 reconfirmed **3 moderate, 0 high, 0 critical** advisory entries in the full dependency tree (the prior documented baseline was run #81). The latest reported packages were:

- `postcss-nested` (moderate; reported via `postcss-selector-parser`)
- `postcss-selector-parser` (moderate)
- `tailwindcss` (moderate; inherited via the two entries above)

The production-only audit in the same run (`npm audit --omit=dev --audit-level=low`) returned **0 vulnerabilities** and passed the blocking CI step.

An earlier CI run (#38) reported 7 advisories (5 high, 2 moderate). The count and severity returned by npm's audit metadata can change as advisory feeds are updated even when the package lockfile does not change. Run #94 is the latest rechecked result for the current Tailwind 3 lockfile, not a claim that the full dependency tree has no findings. See the [CI run log](https://github.com/looloofy69-sketch/EL-Rouji/actions/runs/40099475237).

## Findings and disposition

| Finding | Current treatment |
|---|---|
| `postcss-selector-parser` GHSA-rj75-hqrm-r3gf / CVE-2026-104844 | The lockfile resolves version 6.1.5. Upstream release notes state the quadratic-complexity fix was backported to the maintained 6.x line, despite older advisory metadata listing versions before 7.1.6 as affected. npm audit still reports the older range; treat this as an advisory metadata mismatch needing review, not silently ignored. |
| `postcss-nested` | Transitive Tailwind CSS 3 build dependency; currently reported because of the selector-parser path. Evaluate compatible remediation when available; do not force a major Tailwind version unsupported by AppDeploy. |
| `tailwindcss` | Tailwind CSS 3.4.19 is reported through its dependency tree. npm suggests Tailwind CSS 4.3.3 as the fix, but the AppDeploy validator rejected Tailwind 4's canonical CSS import entry. |
| `braces` GHSA-vfj7-8cjw-p6xm / CVE-2026-93687 | The lockfile contains `braces@3.0.3` as a development dependency. The GitHub advisory still lists no patched release. The upstream maintainer disputes the claimed attack conditions and points to the documented maximum pattern length. This advisory was present in an earlier npm audit report but not in the latest run #67 summary. Keep it in security triage rather than claiming a confirmed fix. |

## Regression guard

CI runs `scripts/check-dependency-security.mjs` after `npm ci`. It verifies that every locked `postcss-selector-parser` instance is at least 6.1.5 on the maintained 6.x line (the backported fix) or 7.1.6 on the 7.x line, and fails if the locked Tailwind CSS major version leaves 3. This protects the known AppDeploy compatibility boundary while the npm advisory metadata is pending correction; it does **not** hide or suppress `npm audit` findings.

## AppDeploy compatibility constraint

Tailwind CSS 4.3.3 plus `@tailwindcss/postcss` passed a GitHub-only npm audit, TypeScript check and Vite bundle. When the same CSS change was applied to the real AppDeploy app, the platform validator rejected `@import "tailwindcss";` and required the Tailwind CSS 3 directive form. The failed attempt was rolled back to last-known-good AppDeploy version `1792755107550`, and the app returned to `ready`. PR #10 was closed without merge.

Do not deploy the CI-only SDK shim or change the hosted CSS entry to Tailwind 4 until AppDeploy supports the required syntax.

## CI policy

- Keep the full-tree npm audit summary visible.
- Fail CI when production dependencies report a low-or-higher finding using `npm audit --omit=dev --audit-level=low`.
- Keep unresolved development/build-tool advisories tracked in [issue #9](https://github.com/loolooofy69-sketch/EL-Rouji/issues/9).
- Do not state that the entire dependency tree is audit-free while the full audit reports findings.

References:
- GitHub advisory for `braces`: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm
- Upstream discussion of the `braces` finding: https://github.com/micromatch/braces/issues/70
- `postcss-selector-parser` releases, including the 6.1.5 backport: https://github.com/postcss/postcss-selector-parser/releases
- GitHub advisory for selector-parser complexity: https://github.com/advisories/GHSA-rj75-hqrm-r3gf

A clean production-only audit is not a full dependency or application security audit.
