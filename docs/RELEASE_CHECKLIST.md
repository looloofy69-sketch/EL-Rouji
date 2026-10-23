# Release checklist

Do not publish a version tag until the items below have been checked against the exact commit being released.

## Build and source

- [x] Current deployed source snapshot imported into GitHub.
- [x] Commit `package-lock.json`.
- [x] Verify locked install with `npm ci` in GitHub Actions.
- [x] Verify TypeScript check and Vite bundle in GitHub Actions (CI-only AppDeploy SDK shim).
- [ ] Verify the production dependency audit gate on the current merge commit (`npm audit --omit=dev --audit-level=low`).
- [x] Keep AppDeploy-compatible Tailwind CSS 3 entry syntax; the Tailwind CSS 4 trial was rejected by the hosted validator and rolled back.
- [ ] Confirm build/release flow using the real AppDeploy runtime, not the CI shim.
- [ ] Confirm tests run for changed code; `tests/tests.json` is an AppDeploy QA specification, not an npm test suite.

## Product checks

- [ ] Test assistant, research, writing, study, coding, planning, and built-in tools.
- [ ] Test Arabic RTL, Algerian Arabic text input, French, English, and mobile layout.
- [ ] Test supported file formats and reject unsupported/oversized uploads.
- [ ] Test conversation history, sign-in/sync, account isolation, sign-out, and deletion.
- [ ] Confirm errors are understandable and no secret values reach client logs.
- [ ] Verify research end-to-end with a valid server-side key and source links.

## Security and operations

- [ ] Review/accept the unresolved full-tree development-tool audit findings documented in `docs/DEPENDENCY_AUDIT.md`; do not treat the production-only gate as a full audit.
- [ ] Review authorization, API input validation, rate limiting, data retention and deletion behavior.
- [ ] Verify backend secrets are stored only in secure server-side settings and rotate any credential exposed during development.
- [ ] Document known limitations and the tested rollback procedure.
- [ ] Confirm full and production-only audits on the exact release commit.

## Release record

- [ ] Update `CHANGELOG.md` and version metadata to reflect the actual release.
- [ ] Create a version tag only after the checks above pass.
- [ ] Confirm the artifact can be rebuilt from the tag.
- [ ] Record AppDeploy version ID, Git commit, smoke-test results and rollback target.
