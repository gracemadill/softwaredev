# Easy Read API

This Express service powers OCR, PDF parsing, AI rewriting, billing, and usage tracking for the Easy Read Toolbox.

## Scripts

- `pnpm dev` – run the development server with hot reload via `tsx`.
- `pnpm build` – compile TypeScript into `dist/`.
- `pnpm start` – run the compiled server.

## Environment

See `.env.example` for the required configuration variables. OCR can be disabled for local development by leaving `ENABLE_OCR=false`, which returns mock responses for uploads.
