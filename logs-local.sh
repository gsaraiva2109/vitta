#!/bin/bash

# Script para ver logs dos containers em tempo real
# Uso: ./logs-local.sh [frontend|backend]

# Cores
BLUE='\033[0;34m'
NC='\033[0m'

SERVICE=$1

if [ -z "$SERVICE" ]; then
    echo -e "${BLUE}📋 Please specify a service to tail logs:${NC}"
    echo "Usage: ./logs-local.sh [api|frontend]"
    exit 1
elif [ "$SERVICE" == "frontend" ]; then
    echo -e "${BLUE}📋 Tailing logs for frontend (Ctrl+C to stop):${NC}"
    docker logs -f vitta-frontend-local
elif [ "$SERVICE" == "api" ]; then
    echo -e "${BLUE}📋 Tailing logs for api (Ctrl+C to stop):${NC}"
    docker logs -f vitta-api-local
else
    echo "Usage: ./logs-local.sh [frontend|api]"
    exit 1
fi
