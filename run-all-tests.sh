#!/bin/bash
# Script para rodar todas as verificações e testes do projeto.

# Fail fast
set -e

# Verifica se o script deve pular a inicialização do banco de dados
SKIP_DB_SETUP=false
if [ "$1" == "--ci" ]; then
  SKIP_DB_SETUP=true
fi

cleanup() {
  if [ "$SKIP_DB_SETUP" = false ]; then
    echo "--- Desligando o banco de dados de teste... ---"
    docker stop vitta_db_test > /dev/null 2>&1 || true
  fi
}

# Garante que o cleanup será chamado ao sair do script
trap cleanup EXIT

if [ "$SKIP_DB_SETUP" = false ]; then
  echo "--- Iniciando o banco de dados de teste em background... ---"
  docker run -d --name vitta_db_test \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=vitta_test \
    -p 5432:5432 \
    --rm \
    postgres:13


  echo "--- Aguardando o banco de dados iniciar... ---"
  sleep 5
fi

echo "--- Rodando os testes do Backend... ---"
cd api
# No CI, o host do banco é 'postgres', localmente é 'localhost'
export DB_HOST=${DB_HOST:-localhost}
npm install
npm test
cd ..

echo "--- Rodando o linter do Frontend... ---"
cd frontend
npm install
npm run lint
cd ..

echo "--- Todos os testes passaram com sucesso! ---"

