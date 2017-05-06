#!/usr/bin/env bash

docker run --env-file .env \
    -v $(pwd)/templates:/app/templates \
    -v $(pwd)/src:/app/src \
    -v $(pwd)/run.js:/app/run.js \
    karllhughes/feedbin-mailer:local