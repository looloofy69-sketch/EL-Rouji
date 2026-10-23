# Security review checklist

This is an initial threat review, not a completed security audit. Items marked "verify" require inspection/tests against the hosted backend and real account boundary.

## Assets and trust boundaries

| Asset/boundary | Threat | Required verification |
|---|---|---|
| Server-side provider credentials, including `TAVILY_API_KEY` | Credential exposure through frontend bundles, logs, errors or commits | Confirm secret is read only in backend runtime; search repository for accidental values; test errors do not echo configuration. |
| Cloud-synced conversations | Broken object-level authorization lets one user read/update/delete another user's history | With two synthetic accounts, attempt direct GET/PUT/DELETE against another account's conversation ID; server must reject every operation. |
| Browser-local history | Shared device/browser exposes prior prompts to another person | Document that local history is device/browser-scoped; verify clear-history deletion and sign-out expectations. |
| Chat/research request bodies | Overlong or malformed inputs cause memory/CPU exhaustion or expensive upstream calls | Verify server-side size/type validation, rate limiting and cost bounds; client-side checks alone are insufficient. |
| Uploaded images/text files | Oversized/malicious input reaches analysis service or crashes backend | Verify MIME/content checks, size limits, decoding errors and clear rejection; test supported formats only. |
| Calculator expressions | Expression parser is used as an execution path for arbitrary code or unbounded computation | Review allow-listed tokens/functions, evaluate limits and reject identifiers/functions outside the intended calculator set. |
| External research result/page content | Prompt injection or hostile page content influences assistant instructions | Treat retrieved page contents as untrusted evidence; verify source URLs are displayed, secrets are not sent to retrieved pages, and uncertain claims are cited. |
| Build and dependency chain | Vulnerable build tools compromise CI or release artifacts | Keep lockfile/CI checks, strict production dependency audit, full-tree audit summary and dependency triage issue. Do not claim full tree is clean while advisories remain. |
| AppDeploy source/deployment versions | Failed rollout or source drift leads to unreviewed code serving traffic | Record Git commit and AppDeploy version per release; test rollback and verify status reaches `ready`. |

## Known boundaries

- The repository's CI shim is not a real SDK implementation and must never be deployed.
- AppDeploy's current template validator rejects the tested Tailwind CSS 4 CSS entry; the live app was restored to the last-known-good Tailwind CSS 3 version.
- The latest full dependency audit (run #63) reports 3 moderate development/build-tool findings; earlier CI reported 7. The production-only dependency audit is a separate hard CI gate and passed with zero findings; it does not mean there are no build-time risks.
- This review does not certify regulatory compliance, data residency, backups, rate limiting, monitoring or any SLA.

## Minimum evidence before broad public rollout

- [ ] Complete the cross-account API boundary tests in `docs/QA_TEST_PLAN.md`.
- [ ] Verify backend input validation and useful 4xx errors across app-owned endpoints.
- [ ] Confirm conversation deletion and retention semantics with an explicit policy.
- [ ] Confirm research key behavior end-to-end without logging the key.
- [ ] Review dependency audit output and record risk acceptance/remediation in issue #9.
- [ ] Test a real AppDeploy rollback and record the prior version ID.
