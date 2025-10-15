# Easy Read Toolbox Monorepo

This repository contains the Expo (React Native) mobile app and the Express API for the Easy Read Toolbox.

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy the environment templates and adjust values:

   ```bash
   cp .env.example .env
   cp apps/mobile/.env.example apps/mobile/.env
   cp services/api/.env.example services/api/.env
   ```

3. Start the development servers:

   ```bash
   pnpm dev
   ```

   This runs both the API (http://localhost:8080) and the Expo Metro bundler.

### Workspace scripts

- `pnpm dev:mobile` – start the Expo application.
- `pnpm dev:api` – start the Express API with live reload via `tsx`.
- `pnpm build` – build both workspaces.
- `pnpm lint` – run linters for both workspaces.

## Structure

```
.
├── apps/
│   └── mobile/          # Expo app
├── services/
│   └── api/             # Express API (TypeScript)
├── packages/
│   └── shared/          # Shared types
├── docs/                # Documentation and design notes
└── .env.example         # Root environment template
```

## Docs

Refer to the files inside `docs/` for architecture notes and API documentation.
