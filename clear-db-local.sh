#!/bin/bash

# Script to clear all data from the local Vitta database.

set -e

DB_CONTAINER_NAME="vitta-db-local"

echo "--- Checking for running database container... ---"
if [ ! "$(docker ps -q -f name=$DB_CONTAINER_NAME)" ]; then
    echo "❌ Database container '$DB_CONTAINER_NAME' is not running."
    echo "Please start the application with './deploy-local.sh' first."
    exit 1
fi

echo "--- Clearing database tables (maquinas, manutencoes)... ---"
docker exec -i "$DB_CONTAINER_NAME" psql -U postgres -d vitta_local <<-EOSQL
    TRUNCATE TABLE "manutencoes", "maquinas" RESTART IDENTITY CASCADE;
EOSQL

echo "✅ Database tables have been cleared."
