# Integrations and configuration

## Research search

Research mode uses a server-side Tavily search integration when `TAVILY_API_KEY` is configured in AppDeploy's secure backend settings. Never put the key in frontend variables, public commits, screenshots, or issue reports. A secret entry being configured does not prove the credential is valid; run an end-to-end search test after configuration.

GitHub `main` rejects direct HTTP(S) page URLs before a remote fetch, and URL-safety regressions pass CI. This source change is **not confirmed live**: the last documented verified AppDeploy snapshot remains `1792755107550`. A controlled AppDeploy compile/deploy and live rejection plus normal-search regression test are still required.

## AppDeploy

The current hosted app uses AppDeploy for deployment, backend endpoints, authentication/client services, and secret configuration. The deployed URL is https://el-rouji-70120b.v2.appdeploy.ai/.

## Conversation sync

The interface offers optional account-based sync. Test sign-in, read/write access, account isolation, sign-out behavior, and deletion semantics before depending on it for sensitive or multi-user use.

## Planned integrations — not implemented

The [Algeria-centric engine roadmap](ALGERIA_CENTRIC_ENGINE_ROADMAP.md) scopes these as future candidates, not current integrations: official-source Legal/Administrative RAG; a vector-search store such as PostgreSQL/pgvector if supported by the host; ONNX Runtime Web or WebAssembly for selected local tasks; Darija evaluation/adaptation; OCR and PDF/Office parsing; speech-to-text/text-to-speech; OpenStreetMap-powered features; isolated code execution; LSP workspace support; and mock payment-gateway responses. None is implemented or confirmed available in the current AppDeploy environment by this repository check.

## Current limitations

- Third-party integrations other than configured research search are not implied by the existence of tool prompts.
- No scheduled jobs, voice service, external CRM, or payment integration is asserted by this repository.
- Image/file analysis supports PNG, JPEG, WebP, TXT, MD, CSV, and JSON in the current interface; PDFs and DOCX/XLSX are not supported by the existing upload flow.