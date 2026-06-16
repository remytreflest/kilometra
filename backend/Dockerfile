FROM node:20-bullseye-slim AS builder
WORKDIR /app

# Install build deps
COPY package*.json ./
RUN npm install

# Copy sources and Prisma schema
COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./tsconfig.json

# Generate Prisma client and build
RUN npx prisma generate || true
RUN npm run build
RUN npm prune --production || true

FROM node:20-bullseye-slim
WORKDIR /app
RUN apt-get update && apt-get install -y libssl1.1 ca-certificates --no-install-recommends && rm -rf /var/lib/apt/lists/* || true

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main.js"]
