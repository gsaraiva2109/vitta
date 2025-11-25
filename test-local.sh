#!/bin/bash

# Script para testar frontend e backend localmente com Docker
# Uso: ./test-local.sh

set -e  # Para o script se houver erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🚀 Teste Local Docker - Vitta System       ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo ""

# Função para limpar containers antigos
cleanup() {
    echo -e "${YELLOW}🧹 Limpando containers antigos...${NC}"
    docker stop vitta-frontend-test vitta-backend-test vitta-db-test 2>/dev/null || true
    docker rm vitta-frontend-test vitta-backend-test vitta-db-test 2>/dev/null || true
    docker network rm vitta-network 2>/dev/null || true
    echo -e "${GREEN}✅ Limpeza concluída${NC}"
    echo ""
}

# Função para mostrar logs
show_logs() {
    echo -e "${BLUE}📋 Para ver os logs em tempo real:${NC}"
    echo -e "   Frontend:  ${YELLOW}docker logs -f vitta-frontend-test${NC}"
    echo -e "   Backend:   ${YELLOW}docker logs -f vitta-backend-test${NC}"
    echo -e "   Database:  ${YELLOW}docker logs -f vitta-db-test${NC}"
    echo ""
}

# Limpar containers antigos
cleanup

# Criar rede docker
echo -e "${BLUE}🌐 Criando rede Docker...${NC}"
docker network create vitta-network

# ==================== RODAR DATABASE ====================
echo -e "${BLUE}🗄️  Iniciando Banco de Dados (PostgreSQL)...${NC}"
docker run -d \
    --name vitta-db-test \
    --network vitta-network \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=vitta \
    postgres:15-alpine

echo -e "${YELLOW}⏳ Aguardando banco de dados inicializar (5 segundos)...${NC}"
sleep 5

# ==================== BUILD BACKEND ====================
echo -e "${BLUE}📦 Construindo imagem do Backend...${NC}"
docker build --no-cache -t vitta-backend:test -f api/Dockerfile api

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend build concluído com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro no build do backend${NC}"
    exit 1
fi
echo ""

# ==================== BUILD FRONTEND ====================
echo -e "${BLUE}📦 Construindo imagem do Frontend...${NC}"
docker build --no-cache \
    --build-arg VITE_API_URL=/api \
    -t vitta-frontend:test \
    -f frontend/Dockerfile \
    frontend

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build concluído com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro no build do frontend${NC}"
    exit 1
fi
echo ""

# ==================== RODAR BACKEND ====================
echo -e "${BLUE}🚀 Iniciando Backend na porta 3000...${NC}"
docker run -d \
    -p 3000:3000 \
    --name vitta-backend-test \
    --network vitta-network \
    -e NODE_ENV=development \
    -e DB_HOST=vitta-db-test \
    -e DB_USER=postgres \
    -e DB_PASSWORD=postgres \
    -e DB_NAME=vitta \
    -e DB_PORT=5432 \
    -e JWT_SECRET=dev_secret_key_123 \
    vitta-backend:test

# Aguardar backend iniciar
echo -e "${YELLOW}⏳ Aguardando backend inicializar (3 segundos)...${NC}"
sleep 3

if docker ps | grep -q vitta-backend-test; then
    echo -e "${GREEN}✅ Backend rodando em http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Erro ao iniciar backend${NC}"
    docker logs vitta-backend-test
    exit 1
fi
echo ""

# ==================== RODAR FRONTEND ====================
echo -e "${BLUE}🚀 Iniciando Frontend na porta 8080...${NC}"
docker run -d -p 8080:80 --name vitta-frontend-test --network vitta-network -e BACKEND_URL=vitta-backend-test:3000 vitta-frontend:test
# Aguardar frontend iniciar
echo -e "${YELLOW}⏳ Aguardando frontend inicializar (2 segundos)...${NC}"
sleep 2

if docker ps | grep -q vitta-frontend-test; then
    echo -e "${GREEN}✅ Frontend rodando em http://localhost:8080${NC}"
else
    echo -e "${RED}❌ Erro ao iniciar frontend${NC}"
    docker logs vitta-frontend-test
    exit 1
fi
echo ""

# ==================== RESUMO ====================
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          ✅ Sistema rodando localmente!        ║${NC}"
echo -e "${GREEN}║          (DB + Backend + Frontend)             ║${NC}"
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo ""
echo -e "${BLUE}🌐 URLs:${NC}"
echo -e "   Frontend: ${GREEN}http://localhost:8080${NC}"
echo -e "   Backend:  ${GREEN}http://localhost:3000${NC}"
echo ""
echo -e "${BLUE}ℹ️  Credenciais DB:${NC} postgres/postgres (Database: vitta)"
echo ""

show_logs

echo -e "${YELLOW}⚠️  Para parar tudo:${NC}"
echo -e "   ${RED}./stop-local.sh${NC}"
echo ""

# Verificar se os containers estão rodando
echo -e "${BLUE}📊 Status dos containers:${NC}"
docker ps --filter "name=vitta-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo -e "${GREEN}🎉 Pronto! Abra http://localhost:8080 no navegador${NC}"
