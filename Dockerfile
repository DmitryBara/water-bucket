FROM node:13.8-alpine

ADD . /opt/
WORKDIR /opt/

EXPOSE 8020

RUN npm install --silent