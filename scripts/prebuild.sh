#!/bin/bash
# Clean up lock files to ensure npm is used consistently
rm -f pnpm-lock.yaml yarn.lock bun.lockb package-lock.json
echo "✓ Cleaned lock files - using npm only"

# Clean npm cache to free up space
npm cache clean --force 2>/dev/null || true
echo "✓ Cleaned npm cache"
