FROM node:20-alpine

WORKDIR /app

# Activer pnpm
RUN corepack enable pnpm

# Copier les fichiers de dépendances
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

# Copier le reste du code
COPY . .

EXPOSE 5173

# Lancer Vite
CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"]
