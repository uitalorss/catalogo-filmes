#!/bin/sh

npm install

npm uninstall bcrypt

npm install bcrypt

npm install -g @nestjs/cli

npm run typeorm migration:run

npm run start:dev