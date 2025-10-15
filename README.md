# Easy Read Toolkit Monorepo

This repository packages the Easy Read Toolkit into a single deployable app with a React frontend and a Node.js backend. The backend exposes authentication, document upload + OCR, and AI translation endpoints. The frontend provides a simple dashboard to log in, upload files, and translate the resulting Easy Read copy.

## Repository structure

```
apps/
  backend/      # Express API with OCR + AI endpoints
  frontend/     # React web client for login, upload, translation
scripts/        # Helper scripts for local development
```

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

   > If you are in an offline environment, install packages on a connected machine and copy the generated `node_modules` / lockfiles, or run `npm install` after regaining connectivity.

2. Create environment files:

   ```bash
   cp .env.example .env
   cp apps/backend/.env.example apps/backend/.env
   cp apps/frontend/.env.example apps/frontend/.env
   ```

   Update the `.env` files with real secrets (OpenAI key, shared login, etc.).

3. Start both apps locally:

   ```bash
   npm run dev
   ```

   The backend listens on `http://localhost:4000` by default and the frontend on `http://localhost:5173`.

## Backend API

| Endpoint | Method | Auth | Description |
| --- | --- | --- | --- |
| `/health` | GET | ❌ | Health check |
| `/auth/login` | POST | ❌ | Exchange the shared credentials for a JWT |
| `/documents/upload` | POST | ✅ | Upload PDF/image, perform OCR, return extracted text |
| `/ai/rewrite` | POST | ✅ | Rewrite text in Easy Read style using OpenAI |
| `/ai/translate` | POST | ✅ | Translate Easy Read text into another language |

### Environment variables

Backend variables live in `apps/backend/.env`:

- `PORT` – API port (default `4000`)
- `ALLOWED_ORIGINS` – Comma-separated list of allowed web origins
- `OPENAI_API_KEY` – OpenAI key used for rewrite/translation
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` – Shared login credentials
- `AUTH_SECRET` – Secret used to sign JWTs
- `STORAGE_DIR` – Directory where uploads are copied for later use

The backend calls `apps/backend/ocr/ocr_pdf.py` to run OCR. The Python script depends on `pdfminer.six`, `pytesseract`, and `Pillow` and requires the system Tesseract binary. Install them locally or rely on Docker (below).

## Frontend configuration

The React frontend expects `VITE_API_URL` (defaults to `http://localhost:4000`). Update `apps/frontend/.env` if you deploy the backend elsewhere.

## Docker Compose

The repository ships with a `docker-compose.yml` (see below) to run the stack with a single command. The compose setup builds two containers:

- `backend` – Node.js API with Python OCR dependencies
- `frontend` – React app served via the Vite dev server

You can run everything with:

```bash
docker compose up --build
```

Override environment variables by copying `.env.example` to `.env` and editing the values.

## Suggested next steps

- Configure persistent object storage (S3, Azure Blob, etc.) to replace the local `storage` directory when deploying.
- Swap the shared-credential login for a real user store (e.g., PostgreSQL + hashed passwords) or integrate with an identity provider.
- Add error tracking/observability (Sentry, OpenTelemetry) around the OCR + OpenAI integrations.
- Harden rate limiting and add upload size validation for production deployments.
