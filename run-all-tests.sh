#!/bin/bash

# Script to run all backend tests using Docker

set -e

# Pass --clean or --ci to this script
./run-test-env.sh \
    --title "Running All Vitta Backend Tests" \
    --cmd "npm test" \
    "$@"
