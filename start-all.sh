#!/bin/bash

if ! command -v docker &> /dev/null; then
  echo "Docker is not installed. Please install Docker."
  exit 1
fi

if ! command -v docker-compose &> /dev/null; then
  echo "Docker Compose is not installed. Please install Docker Compose."
  exit 1
fi

if [ ! -f ".env" ]; then
  echo "The .env file was not found. Please ensure the .env file is present in the main directory."
  exit 1
fi

echo "Stopping and removing existing Docker containers..."
docker-compose down || { echo "Failed to stop containers. Exiting..."; exit 1; }

echo "Cleaning up Docker environment..."
docker system prune -f
docker volume prune -f

echo "Building and starting Docker containers..."
docker-compose up --build -d || { echo "Failed to build and start containers. Exiting..."; exit 1; }

echo "All services were started successfully."

echo "Running containers:"
docker-compose ps

echo "The application is now running. You can access the frontend at http://localhost:3000"
