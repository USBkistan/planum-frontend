# Stage 1: Dependencies
FROM oven/bun:1.3-alpine AS deps

WORKDIR /app

COPY package.json bun.lockb* ./

RUN bun install --frozen-lockfile

# Stage 2: Builder
FROM oven/bun:1.3-alpine AS builder

WORKDIR /app

COPY package.json bun.lockb* ./

RUN bun install --frozen-lockfile

COPY . .

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN bun run build

# Stage 3: Runner
FROM oven/bun:1.3-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lockb* ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install only production dependencies
RUN bun install --frozen-lockfile --production

EXPOSE 3000
