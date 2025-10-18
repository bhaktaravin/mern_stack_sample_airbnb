#!/bin/bash

# AWS App Runner Deployment Script (Simpler Option)
# This script helps you deploy using AWS App Runner

set -e

AWS_REGION="us-east-1"
APP_NAME="airbnb-mern-app"

echo "🚀 AWS App Runner Deployment Guide"
echo "=================================="
echo ""
echo "App Runner is the easiest way to deploy your containerized application."
echo "It automatically builds and deploys from your GitHub repository."
echo ""

# Step 1: Create apprunner.yaml for backend
echo "📝 Creating App Runner configuration for backend..."
cat > ../server/apprunner.yaml << EOF
version: 1.0
runtime: docker
build:
  commands:
    build:
      - echo "Building backend application"
run:
  runtime-version: latest
  command: npm start
  network:
    port: 5000
    env:
      - name: PORT
        value: "5000"
      - name: NODE_ENV
        value: "production"
  env:
    - name: MONGODB_URI
      value: "YOUR_MONGODB_URI_FROM_SECRETS"
EOF

# Step 2: Create apprunner.yaml for frontend
echo "📝 Creating App Runner configuration for frontend..."
cat > ../client/apprunner.yaml << EOF
version: 1.0
runtime: docker
build:
  commands:
    build:
      - echo "Building frontend application"
run:
  runtime-version: latest
  command: nginx -g 'daemon off;'
  network:
    port: 80
  env:
    - name: REACT_APP_API_URL
      value: "https://YOUR_BACKEND_URL/api"
EOF

echo ""
echo "✅ Configuration files created!"
echo ""
echo "🔧 Next Steps:"
echo "1. Push these changes to your GitHub repository"
echo "2. Go to AWS Console > App Runner"
echo "3. Create a new App Runner service"
echo "4. Connect to your GitHub repository"
echo "5. Select the appropriate apprunner.yaml file"
echo "6. Configure environment variables"
echo "7. Deploy!"
echo ""
echo "🌐 App Runner will provide you with a URL for each service"
echo "📊 Estimated cost: \$15-50/month"
echo ""
echo "📚 Documentation: https://docs.aws.amazon.com/apprunner/"