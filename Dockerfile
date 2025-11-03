FROM node:18-alpine AS base
WORKDIR /usr/src/app

FROM base AS deps
COPY api/package.json api/package-lock.json ./
RUN npm install

FROM base AS build
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY api/. .
FROM base AS production
ENV NODE_ENV=production
COPY --from=build /usr/src/app .
EXPOSE 3000
CMD ["node", "server.js"]