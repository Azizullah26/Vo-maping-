# UAE Interactive Map - Deployment Guide

This guide covers deploying the UAE Interactive Map application both locally and on AWS.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Local Development](#local-development)
4. [Docker Deployment](#docker-deployment)
5. [AWS Deployment](#aws-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js** 20.x or 22.x
- **npm** 9.x or higher
- **Docker** (for containerized deployment)
- **AWS CLI** (for AWS deployment)

### Required Accounts/Services

- **Supabase** account for database
- **Mapbox** account for maps
- **Cesium** account (optional, for 3D terrain)
- **AWS** account (for cloud deployment)

---

## Environment Variables

### Setting Up Environment Variables

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local    # For local development
   cp .env.example .env          # For Docker/AWS deployment
   ```

2. **Edit the file with your credentials:**
   ```bash
   nano .env.local   # or use any text editor
   ```

### Required Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes (for admin) |
| `MAPBOX_ACCESS_TOKEN` | Mapbox API token | Yes |
| `CESIUM_ACCESS_TOKEN` | Cesium ion token | Optional |
| `SSO_API_KEY` | SSO integration key | Optional |

### Demo Mode

To run without a database (demo mode):
```env
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_STATIC_MODE=false
```

---

## Local Development

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open http://localhost:3000 in your browser.

### Using the Startup Script

```bash
chmod +x scripts/start-local.sh
npm run start:local
```

---

## Docker Deployment

### Local Docker Deployment

1. **Create environment file:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

2. **Build and start containers:**
   ```bash
   docker-compose up --build -d
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop containers:**
   ```bash
   docker-compose down
   ```

### Using the Docker Script

```bash
chmod +x scripts/start-docker.sh
npm run start:docker
```

---

## AWS Deployment

### Option 1: ECS Fargate (Recommended)

#### Step 1: Set Up AWS Secrets

```bash
chmod +x scripts/setup-aws-secrets.sh
./scripts/setup-aws-secrets.sh
```

#### Step 2: Build and Push to ECR

```bash
chmod +x scripts/deploy-aws.sh
./scripts/deploy-aws.sh
```

#### Step 3: Deploy Infrastructure

Using CloudFormation:
```bash
aws cloudformation create-stack \
  --stack-name uae-map-production \
  --template-body file://aws/cloudformation-template.yaml \
  --parameters \
    ParameterKey=VpcId,ParameterValue=vpc-xxxxx \
    ParameterKey=SubnetIds,ParameterValue="subnet-xxxxx,subnet-yyyyy" \
    ParameterKey=ContainerImage,ParameterValue=<ECR_IMAGE_URI> \
  --capabilities CAPABILITY_IAM
```

### Option 2: EC2 with Docker

1. **Launch EC2 instance** (Amazon Linux 2 or Ubuntu)

2. **Install Docker:**
   ```bash
   sudo yum install -y docker
   sudo systemctl start docker
   sudo usermod -aG docker ec2-user
   ```

3. **Install Docker Compose:**
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

4. **Clone and deploy:**
   ```bash
   git clone <your-repo-url>
   cd <project-directory>
   cp .env.example .env
   # Edit .env with your credentials
   docker-compose up -d
   ```

### Option 3: Elastic Beanstalk

1. **Create `Dockerrun.aws.json`:**
   ```json
   {
     "AWSEBDockerrunVersion": "1",
     "Image": {
       "Name": "<ECR_IMAGE_URI>",
       "Update": "true"
     },
     "Ports": [
       { "ContainerPort": 3000, "HostPort": 80 }
     ]
   }
   ```

2. **Deploy with EB CLI:**
   ```bash
   eb init
   eb create uae-map-production
   ```

---

## Production Considerations

### Security

1. **Use HTTPS** - Configure SSL/TLS certificates
2. **Secrets Management** - Use AWS Secrets Manager
3. **Security Groups** - Restrict inbound traffic
4. **IAM Roles** - Use least privilege principle

### Performance

1. **CDN** - Use CloudFront for static assets
2. **Caching** - Enable response caching
3. **Auto Scaling** - Configure based on traffic

### Monitoring

1. **CloudWatch** - Set up alarms and dashboards
2. **Health Checks** - Monitor `/api/health` endpoint
3. **Logging** - Centralize logs in CloudWatch

---

## Troubleshooting

### Common Issues

**Build fails with memory error:**
```bash
export NODE_OPTIONS=--max-old-space-size=4096
npm run build
```

**Environment variables not loading:**
- Ensure `.env` file exists in project root
- Check variable names match exactly
- Restart the application after changes

**Docker build fails:**
- Clear Docker cache: `docker system prune -a`
- Check Dockerfile syntax
- Verify base image availability

**AWS deployment issues:**
- Verify IAM permissions
- Check security group rules
- Review CloudWatch logs

### Health Check Endpoints

- **Application health:** `GET /api/health`
- **Database status:** `GET /api/database-status`
- **Deployment info:** `GET /api/deployment-health`

---

## Support

For issues and feature requests, please create an issue in the repository.
