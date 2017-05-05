#!/usr/bin/env bash

# Create the data volume container
hyper run --size s3 --name feedbinmailerdata -v /app/emails -v $(pwd)/docker/nginx:/etc/nginx/conf.d -d hyperhq/nfs-server

# Create the nginx server and attach an IP to it
hyper run --size s2 -p 80:80 --restart always --name feedbinmailerserver --volumes-from feedbinmailerdata -d nginx
hyper fip attach -f 199.245.57.241 feedbinmailerserver

# Run the mail sender - this needs to be done in a cron job
hyper run --size s2 --name feedbinmailersender --rm --volumes-from feedbinmailerdata --env-file .env.prod karllhughes/feedbin-mailer
