#!/bin/bash
# =============================================================================
# UAE Interactive Map - AWS Deployment Script
# =============================================================================
# This script builds and deploys the application to AWS
# Prerequisites: Docker, AWS CLI configured
# =============================================================================

set -e

# Configuration
APP_NAME="uae-interactive-map"
AWS_REGION="${AWS_REGION:-us-east-1}"
ECR_REPO="${ECR_REPO:-$APP_NAME}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

echo "=========================================="
echo "UAE Interactive Map - AWS Deployment"
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

echo "1. Building Docker image..."
docker build \
    --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
    --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    --build-arg NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY" \
    --build-arg NEXT_PUBLIC_DEMO_MODE="$NEXT_PUBLIC_DEMO_MODE" \
    --build-arg NEXT_PUBLIC_STATIC_MODE="$NEXT_PUBLIC_STATIC_MODE" \
    -t "$APP_NAME:$IMAGE_TAG" \
    -f Dockerfile .

echo "2. Tagging image for ECR..."
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO"

docker tag "$APP_NAME:$IMAGE_TAG" "$ECR_URI:$IMAGE_TAG"

echo "3. Logging into ECR..."
aws ecr get-login-password --region "$AWS_REGION" | \
    docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

echo "4. Creating ECR repository (if not exists)..."
aws ecr describe-repositories --repository-names "$ECR_REPO" --region "$AWS_REGION" 2>/dev/null || \
    aws ecr create-repository --repository-name "$ECR_REPO" --region "$AWS_REGION"

echo "5. Pushing image to ECR..."
docker push "$ECR_URI:$IMAGE_TAG"

echo "=========================================="
echo "Deployment complete!"
echo "Image: $ECR_URI:$IMAGE_TAG"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Create/update ECS task definition with this image"
echo "2. Configure environment variables in ECS/EKS"
echo "3. Set up ALB/Target Group if needed"
echo ""
