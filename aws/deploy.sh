#!/bin/bash

# AWS ECS Deployment Script for MERN Airbnb Clone
# Make sure to configure AWS CLI first: aws configure

set -e

# Configuration
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="YOUR_ACCOUNT_ID"  # Replace with your AWS Account ID
CLUSTER_NAME="airbnb-cluster"
SERVICE_NAME="airbnb-service"
ECR_BACKEND_REPO="airbnb-backend"
ECR_FRONTEND_REPO="airbnb-frontend"

echo "🚀 Starting AWS ECS Deployment..."

# Step 1: Create ECR repositories if they don't exist
echo "📦 Creating ECR repositories..."
aws ecr describe-repositories --repository-names $ECR_BACKEND_REPO --region $AWS_REGION || \
aws ecr create-repository --repository-name $ECR_BACKEND_REPO --region $AWS_REGION

aws ecr describe-repositories --repository-names $ECR_FRONTEND_REPO --region $AWS_REGION || \
aws ecr create-repository --repository-name $ECR_FRONTEND_REPO --region $AWS_REGION

# Step 2: Get ECR login token
echo "🔑 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Step 3: Build and push backend image
echo "🏗️ Building and pushing backend image..."
cd ../server
docker build -t $ECR_BACKEND_REPO .
docker tag $ECR_BACKEND_REPO:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND_REPO:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND_REPO:latest

# Step 4: Build and push frontend image
echo "🎨 Building and pushing frontend image..."
cd ../client
docker build -t $ECR_FRONTEND_REPO .
docker tag $ECR_FRONTEND_REPO:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND_REPO:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND_REPO:latest

# Step 5: Create CloudWatch Log Groups
echo "📊 Creating CloudWatch log groups..."
aws logs create-log-group --log-group-name "/ecs/airbnb-backend" --region $AWS_REGION || echo "Backend log group already exists"
aws logs create-log-group --log-group-name "/ecs/airbnb-frontend" --region $AWS_REGION || echo "Frontend log group already exists"

# Step 6: Register task definition
echo "📋 Registering ECS task definition..."
cd ../aws
# Replace placeholders in task definition
sed "s/YOUR_ACCOUNT_ID/$AWS_ACCOUNT_ID/g" task-definition.json > task-definition-final.json
aws ecs register-task-definition --cli-input-json file://task-definition-final.json --region $AWS_REGION

# Step 7: Create ECS cluster if it doesn't exist
echo "🏭 Creating ECS cluster..."
aws ecs describe-clusters --clusters $CLUSTER_NAME --region $AWS_REGION || \
aws ecs create-cluster --cluster-name $CLUSTER_NAME --capacity-providers FARGATE --region $AWS_REGION

# Step 8: Create or update ECS service
echo "🔄 Creating/updating ECS service..."
if aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $AWS_REGION | grep -q "ACTIVE"; then
    echo "Service exists, updating..."
    aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --task-definition airbnb-app --region $AWS_REGION
else
    echo "Creating new service..."
    aws ecs create-service \
        --cluster $CLUSTER_NAME \
        --service-name $SERVICE_NAME \
        --task-definition airbnb-app \
        --desired-count 1 \
        --launch-type FARGATE \
        --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxxx,subnet-yyyyyy],securityGroups=[sg-xxxxxxxx],assignPublicIp=ENABLED}" \
        --region $AWS_REGION
fi

echo "✅ Deployment completed!"
echo "🌐 Your application should be available shortly."
echo "📊 Monitor deployment: https://console.aws.amazon.com/ecs/home?region=$AWS_REGION#/clusters/$CLUSTER_NAME/services"

# Clean up temporary files
rm -f task-definition-final.json