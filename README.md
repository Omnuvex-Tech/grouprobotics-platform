# project-platform

Şirkət üçün ümumi monorepo şablonu: Turborepo + npm workspaces.

## Apps

- `apps/project-web` — Next.js (App Router) frontend
- `apps/project-api` — minimal NestJS API (`GET /health`)

## Packages

- `packages/ui` (`@repo/ui`) — shared UI komponentləri və stillər
- `packages/types` (`@repo/types`) — type/interface müqavilələri
- `packages/shared` (`@repo/shared`) — runtime utils
- `packages/eslint-config` (`@repo/eslint-config`) — ESLint config-lar
- `packages/typescript-config` (`@repo/typescript-config`) — TS config-lar

## Setup

```bash
npm install
```

## Environment

- `apps/project-web/.env.development` git-də saxlanılır (lokal default)
- `apps/project-web/.env.production` serverdə yaradılır (gitignore). Nümunə: `.env.production.example`
- `apps/project-api/.env.development` git-də saxlanılır (lokal default)
- `apps/project-api/.env.production` serverdə yaradılır (gitignore). Nümunə: `.env.production.example`
- `project-api` üçün `npm run dev` development env, `npm run start` production env ilə işləyir
- Default portlar: `project-web=40010`, `project-api=40011`

## Development

```bash
npm run dev
```

Tək app işlətmək üçün:

```bash
npx turbo run dev --filter=project-web
npx turbo run dev --filter=project-api
```
