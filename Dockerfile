FROM node:20-slim

WORKDIR /app

COPY . /app

RUN apt-get update && apt-get install -y bash

RUN cd server/webservices/auth-service && npm install && \
    cd ../comments-service && npm install && \
    cd ../journals-service && npm install && \
    cd ../likes-service && npm install && \
    cd ../mode-service && npm install && \
    cd ../users-service && npm install && \
    cd ../gateway-service && npm install

RUN cd client && npm install && npm run build

RUN chmod +x /app/start-all.sh

WORKDIR /app/server/webservices/gateway-service

CMD ["bash", "/app/start-all.sh"]
