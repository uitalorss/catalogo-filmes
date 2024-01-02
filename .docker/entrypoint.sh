#!/bin/sh

npm install

npm uninstall bcrypt

npm install node-gyp -g
npm install bcrypt -g

npm install bcrypt --save

npm install -g @nestjs/cli

npm run typeorm migration:run

npm run start:dev