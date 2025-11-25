#!/bin/bash

# Script to update Jest snapshots using Docker

set -e

# Pass --clean to this script to force a prune and no-cache build
./run-test-env.sh \
    --title "Updating Jest Snapshots" \
    --cmd "npm test -- -u" \
    "$@"
