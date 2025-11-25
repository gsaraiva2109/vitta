#!/bin/bash

# Script to run the development environment using Docker Compose.
# This setup provides hot-reloading for both frontend and backend.

set -e

# Cores for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🚀 Iniciando Ambiente de Desenvolvimento Vitta   ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════╝${NC}"
echo ""

# Function to determine the correct docker compose command (v2 vs v1)
get_docker_compose_cmd() {
    if docker compose version &>/dev/null; then
        echo "docker compose"
    elif docker-compose version &>/dev/null; then
        echo "docker-compose"
    else
        echo >&2 "${RED}Erro: 'docker compose' ou 'docker-compose' não encontrado.${NC}"
        echo >&2 "${RED}Por favor, certifique-se de que o Docker Compose está instalado e no seu PATH.${NC}"
        exit 1
    fi
}

DOCKER_COMPOSE_CMD=$(get_docker_compose_cmd)
echo -e "${YELLOW}Usando comando Docker Compose: ${DOCKER_COMPOSE_CMD}${NC}"
echo ""

# Function to stop existing dev containers
cleanup() {
    echo -e "${YELLOW}🧹 Parando e removendo containers de desenvolvimento antigos...${NC}"
    $DOCKER_COMPOSE_CMD -f docker-compose.dev.yml down 2>/dev/null || true
    echo -e "${GREEN}✅ Limpeza concluída.${NC}"
    echo ""
}

cleanup

echo -e "${BLUE}🚀 Subindo os containers com Docker Compose... (pode levar um tempo no primeiro build)${NC}"
echo -e "${YELLOW}   Use 'Ctrl+C' para parar o ambiente.${NC}"
echo ""

# Start the services
$DOCKER_COMPOSE_CMD -f docker-compose.dev.yml up --build

# The 'down' command will be executed when the user stops the script with Ctrl+C
# thanks to the trap command.
trap "echo -e '\n\n${RED}🔴 Parando o ambiente de desenvolvimento...${NC}' && $DOCKER_COMPOSE_CMD -f docker-compose.dev.yml down && echo -e '${GREEN}✅ Ambiente parado com sucesso.${NC}'" SIGINT

# This part of the script might not be reached if `up` is in the foreground,
# but the trap will handle the cleanup.
echo -e "${GREEN}✅ Ambiente de desenvolvimento iniciado!${NC}"
