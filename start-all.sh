#!/bin/bash

services=("auth-service" "comments-service" "journals-service" "likes-service" "mode-service" "users-service" "gateway-service")

for service in "${services[@]}"; do
    service_path="/app/server/webservices/$service"
    if [ -f "$service_path/dist/index.js" ]; then
        echo "Starte $service..."
        cd "$service_path" && npm start &
    else
        echo "$service: dist/index.js nicht gefunden!"
    fi
done

frontend_path="/app/client/build"
if [ -d "$frontend_path" ]; then
    echo "Starte Frontend auf Port 3000..."
    cd /app/client && npx serve -s build -l 3000 &
else
    echo "Frontend-Build nicht gefunden! Bitte sicherstellen, dass das Frontend gebaut wurde."
fi

wait
