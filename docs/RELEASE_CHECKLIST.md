# Release checklist

Do not publish a version tag until the items below have been checked against the exact commit being released.

## Build and source

- [ ] Repository clean-install succeeds using `npm ci` and committed lockfile.
- [ ] GitHub Actions build passes on the release commit.
- [ ] TypeScript checks and automated tests run where configured.
- [ ] Build output is produced from repository source, not an untracked local copy.

## Product checks

- [ ] Test assistant, research, writing, study, coding, planning, and built-in tools.
- [ ] Test Arabic RTL, Algerian Arabic text input, French, English, and mobile layout.
- [ ] Test supported file formats and reject unsupported/oversized uploads.
- [ ] Test conversation history, sign-in/sync, account isolation, and sign-out.
- [ ] Confirm errors are understandable and no secret values reach client logs.

## Security and operations

- [ ] Verify backend secrets and rotate any credential exposed during development.
- [ ] Review dependencies, authorization, API input validation, rate limiting, and data retention.
- [ ] Verify research search end-to-end with a valid key.
- [ ] Document known limitations and rollback approach.

## Release record

- [ ] Update `CHANGELOG.md` and version metadata.
- [ ] Create a version tag only after the checks above pass.
- [ ] Confirm the artifact can be rebuilt from the tag.