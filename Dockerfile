# Dockerfile for microservices
FROM node:8

ARG project_dir

RUN mkdir /shared
RUN mkdir /app
WORKDIR /app

ADD ./$project_dir/package.json /app/package.json
ADD ./shared /shared

RUN npm install --silent

ADD ./$project_dir /app

CMD ["node", "run.js"]
