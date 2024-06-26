FROM node:20-slim as base
FROM base AS deps
RUN apt-get update
RUN apt-get install -y build-essential python3
WORKDIR /main
COPY package.json package-lock.json ./
RUN npm install

FROM base AS builder
WORKDIR /main
COPY --from=deps /main/node_modules ./node_modules
COPY . .
ENV PALICO_AGENT_API_URL=http://localhost:8000
ENV PALICO_SERVICE_KEY=123456
RUN npx nx run studio:build

FROM base AS production
WORKDIR /main
COPY --from=builder /main/apps/studio/.next/standalone ./
COPY --from=builder /main/apps/studio/public ./apps/studio/public
COPY --from=builder /main/apps/studio/.next/static ./apps/studio/.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "/main/apps/studio/server.js"]