#!/bin/bash

# Script to run a single backend test file using Docker
# Usage: ./run-feature.sh [path_to_test_file] [--clean] [--ci]

set -e

RED='\033[0;31m'
NC='\033[0m'

TEST_FILE=""
OTHER_ARGS=()

# Separate the test file from other arguments like --clean
for arg in "$@"; do
  if [[ "$arg" == "--"* ]]; then
    OTHER_ARGS+=("$arg")
  else
    if [ -n "$TEST_FILE" ]; then
      echo -e "${RED}❌ Error: Please specify only one test file.${NC}"
      exit 1
    fi
    TEST_FILE=$arg
  fi
done

if [ -z "$TEST_FILE" ]; then
    echo -e "${RED}❌ Error: No test file specified.${NC}"
    echo "Usage: ./run-feature.sh [path_to_test_file] [--clean]"
    exit 1
fi

# Pass --clean to this script to force a prune and no-cache build
./run-test-env.sh \
    --title "Running Vitta Feature Test" \
    --cmd "npm test -- \"$TEST_FILE\"" \
    "${OTHER_ARGS[@]}"
