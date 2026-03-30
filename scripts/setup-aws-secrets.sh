#!/bin/bash
# =============================================================================
# UAE Interactive Map - AWS Secrets Manager Setup
# =============================================================================
# This script creates secrets in AWS Secrets Manager from your .env file
# Prerequisites: AWS CLI configured with appropriate permissions
# =============================================================================

set -e

AWS_REGION="${AWS_REGION:-us-east-1}"
SECRET_PREFIX="uae-map"

echo "=========================================="
echo "AWS Secrets Manager Setup"
echo "=========================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please create a .env file from .env.example"
    exit 1
fi

# Load environment variables
set -a
source .env
set +a

# Function to create or update secret
create_secret() {
    local name=$1
    local value=$2
    
    if [ -z "$value" ]; then
        echo "Skipping $name (empty value)"
        return
    fi
    
    secret_name="$SECRET_PREFIX/$name"
    
    # Check if secret exists
    if aws secretsmanager describe-secret --secret-id "$secret_name" --region "$AWS_REGION" 2>/dev/null; then
        echo "Updating secret: $secret_name"
        aws secretsmanager put-secret-value \
            --secret-id "$secret_name" \
            --secret-string "$value" \
            --region "$AWS_REGION"
    else
        echo "Creating secret: $secret_name"
        aws secretsmanager create-secret \
            --name "$secret_name" \
            --secret-string "$value" \
            --region "$AWS_REGION"
    fi
}

echo "Creating/updating secrets in AWS Secrets Manager..."
echo ""

# Create secrets for each environment variable
create_secret "supabase-url" "$NEXT_PUBLIC_SUPABASE_URL"
create_secret "supabase-anon-key" "$NEXT_PUBLIC_SUPABASE_ANON_KEY"
create_secret "supabase-service-role-key" "$SUPABASE_SERVICE_ROLE_KEY"
create_secret "mapbox-token" "$MAPBOX_ACCESS_TOKEN"
create_secret "cesium-token" "$CESIUM_ACCESS_TOKEN"
create_secret "sso-api-key" "$SSO_API_KEY"
create_secret "postgres-url" "$POSTGRES_URL"
create_secret "postgres-host" "$POSTGRES_HOST"
create_secret "postgres-user" "$POSTGRES_USER"
create_secret "postgres-password" "$POSTGRES_PASSWORD"
create_secret "postgres-database" "$POSTGRES_DATABASE"

echo ""
echo "=========================================="
echo "Secrets setup complete!"
echo "=========================================="
echo ""
echo "Secrets created with prefix: $SECRET_PREFIX/"
echo "Region: $AWS_REGION"
echo ""
