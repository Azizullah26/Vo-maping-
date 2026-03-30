#!/bin/bash
# =============================================================================
# UAE Interactive Map - EC2 User Data Script
# =============================================================================
# This script is used as EC2 user data to bootstrap an instance
# It installs Docker, pulls the image, and starts the application
# =============================================================================

set -e

# Update system
yum update -y

# Install Docker
amazon-linux-extras install docker -y
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install AWS CLI (if not present)
yum install -y aws-cli

# Create application directory
mkdir -p /opt/uae-map
cd /opt/uae-map

# Get secrets from AWS Secrets Manager
AWS_REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/region)

get_secret() {
    aws secretsmanager get-secret-value --secret-id "$1" --region "$AWS_REGION" --query SecretString --output text 2>/dev/null || echo ""
}

# Create .env file from secrets
cat > /opt/uae-map/.env << EOF
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# Supabase
NEXT_PUBLIC_SUPABASE_URL=$(get_secret "uae-map/supabase-url")
NEXT_PUBLIC_SUPABASE_ANON_KEY=$(get_secret "uae-map/supabase-anon-key")
SUPABASE_SERVICE_ROLE_KEY=$(get_secret "uae-map/supabase-service-role-key")

# Mapbox
MAPBOX_ACCESS_TOKEN=$(get_secret "uae-map/mapbox-token")

# Cesium
CESIUM_ACCESS_TOKEN=$(get_secret "uae-map/cesium-token")

# SSO
SSO_API_KEY=$(get_secret "uae-map/sso-api-key")

# PostgreSQL
POSTGRES_URL=$(get_secret "uae-map/postgres-url")
POSTGRES_HOST=$(get_secret "uae-map/postgres-host")
POSTGRES_USER=$(get_secret "uae-map/postgres-user")
POSTGRES_PASSWORD=$(get_secret "uae-map/postgres-password")
POSTGRES_DATABASE=$(get_secret "uae-map/postgres-database")

# Build settings
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_STATIC_MODE=false
NODE_OPTIONS=--max-old-space-size=3072
NEXT_TELEMETRY_DISABLED=1
EOF

# Create docker-compose.yml
cat > /opt/uae-map/docker-compose.yml << 'EOF'
version: "3.9"

services:
  app:
    image: ${ECR_IMAGE:-uae-interactive-map:latest}
    container_name: uae-map-app
    restart: unless-stopped
    ports:
      - "80:3000"
    env_file:
      - .env
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
EOF

# Login to ECR and pull image (if using ECR)
# Uncomment and configure these lines if using ECR:
# AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
# aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
# docker pull $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/uae-interactive-map:latest

# Start the application
cd /opt/uae-map
docker-compose up -d

# Set up log rotation
cat > /etc/logrotate.d/docker << 'EOF'
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=50M
    missingok
    delaycompress
    copytruncate
}
EOF

echo "UAE Interactive Map deployment complete!"
