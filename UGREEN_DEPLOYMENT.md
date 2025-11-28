#!/bin/bash

# UGREEN NAS Deployment Guide
# 
# Prerequisites:
# 1. SSH enabled on UGREEN NAS (Control Panel → Terminal & SNMP)
# 2. Docker installed on UGREEN NAS (should be pre-installed)
# 3. Your NAS IP address

echo "UGREEN NAS Deployment Instructions"
echo "==================================="
echo ""
echo "1. SSH into your UGREEN NAS:"
echo "   ssh admin@YOUR_NAS_IP"
echo ""
echo "2. Create docker directory:"
echo "   mkdir -p /mnt/data/docker/sample_airbnb"
echo "   cd /mnt/data/docker/sample_airbnb"
echo ""
echo "3. Clone the repository:"
echo "   git clone https://github.com/bhaktaravin/mern_stack_sample_airbnb.git ."
echo ""
echo "4. Create .env file:"
echo "   cd server"
echo "   cat > .env << EOF"
echo "MONGO_URI=mongodb+srv://bhaktaravin:bhaktaravin@cluster0.lnxnu.mongodb.net/sample_airbnb?retryWrites=true&w=majority&appName=Cluster0"
echo "PORT=5000"
echo "EOF"
echo "   cd .."
echo ""
echo "5. Deploy with Docker Compose:"
echo "   docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "6. Check status:"
echo "   docker ps"
echo ""
echo "7. Access your app:"
echo "   Frontend: http://YOUR_NAS_IP"
echo "   Backend:  http://YOUR_NAS_IP:5000"
echo ""
echo "To update deployment:"
echo "   cd /mnt/data/docker/sample_airbnb"
echo "   git pull"
echo "   docker-compose -f docker-compose.prod.yml up -d --build"
