# Dockerfile
FROM node:7

RUN mkdir /app
WORKDIR /app

COPY ./ /app
RUN npm install --silent

CMD ["node", "run.js"]
