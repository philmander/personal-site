#!/bin/bash

# Script to ensure correct Docker registry login for this project
# Usage: ./scripts/docker-login.sh

set -e

REGISTRY="registry.digitalocean.com"
PROJECT_NAME="personal-site"

echo "===================================="
echo "Docker Login for $PROJECT_NAME"
echo "===================================="
echo ""

# Check if already logged in
if docker-credential-desktop list 2>/dev/null | grep -q "$REGISTRY" || grep -q "$REGISTRY" ~/.docker/config.json 2>/dev/null; then
    echo "✓ Already logged in to $REGISTRY"
    echo ""
    read -p "Do you want to login again? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

echo ""
echo "Choose authentication method:"
echo "  1) Interactive login (username/password)"
echo "  2) API token (recommended)"
echo "  3) doctl CLI"
echo ""
read -p "Select option (1-3): " -n 1 -r
echo ""

case $REPLY in
    1)
        echo "Logging in with username/password..."
        docker login "$REGISTRY"
        ;;
    2)
        if [ -z "$DO_API_TOKEN" ]; then
            echo "Error: DO_API_TOKEN environment variable not set"
            echo ""
            echo "Get your token from: https://cloud.digitalocean.com/account/api/tokens"
            echo "Then run: export DO_API_TOKEN=your_token_here"
            exit 1
        fi
        echo "Logging in with API token..."
        echo "$DO_API_TOKEN" | docker login "$REGISTRY" -u "$DO_API_TOKEN" --password-stdin
        ;;
    3)
        if ! command -v doctl &> /dev/null; then
            echo "Error: doctl CLI not found"
            echo "Install it from: https://docs.digitalocean.com/reference/doctl/how-to/install/"
            exit 1
        fi
        echo "Logging in with doctl..."
        doctl registry login
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac

echo ""
echo "✓ Successfully logged in to $REGISTRY"
echo ""
echo "You can now run:"
echo "  npm run docker:push"
