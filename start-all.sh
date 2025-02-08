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

wait
