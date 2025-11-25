# Test Stage: A simple, single stage for running tests
FROM node:22-alpine AS test
WORKDIR /usr/src/app
RUN npm install -g npm@latest
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "test"]

# Production Stage
FROM node:22-alpine AS production
WORKDIR /usr/src/app
RUN apk add --no-cache dumb-init
RUN npm install -g npm@latest
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 3000
# Run the application with a process manager that handles signals gracefully.
CMD ["dumb-init", "node", "server.js"]

