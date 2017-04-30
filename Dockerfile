# Prod Dockerfile
FROM node:7

RUN mkdir /app
WORKDIR /app

COPY ./ /app
RUN npm install --silent

ENV NODE_ENV production

CMD ["node", "run.js"]
