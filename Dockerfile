FROM node:20-alpine

WORKDIR /usr/src/app

COPY api/package*.json ./

RUN npm install --omit=dev

COPY api/ .

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]