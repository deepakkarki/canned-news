# Dockerfile
FROM node:8

RUN mkdir /app
WORKDIR /app

ADD ./package.json /app/package.json

RUN npm install --silent

ADD ./ /app

CMD ["node", "run.js"]
