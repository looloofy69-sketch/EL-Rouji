# Release checklist

Do not publish a version tag until the items below have been checked against the exact commit being released.

## Build and source

- [x] Current deployed source snapshot imported into GitHub.
- [x] Commit `package-lock.json`.
- [x] Verify locked install with `npm ci` in GitHub Actions.
- [x] Verify TypeScript check and Vite bundle in GitHub Actions (CI-only AppDeploy SDK shim).
- [ ] Confirm build/release flow using the real AppDeploy runtime, not the CI shim.
- [ ] Confirm tests run for the changed code; current `tests/tests.json` is not an npm test suite.

## Product checks

- [ ] Test assistant, research, writing, study, coding, planning, and built-in tools.
- [ ] Test Arabic RTL, Algerian Arabic text input, French, English, and mobile layout.
- [ ] Test supported file formats and reject unsupported/oversized uploads.
- [ ] Test conversation history, sign-in/sync, account isolation, and sign-out.
- [ ] Confirm errors are understandable and no secret values reach client logs.

## Security and operations

- [ ] Review and remediate or formally accept the 7 npm audit advisories (5 high, 2 moderate) listed in `docs/DEPENDENCY_AUDIT.md`.
- [ ] Review authorization, API input validation, rate limiting, data retention, and deletion behavior.
- [ ] Verify backend secrets and rotate any credential exposed during development.
- [ ] Verify research search end-to-end with a valid key.
- [ ] Document known limitations and rollback approach.

## Release record

- [ ] Update `CHANGELOG.md` and version metadata.
- [ ] Create a version tag only after the checks above pass.
- [ ] Confirm the artifact can be rebuilt from the tag.
