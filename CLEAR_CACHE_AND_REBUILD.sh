#!/bin/bash

# Clear cache and rebuild script for EC2 deployment
# This script clears Next.js build cache and rebuilds the application

echo "[v0] Clearing Next.js cache and rebuilding..."

# Remove build artifacts
echo "[v0] Removing .next folder..."
rm -rf .next

# Remove node_modules cache
echo "[v0] Removing node_modules/.cache..."
rm -rf node_modules/.cache

# Clear npm cache
echo "[v0] Clearing npm cache..."
npm cache clean --force

# Reinstall dependencies
echo "[v0] Reinstalling dependencies..."
npm install

# Rebuild the application
echo "[v0] Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "[v0] ✓ Build successful!"
    echo "[v0] You can now run: npm start"
else
    echo "[v0] ✗ Build failed. Check the errors above."
    exit 1
fi
