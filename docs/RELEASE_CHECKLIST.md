# Release checklist

Do not publish a version tag until the items below have been checked against the exact commit being released.

## Build and source

- [x] Current deployed source snapshot imported into GitHub.
- [x] Commit `package-lock.json`.
- [x] Verify locked install with `npm ci` in GitHub Actions.
- [x] Verify TypeScript check and Vite bundle in GitHub Actions (CI-only AppDeploy SDK shim).
- [x] Migrate the repository dependency tree to Tailwind CSS 4.3.3 and `@tailwindcss/postcss` 4.3.3 in PR #10.
- [x] Verify the candidate dependency tree has zero reported npm audit findings in Actions run #55.
- [ ] Merge PR #10 after required review and visual QA.
- [ ] Confirm build/release flow using the real AppDeploy runtime, not the CI shim.
- [ ] Visually verify responsive and RTL styling after the Tailwind 4 migration.
- [ ] Confirm tests run for changed behavior; `tests/tests.json` is an AppDeploy QA specification, not an npm test suite.

## Product checks

- [ ] Test assistant, research, writing, study, coding, planning, and built-in tools.
- [ ] Test Arabic RTL, Algerian Arabic text input, French, English, and mobile layout.
- [ ] Test supported file formats and reject unsupported/oversized uploads.
- [ ] Test conversation history, sign-in/sync, account isolation, sign-out, and deletion.
- [ ] Confirm errors are understandable and no secret values reach client logs.
- [ ] Test research mode end-to-end using a valid server-side key without exposing it.

## Security and operations

- [x] Replace the historical Tailwind CSS 3 dependency tree with the Tailwind CSS 4 candidate tree; the latest verified locked CI run reported zero npm audit findings. See `docs/DEPENDENCY_AUDIT.md`.
- [ ] Review authorization, API input validation, rate limiting, data retention, and deletion behavior.
- [ ] Verify backend secrets are stored only in secure server-side settings and rotate any credential exposed during development.
- [ ] Document known limitations and rollback procedure.
- [ ] Confirm dependency audit remains clean on the merge commit and release commit.

## Release record

- [ ] Update `CHANGELOG.md` and version metadata to reflect the actual merged release.
- [ ] Create a version tag only after the checks above pass.
- [ ] Confirm the artifact can be rebuilt from the tag.
- [ ] Record the AppDeploy deployment/version ID, Git commit, smoke-test results, and rollback target in the release record.

A passing CI build and zero npm audit findings do not substitute for product QA or a security review of application behavior.
