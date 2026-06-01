# ====== Stage 1: Build Angular ======
FROM node:lts-alpine AS builder
WORKDIR /app

# Install pnpm (used by this project)
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
# pnpm v10+ requires approving native builds for esbuild
RUN pnpm install --frozen-lockfile --ignore-scripts && pnpm rebuild

COPY angular.json tsconfig*.json ./
COPY src/ src/
COPY public/ public/

RUN pnpm exec ng build --configuration production

# ====== Stage 2: Serve with Nginx ======
FROM nginx:stable-alpine AS production

# Remove default nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy build output (Angular outputs to dist/rotavix-web/browser/)
COPY --from=builder /app/dist/rotavix-web/browser /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
