#!/bin/bash

# Script to deploy the Vitta application locally using Docker.
# This script avoids docker-compose and uses only docker commands.

set -e

# --- Configuration ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

NETWORK_NAME="vitta-local-network"
DB_CONTAINER_NAME="vitta-db-local"
API_CONTAINER_NAME="vitta-api-local"
FRONTEND_CONTAINER_NAME="vitta-frontend-local"

API_IMAGE_NAME="vitta-api:local"
FRONTEND_IMAGE_NAME="vitta-frontend:local"

# --- Parameters ---
CLEAN_BUILD=false
if [ "$1" == "--clean" ]; then
    CLEAN_BUILD=true
fi

# --- Main Execution ---
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    🚀 Deploying Vitta Locally 🚀         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

if [ "$CLEAN_BUILD" = true ]; then
    echo -e "${YELLOW}🧹 Pruning Docker system (images, containers, networks)...${NC}"
    docker system prune -af
    echo ""
fi

# Cleanup old app containers before starting
./stop-local.sh

echo -e "${BLUE}🌐 Ensuring Docker network exists...${NC}"
docker network create "$NETWORK_NAME" >/dev/null 2>&1 || true

# Check if DB container exists and start it, or create it if it doesn't.
if [ ! "$(docker ps -q -f name=$DB_CONTAINER_NAME)" ]; then
    if [ ! "$(docker ps -aq -f status=exited -f name=$DB_CONTAINER_NAME)" ]; then
        echo -e "${BLUE}🗄️  Creating PostgreSQL container for the first time...${NC}"
        docker run -d \
            --name "$DB_CONTAINER_NAME" \
            --network "$NETWORK_NAME" \
            -e POSTGRES_USER=postgres \
            -e POSTGRES_PASSWORD=password \
            -e POSTGRES_DB=vitta_local \
            -v vitta-postgres-data:/var/lib/postgresql/data \
            -p 5433:5432 \
            --restart unless-stopped \
            postgres:15-alpine
    else
        echo -e "${BLUE}🗄️  Starting existing PostgreSQL container...${NC}"
        docker start "$DB_CONTAINER_NAME"
    fi
    echo -e "${YELLOW}⏳ Waiting for database to be ready...${NC}"
    sleep 10
else
    echo -e "${GREEN}✅ PostgreSQL container is already running.${NC}"
fi

echo -e "${BLUE}🏗️  Building API image...${NC}"
docker build -t "$API_IMAGE_NAME" --target production -f api/Dockerfile api

echo -e "${BLUE}🚀 Starting API container...${NC}"
docker run -d \
    --name "$API_CONTAINER_NAME" \
    --network "$NETWORK_NAME" \
    -p 3000:3000 \
    -e NODE_ENV=development \
    -e DB_HOST="$DB_CONTAINER_NAME" \
    -e DB_USER=postgres \
    -e DB_PASSWORD=password \
    -e DB_NAME=vitta_local \
    -e DB_PORT=5432 \
    -e PORT=3000 \
    --restart unless-stopped \
    "$API_IMAGE_NAME"

echo -e "${BLUE}🏗️  Building frontend image...${NC}"
docker build -t "$FRONTEND_IMAGE_NAME" frontend

echo -e "${BLUE}🚀 Starting frontend container...${NC}"
docker run -d \
    --name "$FRONTEND_CONTAINER_NAME" \
    --network "$NETWORK_NAME" \
    -p 8080:80 \
    -e BACKEND_URL="$API_CONTAINER_NAME:3000" \
    --restart unless-stopped \
    "$FRONTEND_IMAGE_NAME"

echo ""
echo -e "${GREEN}✅ Vitta is running!${NC}"
echo "➡️ Frontend: http://localhost:8080"
echo "➡️ API: http://localhost:3000"
echo "➡️ To view logs, run: ./logs-local.sh"
echo "➡️ To stop, run: ./stop-local.sh"
