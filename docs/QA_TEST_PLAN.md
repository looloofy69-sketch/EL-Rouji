# QA test plan

Use this checklist with the actual hosted AppDeploy app. GitHub Actions checks type correctness and bundling; it is not an end-to-end service test.

## Test setup

- Use non-sensitive test messages and files. Never use actual private conversations, credentials or personal documents.
- Capture app/deployment version, browser/device, language, steps and observed result for any failure.
- Run tests against the intended environment and account. Verify access boundaries with two distinct test accounts.
- Do not use the CI-only AppDeploy client shim for hosted behavior checks.

## UI and language coverage

| ID | Scenario | Expected outcome |
|---|---|---|
| UI-01 | Load app at desktop and narrow/mobile viewport | No overlapping controls; composer remains usable; history panel can be opened/closed. |
| UI-02 | Switch English, French and Arabic | Labels update consistently; Arabic text/layout direction is appropriate; no clipped controls. |
| UI-03 | Send a message containing Arabic/Darija and Latin text | User message and assistant response remain readable with mixed scripts. |
| UI-04 | Render markdown, links, lists, code and a GFM table | Content remains legible and does not overflow the message area. |
| UI-05 | Copy/export a conversation and delete a conversation | Visible action completes; deleted conversation disappears from the list. |
| UI-06 | Clear local history with confirmation | Confirmation is shown and local history is cleared only after approval. |

## Modes and tools

| ID | Scenario | Expected outcome |
|---|---|---|
| MODE-01 | Assistant, writing, study, coding and planning prompts | Correct mode is selected; answer is relevant; failures are surfaced clearly. |
| MODE-02 | Built-in Tools task starter | Starter populates the expected task/message and can be edited before sending. |
| TOOL-01 | Calculator with arithmetic and parentheses | Correct result for valid expressions. |
| TOOL-02 | Calculator with invalid expressions, unknown identifiers, or attempted code-like input | Rejected safely; no code execution or app crash. |
| RES-01 | Research query with a valid configured search key | User receives an answer and source cards/links; test at least one source URL. |
| RES-02 | Research with invalid/missing key or upstream failure in a non-production test setting | Clear error/fallback; no credential details appear in response or logs. |

## Attachments

The current upload flow supports PNG, JPEG, WebP, TXT, MD, CSV and JSON. It does not support PDF, DOCX or XLSX.

| ID | Scenario | Expected outcome |
|---|---|---|
| FILE-01 | Upload a supported image under the size limit | Analysis result is shown or a clear error appears; no silent failure. |
| FILE-02 | Upload a supported text file below the configured text-size limit | Analysis can summarize/extract relevant details. |
| FILE-03 | Upload an unsupported format or oversized file | Client/server reject it safely and explain supported formats/limits. |
| FILE-04 | Try malformed JSON or text with unexpected encoding/content | Request fails gracefully without exposing stack traces or crashing the UI. |

## Account sync and access boundaries

Run only with dedicated test accounts and synthetic data.

| ID | Scenario | Expected outcome |
|---|---|---|
| AUTH-01 | Use local history while signed out | Local mode works and does not claim cloud sync is enabled. |
| AUTH-02 | Sign in and sync a test conversation, then refresh | Conversation remains available to the same account where sync is supported. |
| AUTH-03 | Sign out and use another test account | Previous account's cloud conversations are not disclosed to the second account. |
| AUTH-04 | Attempt direct API read/update/delete for another account's conversation | Server denies access; client-side hiding alone is not sufficient. |
| AUTH-05 | Delete a cloud-synced conversation and reload | Server-side data is deleted/absent according to the documented retention policy. |
| API-01 | Submit missing fields, malformed JSON, unsupported types and over-limit content to each backend endpoint | Appropriate 4xx response; no internal secrets, stack traces or sensitive data disclosed. |

## Release regression evidence

For each run, record:
- Date/time and AppDeploy version ID.
- Browser/device and language tested.
- Pass/fail per ID, with minimal reproduction steps.
- Any security/privacy findings and the responsible issue.
- Whether a rollback was needed and the restored version ID.

Do not mark this plan complete based solely on GitHub Actions. Attachments, auth/sync, research, and visual behavior require real hosted-runtime checks.
