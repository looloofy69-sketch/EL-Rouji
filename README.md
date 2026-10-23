# EL-Rouji

EL-Rouji is a multilingual AI assistant interface designed for Arabic, Algerian Darija, French, and English.

**Live application:** https://el-rouji-70120b.v2.appdeploy.ai/

## Current capabilities

- Assistant, research, writing, study, coding, and planning modes
- Built-in task tools and a local calculator
- Local conversation history and optional account-based sync
- Research mode with source links when the server-side search key is configured
- Image and text-file analysis for supported formats

## Stack

- React + TypeScript + Vite
- AppDeploy client/backend APIs
- Tailwind CSS
- `react-markdown` and `remark-gfm`
- `mathjs`

## Local development

1. Install Node.js (use a current LTS release).
2. Run `npm install`.
3. Configure server-side secrets in the deployment environment; never put API keys in source control.
4. Run `npm run dev` for local development.
5. Run `npm run build` to build the frontend.

Research functionality requires `TAVILY_API_KEY` to be configured securely in the backend environment. Do not commit `.env` files or secret values.

## Repository status

The current deployed source snapshot has been imported. See [SOURCE_SYNC_STATUS.md](./SOURCE_SYNC_STATUS.md) for what has and has not yet been verified. CI, clean-install verification, lockfile generation, and a formal release remain pending.
