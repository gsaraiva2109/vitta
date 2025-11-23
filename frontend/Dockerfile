FROM node:20-alpine AS builder

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

RUN ls -la /app/dist

FROM nginx:alpine

# Instala o utilitário gettext para usar o envsubst no entrypoint
RUN apk --no-cache add gettext

# Copia os arquivos de build da fase 'builder' para o Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia o template de configuração do Nginx
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

RUN chown -R nginx:nginx /usr/share/nginx/html
RUN ls -l /usr/share/nginx/html

# Copia o script de entrada
COPY entrypoint.sh /entrypoint.sh

# **[CORREÇÃO CRÍTICA PARA FIM DE LINHA]**
# Remove o caractere \r (Carriage Return) de todas as linhas para evitar o erro "not found" no Linux.
RUN sed -i 's/\r$//' /entrypoint.sh

# Garante que o script seja executável
RUN chmod +x /entrypoint.sh

EXPOSE 80
CMD ["/entrypoint.sh"]