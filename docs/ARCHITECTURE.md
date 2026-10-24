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

- Research now rejects direct HTTP(S) page URLs with a clear 400 response until the hosted scraping path's DNS resolution, redirect, and destination-address controls are verified. Normal search-based research remains available; links returned by the search provider are syntax-checked before display. The URL parser is not treated as a secure server-side fetch boundary.


- Browser-local history is stored on the user's device; account sync is optional and depends on the configured authentication and backend.
- Search credentials belong in server-side secrets, never frontend code.
- The supported attachment flow is limited to PNG/JPEG/WebP images and TXT/MD/CSV/JSON text files. This import did not add PDF or office-document support.
- A successful production deployment and GitHub source transfer do not by themselves prove authorization, privacy, or security controls are sufficient; validate those before broad rollout.