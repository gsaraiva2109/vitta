FROM node:20-alpine
FROM loadimpact/k6:latest AS k6official

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .
COPY --from=k6official /usr/bin/k6 /usr/bin/k6

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]