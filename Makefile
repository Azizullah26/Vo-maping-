# =============================================================================
# UAE Interactive Map - Makefile
# =============================================================================
# Usage: make <target>
# =============================================================================

.PHONY: help install dev build start clean docker-build docker-up docker-down aws-deploy aws-secrets

# Default target
help:
	@echo "UAE Interactive Map - Available Commands"
	@echo "========================================"
	@echo ""
	@echo "Development:"
	@echo "  make install      - Install dependencies"
	@echo "  make dev          - Start development server"
	@echo "  make build        - Build for production"
	@echo "  make start        - Start production server"
	@echo "  make clean        - Clean build artifacts"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build - Build Docker image"
	@echo "  make docker-up    - Start Docker containers"
	@echo "  make docker-down  - Stop Docker containers"
	@echo "  make docker-logs  - View Docker logs"
	@echo ""
	@echo "AWS:"
	@echo "  make aws-secrets  - Setup AWS Secrets Manager"
	@echo "  make aws-deploy   - Deploy to AWS ECR"
	@echo ""
	@echo "Environment:"
	@echo "  make env-setup    - Create .env from template"
	@echo "  make env-check    - Validate environment variables"
	@echo ""

# Development commands
install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

clean:
	rm -rf .next node_modules

# Docker commands
docker-build:
	docker-compose build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

docker-restart:
	docker-compose restart

docker-clean:
	docker-compose down -v --rmi all

# AWS commands
aws-secrets:
	chmod +x scripts/setup-aws-secrets.sh
	./scripts/setup-aws-secrets.sh

aws-deploy:
	chmod +x scripts/deploy-aws.sh
	./scripts/deploy-aws.sh

# Environment commands
env-setup:
	@if [ ! -f .env.local ]; then \
		cp .env.example .env.local; \
		echo "Created .env.local from .env.example"; \
		echo "Please edit .env.local with your credentials"; \
	else \
		echo ".env.local already exists"; \
	fi

env-check:
	@echo "Checking required environment variables..."
	@if [ -f .env.local ]; then \
		. .env.local && \
		if [ -z "$$NEXT_PUBLIC_SUPABASE_URL" ]; then echo "Missing: NEXT_PUBLIC_SUPABASE_URL"; fi && \
		if [ -z "$$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then echo "Missing: NEXT_PUBLIC_SUPABASE_ANON_KEY"; fi && \
		if [ -z "$$MAPBOX_ACCESS_TOKEN" ]; then echo "Missing: MAPBOX_ACCESS_TOKEN"; fi && \
		echo "Environment check complete"; \
	else \
		echo "No .env.local file found. Run 'make env-setup' first."; \
	fi

# Utility commands
lint:
	npm run lint

test:
	npm test

logs:
	@if [ -f .next/server/pages-manifest.json ]; then \
		tail -f .next/server/*.log 2>/dev/null || echo "No logs found"; \
	else \
		echo "Application not built. Run 'make build' first."; \
	fi
