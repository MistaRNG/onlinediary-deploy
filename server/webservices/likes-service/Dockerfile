FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npm install -g ts-node

COPY . .

EXPOSE 3003

CMD ["ts-node", "src/index.ts"]
