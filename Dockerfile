# ── Stage 1: Build frontend ───────────────────────────────────────────────────
FROM node:23-slim AS frontend-build
WORKDIR /frontend
RUN npm install -g npm@11
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Build backend + prune to prod deps ───────────────────────────────
FROM node:23-slim AS backend-build
RUN npm install -g npm@11
RUN apk add --no-cache python3 make g++
WORKDIR /backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build && npm prune --omit=dev

# ── Stage 3: Production image ─────────────────────────────────────────────────
FROM node:23-slim AS production
WORKDIR /app

# Production node_modules (native modules already compiled for linux/alpine)
COPY --from=backend-build /backend/node_modules ./node_modules

# Compiled backend
COPY --from=backend-build /backend/dist ./dist

# Seed data
COPY backend/data/seed.json ./data/seed.json

# Frontend build output — served as static files by Express
COPY --from=frontend-build /frontend/dist ./public

# Runtime uploads directory
RUN mkdir -p uploads

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/server.js"]
