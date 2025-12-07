#!/bin/bash
# Remove all lock files to ensure npm is used
rm -f pnpm-lock.yaml
rm -f yarn.lock
rm -f bun.lockb
echo "Cleaned lock files - using npm only"
