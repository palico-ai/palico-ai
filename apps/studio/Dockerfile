FROM node:18-alpine AS base
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /main
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /main
COPY --from=deps /main/node_modules ./node_modules
COPY . .
RUN npx nx run studio:build
EXPOSE 3000
ENV PORT 3000
CMD npx nx run studio:start