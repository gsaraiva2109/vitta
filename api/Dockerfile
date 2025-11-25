# Stage 1: Base image with production dependencies
FROM node:22-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm audit fix --production
RUN npm audit fix

# Stage 2: Development image with dev dependencies
FROM base AS dev
COPY package*.json ./
RUN npm install
RUN npm audit fix
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Stage 3: Test image to run tests
FROM base AS test
COPY package*.json ./
RUN npm cache clean --force
RUN npm install
RUN npm audit fix
COPY . .
CMD ["npm", "test"]
