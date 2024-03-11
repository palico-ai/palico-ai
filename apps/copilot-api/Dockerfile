FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json palico.json tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build
