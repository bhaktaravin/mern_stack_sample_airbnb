# 🚀 Complete AWS Deployment Guide

Choose your deployment method based on your needs:

## 📊 Quick Comparison

| Method | Complexity | Cost/Month | Best For |
|--------|------------|------------|----------|
| **App Runner** | ⭐ Easy | $15-50 | Beginners, Quick deployment |
| **ECS Fargate** | ⭐⭐⭐ Advanced | $30-100 | Production, Scalability |
| **EC2** | ⭐⭐ Medium | $15-30 | Learning, Full control |

---

## 🎯 Option 1: AWS App Runner (Recommended for Beginners)

### Step 1: Prepare Your Code
```bash
# Run this script to create App Runner configs
./aws/deploy-apprunner.sh
```

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Add App Runner configuration"
git push origin main
```

### Step 3: Deploy via AWS Console
1. Go to [AWS App Runner Console](https://console.aws.amazon.com/apprunner/)
2. Click "Create service"
3. **Source**: Repository (GitHub)
4. **Repository**: Select your `mern_stack_sample_airbnb` repo
5. **Branch**: main
6. **Configuration**: Automatic (uses apprunner.yaml)
7. **Service name**: airbnb-backend (for backend service)
8. **Environment variables**:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
9. Click "Create & deploy"

### Step 4: Repeat for Frontend
1. Create another App Runner service
2. **Service name**: airbnb-frontend
3. **Environment variables**:
   - `REACT_APP_API_URL`: https://[backend-service-url]/api

### ✅ Result
- Backend URL: `https://xxxxxxxx.us-east-1.awsapprunner.com`
- Frontend URL: `https://yyyyyyyy.us-east-1.awsapprunner.com`

---

## 🏗️ Option 2: ECS Fargate (Production Ready)

### Prerequisites
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS CLI
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)
```

### Step 1: Infrastructure with Terraform (Optional but Recommended)
```bash
cd aws/
# Install Terraform
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform_1.6.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Initialize and apply
terraform init
terraform plan -var="mongodb_uri=YOUR_MONGODB_CONNECTION_STRING"
terraform apply -var="mongodb_uri=YOUR_MONGODB_CONNECTION_STRING"
```

### Step 2: Deploy with Script
```bash
# Edit the script with your AWS Account ID
nano aws/deploy.sh

# Replace YOUR_ACCOUNT_ID with your actual AWS Account ID
# You can find it with: aws sts get-caller-identity

# Run deployment
./aws/deploy.sh
```

### Step 3: Configure Load Balancer Rules
```bash
# Add API routing rule to ALB
aws elbv2 create-rule \
  --listener-arn "arn:aws:elasticloadbalancing:us-east-1:ACCOUNT:listener/app/airbnb-mern-alb/xxxxx/xxxxx" \
  --priority 100 \
  --conditions Field=path-pattern,Values="/api/*" \
  --actions Type=forward,TargetGroupArn="arn:aws:elasticloadbalancing:us-east-1:ACCOUNT:targetgroup/airbnb-mern-backend-tg/xxxxx"
```

### ✅ Result
- Your app will be available at the ALB DNS name
- Auto-scaling enabled
- High availability across multiple AZs

---

## 🖥️ Option 3: Simple EC2 Deployment

### Step 1: Launch EC2 Instance
```bash
# Create EC2 instance (t3.small recommended)
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1d0 \
  --count 1 \
  --instance-type t3.small \
  --key-name YOUR_KEY_PAIR \
  --security-group-ids sg-xxxxxxxx \
  --subnet-id subnet-xxxxxxxx \
  --associate-public-ip-address
```

### Step 2: Connect and Setup
```bash
# SSH into your instance
ssh -i "your-key.pem" ec2-user@your-instance-ip

# Install Docker
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone your repository
git clone https://github.com/bhaktaravin/mern_stack_sample_airbnb.git
cd mern_stack_sample_airbnb
```

### Step 3: Deploy
```bash
# Create environment file
echo "MONGODB_URI=your_connection_string" > server/.env

# Start the application
docker-compose up -d
```

### Step 4: Configure Nginx (Optional)
```bash
# Install Nginx as reverse proxy
sudo yum install -y nginx

# Configure Nginx
sudo nano /etc/nginx/nginx.conf
# Add reverse proxy configuration

# Start Nginx
sudo service nginx start
```

### ✅ Result
- Your app will be available at `http://your-ec2-ip:3000`
- Manual scaling and management required

---

## 🔒 Security Checklist

### Environment Variables
- ✅ Use AWS Secrets Manager for sensitive data
- ✅ Never commit `.env` files to Git
- ✅ Use IAM roles instead of hardcoded credentials

### Network Security
- ✅ Configure Security Groups properly
- ✅ Use HTTPS with SSL certificates
- ✅ Enable VPC Flow Logs

### Monitoring
- ✅ Set up CloudWatch alarms
- ✅ Enable container insights
- ✅ Configure log retention

---

## 💰 Cost Optimization

### App Runner
- Automatic scaling based on traffic
- Pay only for what you use
- No infrastructure management

### ECS Fargate
- Use Spot instances for development
- Right-size your containers
- Set up auto-scaling policies

### EC2
- Use Reserved Instances for production
- Regular instance right-sizing
- Enable detailed monitoring

---

## 📞 Troubleshooting

### Common Issues
1. **Container fails to start**: Check CloudWatch logs
2. **502 Bad Gateway**: Verify target group health checks
3. **Connection refused**: Check security groups
4. **Out of memory**: Increase container memory limits

### Useful Commands
```bash
# Check ECS service status
aws ecs describe-services --cluster airbnb-cluster --services airbnb-service

# View logs
aws logs get-log-events --log-group-name "/ecs/airbnb-backend" --log-stream-name "stream-name"

# Scale service
aws ecs update-service --cluster airbnb-cluster --service airbnb-service --desired-count 2
```

---

## 🚀 Next Steps After Deployment

1. **Custom Domain**: Use Route 53 + Certificate Manager
2. **CDN**: Add CloudFront for better performance  
3. **Database**: Consider RDS for production database
4. **Monitoring**: Set up detailed monitoring and alerts
5. **CI/CD**: Implement GitHub Actions for automated deployment

Choose the option that best fits your needs and budget! 🎉