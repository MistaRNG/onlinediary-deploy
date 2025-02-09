for service in auth-service comments-service journals-service likes-service mode-service users-service gateway-service; do
    service_path="/app/server/webservices/$service"
    port_var="${service^^}_PORT"
    service_port=$(eval echo "\$$port_var")
    
    if [ -f "$service_path/dist/index.js" ]; then
        echo "Starte $service auf Port $service_port..."
        cd "$service_path" && PORT=$service_port npm start &
    else
        echo "$service: dist/index.js nicht gefunden!"
    fi
done

frontend_path="/app/client/build"
if [ -d "$frontend_path" ]; then
    echo "Starte Frontend auf Port $FRONTEND_PORT..."
    cd /app/client && npx serve -s build -l $FRONTEND_PORT &
else
    echo "Frontend-Build nicht gefunden! Bitte sicherstellen, dass das Frontend gebaut wurde."
fi

wait
