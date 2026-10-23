# Add-on roadmap

This is a proposal for sequencing future work, not a statement that these items already exist. The first priority is to stabilize and verify the imported application before expanding scope.

## Foundation — current priority

- [ ] Generate and commit `package-lock.json` from a clean install.
- [ ] Confirm the GitHub Actions build runs successfully.
- [ ] Add automated tests for API validation and important frontend flows.
- [ ] Review authentication, authorization, attachment validation, privacy, and calculator parsing.
- [ ] Test Arabic right-to-left layout, French/English UI, mobile layout, and conversation sync.

## Reliability and usability

- [ ] Add tested error/retry behavior for research and attachment analysis.
- [ ] Add accessibility checks for keyboard focus, labels, contrast, and screen-reader behavior.
- [ ] Document retention and deletion behavior for local and account-synced conversations.
- [ ] Add dependency/security update policy and review CI findings.

## Potential extensions — not implemented

- Voice input/output and progressive web app support.
- More structured document formats such as PDF and Office files.
- Additional integrations and scheduled workflows.
- Opt-in evaluation datasets that contain no private conversation data.

Each extension should have a scoped issue, security/privacy review where relevant, acceptance criteria, and tests before being treated as a committed milestone.