# API Reference

## Health

`GET /health` → `{ ok: true }`

## AI Rewrite

`POST /ai/rewrite`

Request body:

```json
{
  "text": "string",
  "rules": {
    "keepTerms": ["term"],
    "temperature": 0.3
  }
}
```

Response:

```json
{
  "easyReadText": "string"
}
```

## Upload PDF

`POST /upload/pdf`

Multipart form-data with a single `file` field. Returns `{ "text": "..." }`.

## Upload Image

`POST /upload/image`

Multipart form-data with a single `file` field. Returns `{ "text": "..." }`.

## Upload from URL

`POST /upload/url`

JSON body `{ "url": "https://example.com" }`. Returns `{ "text": "..." }` with the extracted readable text.

## Billing

- `POST /billing/checkout` → `{ url: "https://checkout.stripe.com/..." }`
- `POST /billing/webhook` – Stripe webhook for subscription events.

## Usage

- `GET /usage/me` → `{ monthCount, limit, isCapped }`
- `POST /usage/increment` → `{ monthCount, limit, isCapped }`
