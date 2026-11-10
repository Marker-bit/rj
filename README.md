# Reading Journal

Reading Journal is an app made in Next.js for reading fans.

## Stack

1. Next.js
2. Typescript
3. Prisma
4. shadcn/ui
5. Tailwind CSS

## Installation

### Prerequisites

- Node.js 22 or newer
- pnpm 10.32.1 (`corepack enable`)
- Docker with the Compose plugin

### Local development

1. `git clone https://github.com/Marker-bit/rj.git` - clone the repo
2. `pnpm install` - install dependencies
3. `docker compose -f docker-compose.dev.yml up -d` - start Postgres and Adminer
4. `cp .env.example .env` - copy and edit the environment variables
5. `pnpm db:push` - create the database schema
6. `pnpm dev` - start the dev server

The app will be available on [localhost:3000](http://localhost:3000).

`docker-compose.dev.yml` starts Postgres with the user `test` and the password
`example` on port `5433`, so set `DB_PRISMA_URL` and `DB_URL_NON_POOLING` in
`.env` to `postgresql://test:example@localhost:5433/rj?schema=public`.

### Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `POSTGRES_USER` | yes (Docker) | Postgres user for the compose database |
| `POSTGRES_PASSWORD` | yes (Docker) | Postgres password for the compose database |
| `DB_PRISMA_URL` | yes | Pooled connection string Prisma connects with |
| `DB_URL_NON_POOLING` | yes (Docker) | Direct connection string for migrations |
| `UPLOADTHING_TOKEN` | yes | Avatar and cover uploads |
| `BOOKS_API_KEY` | no | Google Books API key, raises the rate limit |
| `NEXT_PUBLIC_POSTHOG_KEY` | no | PostHog analytics |
| `NEXT_PUBLIC_POSTHOG_HOST` | no | PostHog instance URL |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | no | Umami analytics website id |
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | no | Umami analytics script URL |

### Docker

1. `git clone https://github.com/Marker-bit/rj.git` - clone the repo
2. `cp .env.example .env && micro .env` - copy and edit the environment variables
3. `docker compose up -d` - deploy the app

The app will be available on [localhost:3000](http://localhost:3000).

## Checks

Run these before opening a pull request:

```bash
pnpm lint   # oxlint
pnpm build  # production build
```

`pnpm typecheck` (`tsc --noEmit`) and `pnpm test` are not wired up yet; until
then run `npx tsc --noEmit` for type checking.

## Author

[Marker-bit](https://github.com/Marker-bit)
