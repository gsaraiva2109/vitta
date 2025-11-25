#!/bin/bash
# Script to run CodeQL analysis locally.

set -e

# --- Configuration ---
CODEQL_CLI_VERSION="v2.16.6"
CODEQL_CLI_DIR="codeql-cli"
CODEQL_DATABASE_DIR="codeql-db"
LANGUAGE="javascript"

# --- Main Execution ---
echo "--- Setting up CodeQL CLI ---"

if [ ! -d "$CODEQL_CLI_DIR" ]; then
  echo "CodeQL CLI not found. Downloading..."
  wget "https://github.com/github/codeql-cli-binaries/releases/download/${CODEQL_CLI_VERSION}/codeql-linux64.zip"
  unzip -q codeql-linux64.zip -d "$CODEQL_CLI_DIR"
  mv codeql-cli/codeql/* codeql-cli/
  rm codeql-linux64.zip
else
  echo "CodeQL CLI already downloaded."
fi

echo "--- Creating CodeQL database ---"
if [ -d "$CODEQL_DATABASE_DIR" ]; then
  rm -rf "$CODEQL_DATABASE_DIR"
fi

./codeql-cli/codeql database create "$CODEQL_DATABASE_DIR" --language="$LANGUAGE" --source-root .

echo "--- Running CodeQL analysis ---"
./codeql-cli/codeql database analyze "$CODEQL_DATABASE_DIR" --format=sarif-latest --output=codeql-results.sarif javascript-code-scanning.qls

echo "--- CodeQL analysis complete ---"
echo "Results saved to codeql-results.sarif"
