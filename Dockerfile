# ── Stage 1 : Build ──────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Copie les fichiers de polices Geist qui ne sont pas résolus par Vite
RUN mkdir -p /app/dist/assets/files && \
    find /app/node_modules/@fontsource-variable -name "*.woff2" \
    -exec cp {} /app/dist/assets/files/ \; 2>/dev/null || true

# ── Stage 2 : Serve ──────────────────────────────────────────
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
