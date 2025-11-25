FROM node:22-alpine AS builder

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm audit fix

COPY . .
RUN npm run build

RUN ls -la /app/dist

FROM nginx:alpine

RUN apk --no-cache add gettext

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf.template /etc/nginx/templates/default.conf.template

RUN chown -R nginx:nginx /usr/share/nginx/html
RUN ls -l /usr/share/nginx/html

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
CMD ["/entrypoint.sh"]