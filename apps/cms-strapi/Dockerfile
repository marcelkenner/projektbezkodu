# apps/cms-strapi/Dockerfile
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN yarn build

FROM node:22-alpine AS runner
RUN apk add --no-cache curl
WORKDIR /app
ENV NODE_ENV=production PORT=1337
COPY --from=builder /app ./
RUN mkdir -p .cache .tmp && chown -R node:node /app
USER node
EXPOSE 1337
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=5 \
  CMD curl -fsS "http://127.0.0.1:${PORT}/_health" || exit 1
CMD ["yarn","start"]
