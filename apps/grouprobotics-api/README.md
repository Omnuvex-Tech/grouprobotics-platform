# project-api

Minimal NestJS API application with a `GET /health` endpoint.

## Setup

```bash
npm install
```

## Environment

- Lokal: `.env.development` (git-də saxlanılır)
- Production: `.env.production` (gitignore). Nümunə: `.env.production.example`

`npm run dev` həmişə `.env.development`, `npm run start` isə `.env.production` oxuyur.
API həm development, həm production rejimində `40011` portunda işləyir.

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
npm run start
```
