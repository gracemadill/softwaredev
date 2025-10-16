# Architecture Overview

The monorepo is organised into three workspaces managed by pnpm:

- `apps/mobile`: Expo React Native app providing the Easy Read Toolbox UI.
- `services/api`: Express API that powers OCR, PDF parsing, AI rewriting, and billing.
- `packages/shared`: Shared TypeScript types consumed by both client and server.

The API exposes endpoints for text extraction, AI rewriting, usage tracking, and billing. The mobile app communicates with these endpoints via the `src/lib/api.ts` client.
