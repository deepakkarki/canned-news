#!/usr/bin/env bash

# Run the mail sender - normally done in a cron job
hyper run --size s2 --name feedbinmailersender --rm --volumes-from feedbinmailerdata --env-file .env karllhughes/feedbin-mailer
