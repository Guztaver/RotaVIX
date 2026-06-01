# ====== Stage 1: Build ======
FROM node:lts-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src/ src/

RUN npm run build
RUN npm prune --omit=dev

# ====== Stage 2: Production ======
FROM node:lts-alpine AS production
WORKDIR /app

RUN addgroup --system rotavix && adduser --system --ingroup rotavix rotavix

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

USER rotavix
EXPOSE 3000

CMD ["node", "dist/main"]
