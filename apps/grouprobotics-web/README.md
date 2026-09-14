# project-web

Frontend application built with Next.js 16, React 19, and Tailwind CSS 4.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Runs on [http://localhost:40010](http://localhost:40010).

## Environment

- Lokal: `.env.development` (git-də saxlanılır)
- Production: `.env.production` (gitignore). Nümunə: `.env.production.example`

`project-web` həm development, həm production start zamanı `40010` portunda işləyir və API default olaraq `http://localhost:40011`-ə baxır.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on `40010` |
| `npm run build` | Production build |
| `npm run start` | Start production server on `40010` |
| `npm run lint` | Run ESLint |
| `npm run check-types` | Type check |

## Internal Packages

- `@repo/ui` — Shared components and styles
- `@repo/types` — Type and interface definitions
- `@repo/shared` — Shared utilities

