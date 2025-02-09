#!/bin/bash

start_service() {
    service_name=$1
    service_port=$2
    service_path="/app/server/webservices/$service_name"

    if [ -f "$service_path/dist/index.js" ]; then
        echo "Starte $service_name auf Port $service_port..."
        cd "$service_path" && PORT=$service_port npm start &
    else
        echo "$service_name: dist/index.js nicht gefunden!"
    fi
}

start_service "auth-service" 3001
start_service "comments-service" 3002
start_service "journals-service" 3005
start_service "likes-service" 3003
start_service "mode-service" 3006
start_service "users-service" 3004
start_service "gateway-service" 4000

frontend_path="/app/client/build"
if [ -d "$frontend_path" ]; then
    echo "Starte Frontend auf Port 3000..."
    cd /app/client && npx serve -s build -l 3000 &
else
    echo "Frontend-Build nicht gefunden! Bitte sicherstellen, dass das Frontend gebaut wurde."
fi

wait
