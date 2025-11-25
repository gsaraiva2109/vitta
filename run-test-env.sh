#!/bin/bash

# Common script to set up a test environment and run tests
# Not intended to be run directly by the user.

set -e

# --- Configuration ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

NETWORK_NAME="vitta-test-network"
DB_CONTAINER_NAME="vitta-db-test"
BACKEND_CONTAINER_NAME="vitta-backend-test"
BACKEND_IMAGE_NAME="vitta-backend:test"

# --- Parameters ---
CLEAN_BUILD=false
TEST_COMMAND="npm test"
SCRIPT_TITLE="Vitta Backend Tests"

# Parse arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --clean) CLEAN_BUILD=true ;;
        --cmd) TEST_COMMAND="$2"; shift ;;
        --title) SCRIPT_TITLE="$2"; shift ;;
        --ci) CI_MODE=true ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

# --- Functions ---
cleanup() {
    echo_ci "${YELLOW}🧹 Cleaning up old test containers and network...${NC}"
    docker stop "$BACKEND_CONTAINER_NAME" 2>/dev/null || true
    docker rm "$BACKEND_CONTAINER_NAME" 2>/dev/null || true
    docker stop "$DB_CONTAINER_NAME" 2>/dev/null || true
    docker rm "$DB_CONTAINER_NAME" 2>/dev/null || true
    docker network rm "$NETWORK_NAME" 2>/dev/null || true
    echo_ci "${GREEN}✅ Cleanup complete.${NC}"
    echo_ci ""
}

echo_ci() {
    if [ "$CI_MODE" = false ]; then
        echo -e "$@"
    fi
}

# --- Main Execution ---
echo_ci "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo_ci "${BLUE}║    🚀 $SCRIPT_TITLE 🚀     ║${NC}"
echo_ci "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo_ci ""

if [ "$CLEAN_BUILD" = true ]; then
    echo_ci "${YELLOW}🧹 Pruning Docker system (images, containers, networks)...${NC}"
    docker system prune -af
    echo_ci ""
fi

cleanup

echo_ci "${BLUE}🌐 Creating Docker network...${NC}"
docker network create "$NETWORK_NAME"

echo_ci "${BLUE}🗄️  Starting PostgreSQL container...${NC}"
docker run -d \
    --name "$DB_CONTAINER_NAME" \
    --network "$NETWORK_NAME" \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=vitta_test \
    postgres:15-alpine

echo_ci "${YELLOW}⏳ Waiting for database to be ready...${NC}"
sleep 10

if [ "$CLEAN_BUILD" = true ]; then
    echo_ci "${BLUE}🏗️  Building backend test image (no cache)...${NC}"
    docker build --no-cache -t "$BACKEND_IMAGE_NAME" --target test -f api/Dockerfile .
else
    echo_ci "${BLUE}🏗️  Building backend test image...${NC}"
    docker build -t "$BACKEND_IMAGE_NAME" --target test -f api/Dockerfile .
fi

echo_ci "${BLUE}🚀 Running tests with command: $TEST_COMMAND...${NC}"

EXIT_CODE=0
docker run \
    --name "$BACKEND_CONTAINER_NAME" \
    --network "$NETWORK_NAME" \
    -e NODE_ENV=test \
    -e TZ='UTC' \
    -e DB_HOST="$DB_CONTAINER_NAME" \
    -e DB_USER=postgres \
    -e DB_PASSWORD=postgres \
    -e DB_NAME=vitta_test \
    -e DB_PORT=5432 \
    "$BACKEND_IMAGE_NAME" $TEST_COMMAND || EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo_ci "${GREEN}✅ Tests completed successfully!${NC}"
else
    echo_ci "${RED}❌ Tests failed with exit code $EXIT_CODE.${NC}"
fi

# Final cleanup
cleanup

exit $EXIT_CODE
