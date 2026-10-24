# Integrations and configuration

## Research search

Research mode uses a server-side Tavily search integration when `TAVILY_API_KEY` is configured in AppDeploy's secure backend settings. Never put the key in frontend variables, public commits, screenshots, or issue reports. A secret entry being configured does not prove the credential is valid; run an end-to-end search test after configuration.

Direct HTTP(S) page URL scraping is temporarily disabled while AppDeploy's destination-address, DNS-resolution, and redirect protections are verified. Search-based research remains supported; the UI explains the restriction in English, French, and Arabic. This source change is not live until a separate AppDeploy deployment is validated.

## AppDeploy

The current hosted app uses AppDeploy for deployment, backend endpoints, authentication/client services, and secret configuration. The deployed URL is https://el-rouji-70120b.v2.appdeploy.ai/.

## Conversation sync

The interface offers optional account-based sync. Test sign-in, read/write access, account isolation, sign-out behavior, and deletion semantics before depending on it for sensitive or multi-user use.

## Current limitations

- Third-party integrations other than configured research search are not implied by the existence of tool prompts.
- No scheduled jobs, voice service, external CRM, or payment integration is asserted by this repository.
- Image/file analysis supports PNG, JPEG, WebP, TXT, MD, CSV, and JSON in the current interface; PDFs and DOCX/XLSX are not supported by the existing upload flow.