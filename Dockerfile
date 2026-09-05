# ========================================
# UniPass - Multi-stage Docker build
# ========================================

# ---- Stage 1: Build the GUI ----
FROM node:20-alpine AS gui-build
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/gui/package.json ./apps/gui/package.json
RUN npm ci
COPY apps/gui ./apps/gui
COPY tsconfig.base.json ./
RUN npx nx build gui

# ---- Stage 2: Build the API ----
FROM node:20-alpine AS api-build
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
RUN npm ci
COPY apps/api ./apps/api
COPY tsconfig.base.json ./
# Copy the built GUI into the API assets folder
COPY --from=gui-build /app/dist/apps/gui ./apps/api/src/assets
RUN npx nx build api

# ---- Stage 3: Production image ----
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Copy the built API and its package.json
COPY --from=api-build /app/dist/apps/api ./dist/apps/api
COPY --from=api-build /app/dist/apps/api/package.json ./package.json

# Install only production dependencies
RUN npm ci --omit=dev && \
    npm cache clean --force

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001
USER nodeuser

# Expose the backend port
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:10000/api || exit 1

# Start the server
CMD ["node", "dist/apps/api/main.js"]