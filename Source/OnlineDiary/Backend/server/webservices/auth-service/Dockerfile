FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npm install -g ts-node

COPY . .

RUN npm install -g nodemon

EXPOSE 3001

CMD ["nodemon", "-L", "--exec", "ts-node", "src/index.ts"]
