# Dockerfile
FROM node:7

# Install cron
RUN apt-get update && apt-get install -y cron

# Add crontab file in the cron directory
ADD docker/crontab /etc/cron.d/cron-collector

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/cron-collector

# Create the log file to be able to run tail
RUN touch /var/log/cron.log

ADD ./ /app

WORKDIR /app

RUN npm install --silent

CMD ["node", "run.js"]
