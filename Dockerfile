FROM node:20-alpine AS base
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
RUN pnpm exec prisma generate

# Builder
FROM base AS builder
ARG COMMIT_SHA
ENV NEXT_PUBLIC_COMMIT_SHA=$COMMIT_SHA

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
COPY package.json pnpm-lock.yaml ./
COPY --from=deps /app/node_modules/prisma ./node_modules/prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=deps /app/node_modules/.bin/prisma ./node_modules/.bin/prisma

USER nextjs

EXPOSE 80
ENV PORT=80
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
