# QA test plan

Use this plan against the real hosted AppDeploy app. GitHub Actions validates package installation, type correctness and bundle generation; it is not a substitute for service-level QA.

## Test setup

- Use synthetic messages, files and dedicated test accounts only.
- Record AppDeploy version, browser/device, language, steps, result and any reproduction details.
- Do not use the CI shim to test hosted authentication or image processing.

## UI and language

| ID | Scenario | Expected result |
|---|---|---|
| UI-01 | Open desktop and mobile layouts | No key controls overlap; composer and history are usable. |
| UI-02 | Switch English, French and Arabic | Labels update; Arabic/RTL stays readable and controls are not clipped. |
| UI-03 | Send mixed Arabic/Darija and Latin text | Message history remains readable across mixed scripts. |
| UI-04 | Render markdown heading, lists, code, links and a GFM table | Formatting is rendered and does not overflow. |
| UI-05 | Copy/export and delete a conversation | Each visible action completes; deleted conversation disappears. |
| UI-06 | Clear local history | Confirmation is requested; history clears only after approval. |

## Modes and tools

| ID | Scenario | Expected result |
|---|---|---|
| MODE-01 | Exercise assistant, writing, study, coding and planning | Correct mode prompt is sent and failures are shown clearly. |
| MODE-02 | Use built-in task starters | Starter populates the expected prompt and remains editable. |
| TOOL-01 | Calculator with arithmetic/parentheses | Valid expression returns correct result. |
| TOOL-02 | Calculator with invalid expression, unknown names or code-like input | Safely rejected; no code execution or page crash. |
| RES-01 | Run research with a valid search key | Answer includes usable source cards/links. |
| RES-02 | Run research with missing/invalid key in a non-production test setting | Clear error/fallback without disclosing credentials. |

## Attachments

Supported: PNG, JPEG, WebP, TXT, MD, CSV, JSON. PDF/DOCX/XLSX are unsupported.

| ID | Scenario | Expected result |
|---|---|---|
| FILE-01 | Upload a valid supported image | Image analysis result or useful visible error. |
| FILE-02 | Upload a small supported text file | File is analyzed and key details are returned. |
| FILE-03 | Upload unsupported/oversized file | Rejected with supported-format/size guidance. |
| FILE-04 | Submit malformed JSON or unusual text | Graceful error without stack trace or crash. |

## Account sync and API boundaries

Only use synthetic accounts and data.

| ID | Scenario | Expected result |
|---|---|---|
| AUTH-01 | Use app while signed out | Local history works and sync isn't falsely reported active. |
| AUTH-02 | Sign in, sync a conversation, refresh | Same account can retrieve the synced test conversation. |
| AUTH-03 | Sign out, sign in as another account | Previous account's conversations are not disclosed. |
| AUTH-04 | Attempt direct cross-account conversation read/update/delete | Server denies unauthorized access. |
| AUTH-05 | Delete a synced conversation then refresh | Server-side deletion/retention behavior matches the documented policy. |
| API-01 | Missing fields, malformed bodies, unsupported types or oversized content on each app-owned endpoint | Appropriate client error; no internal details or secrets disclosed. |

## Release evidence

Record timestamp, AppDeploy version, Git commit, browser/device/language, pass/fail per test, concise failure details, and rollback version if used. Do not mark this plan complete based only on CI.
