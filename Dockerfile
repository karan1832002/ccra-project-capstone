FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables must be present at build time for Next.js if embedded
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="postgresql://neondb_owner:npg_9j4XYOlUeyQz@ep-solitary-star-aupl1yag-pooler.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
ENV BETTER_AUTH_SECRET="1536d2a7faf288eb84f830311cbd7829e7015a3e35b29eda4c5d2a78042a3fcf"

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy built application output
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "run", "start"]
