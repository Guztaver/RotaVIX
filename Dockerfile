# ====================================================================
# RotaVIX Monolith — Angular + NestJS served on a single port
# ====================================================================

# ── Stage 1: Build Angular ──────────────────────────────────────────
FROM node:lts-alpine AS web-builder
WORKDIR /app

RUN corepack enable

COPY web/rotavix-web/package.json web/rotavix-web/pnpm-lock.yaml web/rotavix-web/.npmrc ./
RUN pnpm install --frozen-lockfile --ignore-scripts && pnpm rebuild esbuild @parcel/watcher lmdb msgpackr-extract

COPY web/rotavix-web/angular.json web/rotavix-web/tsconfig*.json ./
COPY web/rotavix-web/src/ src/
COPY web/rotavix-web/public/ public/

RUN pnpm exec ng build --configuration production

# ── Stage 2: Build NestJS ───────────────────────────────────────────
FROM node:lts-alpine AS api-builder
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY api/rotavix-api/package*.json ./
RUN npm ci

COPY api/rotavix-api/tsconfig*.json ./
COPY api/rotavix-api/nest-cli.json ./
COPY api/rotavix-api/src/ src/

RUN npm run build
RUN npm prune --omit=dev

# ── Stage 3: Production ─────────────────────────────────────────────
FROM node:lts-alpine AS production
WORKDIR /app

RUN addgroup --system rotavix && adduser --system --ingroup rotavix rotavix

# Copy API build
COPY --from=api-builder /app/dist ./dist
COPY --from=api-builder /app/node_modules ./node_modules
COPY --from=api-builder /app/package*.json ./

RUN mkdir -p /app/data && chown -R rotavix:rotavix /app/data

# Copy Angular build (the NestJS server will serve these static files)
COPY --from=web-builder /app/dist/rotavix-web/browser ./web-dist

ENV WEB_DIST_PATH=/app/web-dist
ENV DATA_DIR=/app/data
ENV NODE_ENV=production
ENV PORT=3000

USER rotavix
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=10s \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "dist/main"]
