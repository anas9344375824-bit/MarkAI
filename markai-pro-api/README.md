# MarkAI Pro — Backend API

Production-grade Node.js + TypeScript backend for the MarkAI Pro SaaS platform.

---

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Stripe account
- OpenAI API key
- Resend account

---

## Installation

```bash
cd markai-pro-api
npm install
cp .env.example .env
# Fill in all values in .env
```

---

## Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Open Prisma Studio
npm run db:studio
```

---

## Development

```bash
npm run dev
# API runs on http://localhost:3000
# Health check: http://localhost:3000/api/health
```

---

## Testing

```bash
# Requires a test PostgreSQL database (see .env.test)
npm test

# Watch mode
npm run test:watch
```

---

## Production Build

```bash
npm run build
npm start
```

---

## Deployment (Railway)

1. Push to GitHub
2. Connect repo to Railway
3. Add all environment variables from `.env.example`
4. Railway auto-deploys on push using `railway.toml`

---

## API Overview

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| POST | /api/auth/refresh | Refresh access token |
| POST | /api/auth/logout | Logout |
| GET | /api/tools | List all 26 tools |
| POST | /api/tools/:slug/generate | Stream AI generation (SSE) |
| POST | /api/tools/:slug/generate/sync | Sync AI generation |
| GET | /api/content | Content library |
| POST | /api/campaigns/build | Build full campaign |
| GET | /api/brand-voice | Get brand voice profile |
| POST | /api/brand-voice/analyse-samples | AI voice analysis |
| POST | /api/competitors/analyse | Competitor intelligence |
| GET | /api/clients | List clients (Agency) |
| POST | /api/billing/checkout | Create Stripe checkout |
| POST | /api/webhooks/stripe | Stripe webhook handler |
| GET | /api/health | Health check |

---

## Architecture

```
src/
├── config/        # External service clients (OpenAI, Stripe, Redis, etc.)
├── middleware/    # Auth, rate limiting, credit checks, validation
├── routes/        # Express route definitions
├── controllers/   # Request handlers with business logic
├── services/
│   ├── ai/        # AI router, streaming, prompt builder
│   │   └── tools/ # 21 individual AI tool implementations
│   ├── auth.service.ts
│   ├── credits.service.ts
│   ├── stripe.service.ts
│   └── email.service.ts
├── types/         # TypeScript types, credit costs, plan features
└── utils/         # Helpers, error classes, response formatters
```

---

## Credit System

Every AI tool call costs credits. Monthly allowances:
- Free: 50 credits
- Starter: 500 credits
- Pro: 2,000 credits
- Agency: 10,000 credits

Credits reset monthly on invoice.paid Stripe webhook.

---

## Streaming

All AI generation endpoints support Server-Sent Events (SSE):

```javascript
const es = new EventSource('/api/tools/blog_writer/generate', {
  headers: { Authorization: `Bearer ${token}` }
})
es.onmessage = (e) => {
  const { type, data, metadata } = JSON.parse(e.data)
  if (type === 'chunk') appendToOutput(data)
  if (type === 'done') showMetadata(metadata)
  if (type === 'error') showError(data)
}
```
