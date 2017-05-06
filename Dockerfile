# Dockerfile
FROM node:7

RUN mkdir /app
WORKDIR /app

ADD ./package.json /app/package.json

RUN npm install --silent

ADD ./ /app

CMD ["node", "run.js"]
