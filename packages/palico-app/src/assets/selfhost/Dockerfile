FROM node:20-slim as base

FROM base AS deps
RUN apt-get update
RUN apt-get install -y build-essential python3
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:18-alpine as runner
WORKDIR /app

RUN npm install -g ts-node

COPY --from=deps /app/node_modules ./node_modules

COPY . .

CMD ["npm", "run", "palico", "start-prod"]