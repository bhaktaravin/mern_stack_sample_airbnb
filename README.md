# Sample Airbnb MERN Application

A full-stack MERN application using MongoDB Atlas sample_airbnb dataset.

## Project Structure

```
sample_airbnb/
├── server/
│   ├── config/
│   │   └── conn.js          # MongoDB connection
│   ├── controller/
│   │   └── listingsController.js
│   ├── model/
│   │   └── listings.js      # Mongoose schema
│   ├── routes/
│   │   └── route.js         # API routes
│   ├── .env                 # Environment variables
│   ├── .dockerignore
│   ├── Dockerfile           # Development Docker
│   ├── Dockerfile.prod      # Production Docker
│   ├── index.js             # Server entry point
│   └── package.json
├── docker-compose.yml       # Docker Compose configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- MongoDB Atlas account

### Environment Variables

Create a `.env` file in the server directory:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
```

## Running the Application

### Option 1: Local Development

```bash
cd server
npm install
npm start
```

### Option 2: Docker (Single Container)

```bash
# Build the Docker image
cd server
npm run docker:build

# Run the container
npm run docker:run
```

### Option 3: Docker Compose (Recommended)

```bash
# Run the entire application
docker-compose up

# Run in detached mode
docker-compose up -d

# Stop the application
docker-compose down

# Rebuild and run
docker-compose up --build
```

## API Endpoints

- `GET /api/` - Health check
- `GET /api/listings` - Get all listings (limited to 5 for testing)
- `GET /api/listings/:slug` - Get listing by slug
- `POST /api/listings` - Create new listing
- `DELETE /api/listings/:cuid` - Delete listing by cuid

## Docker Commands

### Development

```bash
# Build development image
docker build -t airbnb-backend ./server

# Run with environment file
docker run -p 5000:5000 --env-file ./server/.env airbnb-backend

# Run with volume mounting for live reload
docker run -p 5000:5000 -v $(pwd)/server:/app -v /app/node_modules --env-file ./server/.env airbnb-backend
```

### Production

```bash
# Build production image
docker build -f ./server/Dockerfile.prod -t airbnb-backend-prod ./server

# Run production container with environment variables
docker run -p 5000:5000 -e MONGODB_URI="your_connection_string" -e PORT=5000 airbnb-backend-prod
```

### Docker Compose Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs backend

# Rebuild services
docker-compose build

# Remove everything (containers, networks, volumes)
docker-compose down -v --remove-orphans
```

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Load sample data (sample_airbnb dataset)
4. Get connection string
5. Add to `.env` file

## Security Notes

- Never commit `.env` files to version control
- Use environment variables in production
- The `.dockerignore` file excludes `.env` from Docker builds
- Use secrets management in production environments

## Development Tips

- Use `docker-compose up` for local development
- Modify `docker-compose.yml` to add frontend service when ready
- Use volume mounting for live code changes during development
- Check logs with `docker-compose logs backend`# mern_stack_sample_airbnb
# mern_stack_sample_airbnb
