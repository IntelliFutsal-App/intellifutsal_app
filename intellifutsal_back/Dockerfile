# ── Stage 1: compile TypeScript ──────────────────────────────────────────────
FROM node:18-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
# Compile TypeScript → dist/
RUN npm run build

# ── Stage 2: production runtime ──────────────────────────────────────────────
FROM node:18-slim AS production

WORKDIR /usr/src/app

# psql is required by run-migrations.sh to wait for the DB to be ready
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Install all dependencies (dev deps are required by ts-node/typeorm at migration
# time when the source is volume-mounted in development, and by the TypeScript
# compiler itself; they do not affect the production binary in dist/).
COPY package*.json ./
RUN npm install

# Copy compiled output from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy the migration/startup entrypoint
COPY run-migrations.sh /run-migrations.sh
RUN chmod +x /run-migrations.sh

EXPOSE 9042

# run-migrations.sh waits for Postgres, runs migrations, then exec's CMD
ENTRYPOINT ["/run-migrations.sh"]
# Default: run compiled JS (production).
# The root docker-compose.yml overrides this with ["npm", "start"] for
# local development where the source is volume-mounted.
CMD ["node", "dist/index.js"]