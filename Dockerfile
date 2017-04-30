# Prod Dockerfile
FROM node:7

RUN mkdir /src
WORKDIR /src

COPY ./ /src
RUN npm install --silent

ENV NODE_ENV production

CMD ["node", "app.js"]
