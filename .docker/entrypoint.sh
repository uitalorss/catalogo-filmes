#!/bin/sh

npm install

npm install -g @nestjs/cli

npm run typeorm migration:run

npm run start:dev