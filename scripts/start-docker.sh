#!/bin/bash
# =============================================================================
# UAE Interactive Map - Docker Local Deployment
# =============================================================================

set -e

echo "=========================================="
echo "UAE Interactive Map - Docker Deployment"
echo "=========================================="

# Check if .env exists
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo "Creating .env from .env.example..."
        cp .env.example .env
        echo "Please update .env with your actual credentials before running again"
        exit 1
    else
        echo "Error: No .env or .env.example file found!"
        exit 1
    fi
fi

# Load environment variables
set -a
source .env
set +a

echo "Building and starting containers..."
docker-compose up --build -d

echo ""
echo "=========================================="
echo "Deployment complete!"
echo "Access at: http://localhost:3000"
echo "=========================================="
echo ""
echo "Useful commands:"
echo "  View logs:    docker-compose logs -f"
echo "  Stop:         docker-compose down"
echo "  Restart:      docker-compose restart"
echo ""
