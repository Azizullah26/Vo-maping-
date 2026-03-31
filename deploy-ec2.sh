#!/bin/bash

# EC2 Deployment Script for EL RACE Projects
# This script ensures environment variables are properly loaded

echo "==================================="
echo "EL RACE Projects - EC2 Deployment"
echo "==================================="

# Step 1: Export environment variables
echo ""
echo "[1] Setting up environment variables..."
export NEXT_PUBLIC_SUPABASE_URL="https://cfeggyysgopkzygaitzw.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_tfbqgeRZ-TsFNP67InEi9Q_IZu6oVa2"
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmZWdneXlzZ29wa3p5Z2FpdHp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzczNTQxOSwiZXhwIjoyMDg5MzExNDE5fQ.TeZkTGZHz6pmj7vGuWiGiZJ5Il0r9M88fquJizWSTtk"
export POSTGRES_URL="postgres://postgres.pbqfgjzvclwgxgvuzmul:lOxrvMkSnvagpt8i@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
export POSTGRES_URL_NON_POOLING="postgres://postgres.pbqfgjzvclwgxgvuzmul:lOxrvMkSnvagpt8i@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
export POSTGRES_PRISMA_URL="postgres://postgres.pbqfgjzvclwgxgvuzmul:lOxrvMkSnvagpt8i@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
export POSTGRES_HOST="db.pbqfgjzvclwgxgvuzmul.supabase.co"
export POSTGRES_PASSWORD="lOxrvMkSnvagpt8i"
export DATABASE_URL="postgres://postgres.pbqfgjzvclwgxgvuzmul:lOxrvMkSnvagpt8i@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
export MAPBOX_ACCESS_TOKEN="pk.eyJ1IjoiYXppenVsbGFoMjYxMSIsImEiOiJjbWJzeDkxMDMwd3JhMmtzZHd0Ym9sZm44In0.V2TEaa53IsuNBxLXm4SXSg"
export CESIUM_ACCESS_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlNGQzNjY4Ni1iNDk0LTQ0ZTAtYjE2MS1hNGZkMTI2MWFjZjEiLCJpZCI6MTEzODQ4LCJpYXQiOjE3NTExNDk2MjAsImV4cCI6MTc4MjY4NzYyMH0.HX3cefA-PNjPcXHMSXWx_iZMfLJNZBdpWmxgUH5y5uU"
export SSO_API_KEY="rcc0085_map_security"
export NEXT_PUBLIC_APP_URL="http://localhost:3000"
export DEMO_MODE="false"
export STATIC_MODE="false"

echo "[✓] Environment variables set"

# Step 2: Verify Mapbox token is accessible
echo ""
echo "[2] Verifying Mapbox token..."
if [ -z "$MAPBOX_ACCESS_TOKEN" ]; then
  echo "[✗] ERROR: MAPBOX_ACCESS_TOKEN not set!"
  exit 1
else
  echo "[✓] MAPBOX_ACCESS_TOKEN is configured: ${MAPBOX_ACCESS_TOKEN:0:10}..."
fi

# Step 3: Clear and rebuild
echo ""
echo "[3] Cleaning build cache..."
rm -rf .next
echo "[✓] Cache cleared"

echo ""
echo "[4] Building application..."
npm run build
if [ $? -ne 0 ]; then
  echo "[✗] Build failed!"
  exit 1
fi
echo "[✓] Build completed successfully"

# Step 4: Start the application
echo ""
echo "[5] Starting application..."
echo "Application will be available at http://YOUR_EC2_IP:3000"
echo ""

npm start
