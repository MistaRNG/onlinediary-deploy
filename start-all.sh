#!/bin/bash

declare -A services_ports=(
    ["auth-service"]=3001
    ["comments-service"]=3002
    ["journals-service"]=3005
    ["likes-service"]=3003
    ["mode-service"]=3006
    ["users-service"]=3004
    ["gateway-service"]=4000
)

for service in "${!services_ports[@]}"; do
    service_path="/app/server/webservices/$service"
    service_port=${services_ports[$service]}

    if [ -f "$service_path/dist/index.js" ]; then
        echo "Starte $service auf Port $service_port..."
        cd "$service_path" && PORT=$service_port npm start &
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
