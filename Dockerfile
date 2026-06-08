FROM oven/bun:1.3-alpine

WORKDIR /app

COPY package.json bun.lockb* ./

RUN bun install --frozen-lockfile

COPY . .

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "start"]
