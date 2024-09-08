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
docker-compose down

echo "Building and starting Docker containers..."
docker-compose up --build -d

if [ $? -eq 0 ]; then
  echo "All services were started successfully."
else
  echo "An error occurred while starting the services."
  exit 1
fi

echo "Running containers:"
docker-compose ps

echo "The application is now running. You can access the frontend at http://localhost:${FRONTEND_PORT}."
