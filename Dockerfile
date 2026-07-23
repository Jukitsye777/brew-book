FROM node:22-alpine AS deps
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.3.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS builder
WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@11.3.0 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN --mount=type=secret,id=dotenv_key \
    DOTENV_PRIVATE_KEY_PRODUCTION=$(cat /run/secrets/dotenv_key) \
    pnpm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3003

RUN apk add --no-cache curl
RUN npm install -g @dotenvx/dotenvx

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/.env.production ./.env.production

EXPOSE 3003

CMD ["dotenvx", "run", "-f", ".env.production", "--", "node", ".output/server/index.mjs"]
