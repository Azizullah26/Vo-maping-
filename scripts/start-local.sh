#!/bin/bash
# =============================================================================
# UAE Interactive Map - Local Development Startup Script
# =============================================================================

set -e

echo "=========================================="
echo "UAE Interactive Map - Local Development"
echo "=========================================="

# Check if .env.local exists, if not create from .env.development
if [ ! -f .env.local ]; then
    echo "Creating .env.local from .env.development..."
    cp .env.development .env.local
    echo "Please update .env.local with your actual credentials"
fi

# Load environment variables
if [ -f .env.local ]; then
    set -a
    source .env.local
    set +a
    echo "Loaded environment from .env.local"
fi

# Install dependencies if needed
if [ ! -d node_modules ]; then
    echo "Installing dependencies..."
    npm install
fi

echo ""
echo "Starting development server..."
echo "Access at: http://localhost:3000"
echo ""

npm run dev
