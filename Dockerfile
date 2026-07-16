FROM node:20-alpine AS builder
WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++ libc6-compat

ENV npm_config_build_from_source=true

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

RUN npm rebuild bcrypt --build-from-source
RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /usr/src/app

RUN apk add --no-cache libc6-compat

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
