FROM node:20-alpine AS base



### Dependencies ###
FROM base AS deps
RUN apk add --no-cache libc6-compat git



# Setup pnpm environment
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/
RUN pnpm install --frozen-lockfile --prefer-frozen-lockfile && pnpm dlx prisma generate

# Builder
FROM base AS builder

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build


### Production image runner ###
FROM base AS runner

# Set NODE_ENV to production
ENV NODE_ENV production

# Disable Next.js telemetry
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY ./prisma ./prisma

# Exposed port (for orchestrators and dynamic reverse proxies)
EXPOSE 80
ENV PORT 80
ENV HOSTNAME "0.0.0.0"

# Run the nextjs app
CMD ["npm", "run", "deploy"]
