#!/bin/bash

# Check Node.js version
REQUIRED_NODE_VERSION=22
CURRENT_NODE_VERSION=$(node -v | cut -d'.' -f1 | sed 's/v//')

if (( CURRENT_NODE_VERSION < REQUIRED_NODE_VERSION )); then
    echo "Error: Node.js version must be $REQUIRED_NODE_VERSION or higher. Current version is $CURRENT_NODE_VERSION."
    exit 1
fi

# Navigate to the script's directory
cd "$(dirname "$0")"/..

# Run Biome lint for the entire project
echo -e "\033[1mRunning Biome lint\033[0m"
if pnpm lint; then
    echo -e "\033[1;32mLint completed successfully\033[0m"
else
    echo -e "\033[1;31mLint failed\033[0m"
    exit 1
fi

echo -e "\033[1mLint process completed.😎\033[0m"
