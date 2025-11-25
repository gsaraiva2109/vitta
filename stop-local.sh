#!/bin/bash
set -e

# --- Configuration ---
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

NETWORK_NAME="vitta-local-network"
DB_CONTAINER_NAME="vitta-db-local"
API_CONTAINER_NAME="vitta-api-local"
FRONTEND_CONTAINER_NAME="vitta-frontend-local"

echo -e "${YELLOW}🧹 Stopping application containers...${NC}"
docker rm -f "$FRONTEND_CONTAINER_NAME" 2>/dev/null || true
docker rm -f "$API_CONTAINER_NAME" 2>/dev/null || true

# We only stop the database to persist its data
docker stop "$DB_CONTAINER_NAME" 2>/dev/null || true

echo -e "${GREEN}✅ Application cleanup complete. Database data is preserved.${NC}"
