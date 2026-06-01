# ====== Stage 1: Build Angular ======
FROM node:lts-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY angular.json tsconfig*.json ./
COPY src/ src/
COPY public/ public/

RUN npx ng build --configuration production

# ====== Stage 2: Serve with Nginx ======
FROM nginx:stable-alpine AS production

# Remove default nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy build output
COPY --from=builder /app/dist/rotavix-web /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
