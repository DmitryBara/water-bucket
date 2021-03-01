FROM node:13.8-alpine

WORKDIR /app

COPY . .

EXPOSE 8020

RUN npm install --silent