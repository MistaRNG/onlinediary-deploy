#!/bin/bash

cd /app/server/webservices/auth-service && npm start &
cd /app/server/webservices/comments-service && npm start &
cd /app/server/webservices/journals-service && npm start &
cd /app/server/webservices/likes-service && npm start &
cd /app/server/webservices/mode-service && npm start &
cd /app/server/webservices/users-service && npm start &
cd /app/server/webservices/gateway-service && npm start
