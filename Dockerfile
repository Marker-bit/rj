FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

### Dependencies ###
FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/
RUN --mount=type=cache,id=s/5081a2db-f18f-4416-bec2-ccfe549c9f4a-/pnpm/store,target=/pnpm/store,sharing=locked \
    pnpm install --frozen-lockfile --ignore-scripts

# Builder
FROM base AS builder
# Railway injects RAILWAY_GIT_COMMIT_SHA as a build arg; COMMIT_SHA can be
# supplied by CI or a manual `docker build --build-arg`.
ARG COMMIT_SHA
ARG RAILWAY_GIT_COMMIT_SHA
ENV NEXT_PUBLIC_COMMIT_SHA=${COMMIT_SHA:-$RAILWAY_GIT_COMMIT_SHA}

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=cache,id=s/5081a2db-f18f-4416-bec2-ccfe549c9f4a-/app/.next/cache,target=/app/.next/cache,sharing=locked \
    pnpm build

### Production image runner ###
FROM base AS runner

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY ./prisma ./prisma
COPY ./prisma.config.ts ./prisma.config.ts
COPY package.json pnpm-lock.yaml ./
# Copy Prisma from the builder, not the deps stage: `prisma generate` runs
# during the build and downloads the schema engine for this image's platform.
# The runner needs that binary for commands like `prisma db push`.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm ./node_modules/.pnpm
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/dotenv ./node_modules/dotenv
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
# COPY follows a symlink source, which turns `node_modules/prisma` into a real
# directory. Recreate the pnpm link so the CLI resolves its dependencies from
# `.pnpm/prisma@.../node_modules` (including `@prisma/config`).
RUN prisma_pkg="$(ls -d node_modules/.pnpm/prisma@*/node_modules/prisma | head -n 1)" && \
    ln -s "${prisma_pkg#node_modules/}" node_modules/prisma

USER nextjs

EXPOSE 80
ENV PORT=80
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
