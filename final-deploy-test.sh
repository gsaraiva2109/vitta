#!/bin/bash

# Script to simulate a CI/CD pipeline locally before pushing to Git.
# It runs linters, backend tests, and a final build to catch common errors.

set -e

# --- Configuration ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# --- Functions ---
run_step() {
    echo -e "\n${BLUE}════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}║ 🚀 Starting Step: $1 ${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}\n"
    eval $2
    echo -e "\n${GREEN}✅ Step successful: $1 ${NC}"
}

# --- Main Execution ---
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    🔬 Running Final Pre-Push Checks 🔬     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"

# Step 1: Lint API
run_step "Linting API" "docker run --rm -v ./api:/usr/src/app -w /usr/src/app node:20-alpine npm install && docker run --rm -v ./api:/usr/src/app -w /usr/src/app node:20-alpine npm run lint"

# Step 2: Lint Frontend
run_step "Linting Frontend" "docker run --rm -v ./frontend:/app -w /app node:20-alpine npm install && docker run --rm -v ./frontend:/app -w /app node:20-alpine npm run lint"

# Step 3: Run Backend Tests in a clean environment
run_step "Running Backend Tests" "./run-all-tests.sh --clean"

# Step 4: Run Local Deploy in a clean environment
run_step "Running Local Deployment" "./deploy-local.sh --clean"

# Step 5: Stop the local deployment
run_step "Stopping Local Deployment" "./stop-local.sh"


# Step 6: Run CodeQL Scan (Security Check)
run_step "Running CodeQL Security Scan" "
    echo -e '${YELLOW}Setting up CodeQL...${NC}'
    # Download and extract CodeQL CLI if not present
    if [ ! -d 'codeql-cli' ]; then
        wget https://github.com/github/codeql-action/releases/download/codeql-bundle-v2.15.3/codeql-bundle-linux64.tar.gz
        tar -xzf codeql-bundle-linux64.tar.gz
        mv codeql codeql-cli
        rm codeql-bundle-linux64.tar.gz
    fi

    DB_PATH='codeql-db'
    echo -e '${YELLOW}Creating CodeQL database...${NC}'
    # Remove old database if it exists
    rm -rf \${DB_PATH}
    ./codeql-cli/codeql database create \${DB_PATH} --language=javascript --source-root .

    echo -e '${YELLOW}Analyzing database for vulnerabilities...${NC}'
    ./codeql-cli/codeql database analyze \${DB_PATH} --format=sarif-latest --output=codeql-results.sarif --sarif-category=\"JavaScript\" 'javascript-security-and-quality'

    echo -e '${YELLOW}Cleaning up CodeQL artifacts...${NC}'
    rm -rf \${DB_PATH}
    rm -rf codeql-cli

    echo -e '${GREEN}CodeQL scan finished. Results are in codeql-results.sarif${NC}'
"

echo -e "\n\n${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}║  ✅ All checks passed! It is likely safe to push now.  ║${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
