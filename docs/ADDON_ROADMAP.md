# Add-on roadmap

This is a proposal for sequencing future work, not a statement that these items already exist. Stabilizing the imported source and confirming production behavior take priority over adding features.

## Foundation — current priority

- [x] Import the deployed source snapshot into GitHub.
- [x] Commit `package-lock.json` and verify locked install.
- [x] Establish TypeScript and Vite CI checks with a CI-only AppDeploy SDK shim.
- [x] Add a blocking production dependency audit (`npm audit --omit=dev --audit-level=low`) while retaining the full development-tree audit output.
- [ ] Review/accept the full-tree build-tool advisories; see `docs/DEPENDENCY_AUDIT.md` and issue #9.
- [ ] Complete desktop/mobile smoke testing for Arabic RTL, French and English.
- [ ] Review authentication, authorization, attachment validation, privacy, retention/deletion and calculator parsing.

## Reliability and usability

- [ ] Add automated tests for API validation and important frontend flows.
- [ ] Verify research error/retry behavior using the real hosted secret configuration.
- [ ] Add accessibility checks for keyboard focus, labels, contrast and screen-reader behavior.
- [ ] Reduce the Vite JavaScript bundle warning (about 1.12 MB minified in CI) by measuring bundle composition before applying code splitting.
- [ ] Update GitHub Actions action versions to avoid the Node 20 deprecation warning reported by the current runner; confirm supported versions before changing them.
- [ ] Document error logging/retention and a supported rollback process.

## Platform constraints

- AppDeploy's current template validator requires Tailwind CSS 3 directives. A Tailwind CSS 4 trial using `@import "tailwindcss";` was rejected and rolled back; see issue #9/closed PR #10.
- The CI shim only supports source-build verification. It must never be deployed.
- CI green and a clean production-only audit are not a full application security audit.

## Potential extensions — not implemented

- Voice input/output and PWA support.
- PDF and Office document formats.
- Additional integrations and scheduled workflows.
- Opt-in evaluation data that contains no private conversation data.

Each extension needs a scoped issue, relevant security/privacy review, acceptance criteria and tests before it is treated as implemented.
