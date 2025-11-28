#!/bin/bash

# NAS Deployment Script
# Usage: ./deploy-to-nas.sh

NAS_USER="your-nas-username"
NAS_IP="your-nas-ip"
NAS_PATH="/volume1/docker/sample_airbnb"  # Adjust for your NAS path

echo "🚀 Deploying to NAS..."

# Create directory on NAS if it doesn't exist
ssh ${NAS_USER}@${NAS_IP} "mkdir -p ${NAS_PATH}"

# Copy files to NAS
echo "📦 Copying files..."
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'client/build' \
  ./ ${NAS_USER}@${NAS_IP}:${NAS_PATH}/

# Deploy on NAS
echo "🐳 Starting containers on NAS..."
ssh ${NAS_USER}@${NAS_IP} "cd ${NAS_PATH} && docker-compose -f docker-compose.prod.yml down && docker-compose -f docker-compose.prod.yml up -d --build"

echo "✅ Deployment complete!"
echo "🌐 Frontend: http://${NAS_IP}"
echo "🔧 Backend: http://${NAS_IP}:5000"
