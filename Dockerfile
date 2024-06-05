FROM node:18-alpine3.18

RUN apk add --no-cache bash && apk add --update curl

WORKDIR /home/app