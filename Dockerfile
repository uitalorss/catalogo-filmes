FROM node:18-alpine3.18

WORKDIR /home/app

RUN npm install -g @nestjs/cli

COPY package*.json .

RUN npm install

COPY . .

CMD [ "/bin/sh", "npm", "run", "typeorm", "migration:run"; "npm" "run" "start:dev" ]