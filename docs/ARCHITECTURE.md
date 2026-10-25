# Architecture

## Current shape

EL-Rouji is a React + TypeScript + Vite application with an AppDeploy backend. The current deployed source includes a multilingual interface (English, French, Arabic with right-to-left layout), conversation history, assistant modes, built-in task tools, research, and supported image/text-file analysis.

## Frontend

- `src/App.tsx`: primary chat interface, language/mode state, local history, conversation sync UI, research and attachment flows.
- `src/components/BuiltInTools.tsx`: built-in tool hub and task prompts.
- `src/index.css`: application styling and responsive layout.
- `src/main.tsx`: frontend entry point.

## Backend

- `backend/index.ts`: server-side API handlers and integration logic.
- `package.json`, `vite.config.ts`, `tsconfig.json`, and Tailwind/PostCSS configuration define the build.

Current API routes include `/api/health`, `/api/chat`, `/api/research`, `/api/analyze-image`, `/api/analyze-document`, and conversation endpoints under `/api/conversations`.

## Data and security boundaries

- GitHub `main` now rejects direct HTTP(S) page URLs in source before any remote fetch, but the guard is not confirmed live: the last documented AppDeploy snapshot remains `1792755107550`. Normal query-based search remains supported in source. The actual hosted compile/deploy and live regression test are still required; a URL parser alone cannot prove safe DNS/redirect behavior.


- Browser-local history is stored on the user's device; account sync is optional and depends on the configured authentication and backend.
- Search credentials belong in server-side secrets, never frontend code.
- The supported attachment flow is limited to PNG/JPEG/WebP images and TXT/MD/CSV/JSON text files. This import did not add PDF or office-document support.
- A successful production deployment and GitHub source transfer do not by themselves prove authorization, privacy, or security controls are sufficient; validate those before broad rollout.

## Proposed Algeria-centric knowledge architecture (not implemented)

See [ALGERIA_CENTRIC_ENGINE_ROADMAP.md](ALGERIA_CENTRIC_ENGINE_ROADMAP.md) for the full phase plan, corpus schema, technology decision register and test gates. A future retrieval module should expose a provider-agnostic interface and return passage IDs with source/version metadata. The answer layer must validate citations against that evidence bundle and abstain when source coverage or legal currency is uncertain. No vector database, embedding model, legal corpus pipeline, or new public RAG route has been added by this documentation change.
