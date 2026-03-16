# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS build
WORKDIR /app

RUN corepack enable
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm exec prisma generate
RUN pnpm run build
RUN pnpm prune --prod

FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
RUN apk add --no-cache openssl

COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist

USER node
EXPOSE 3001
CMD ["node", "dist/src/main"]
