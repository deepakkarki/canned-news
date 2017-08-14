#!/usr/bin/env bash

hyper run -d --name fbm-postgres-1 -p 5432:5432 --env-file $(pwd)/.env.prod -v fbm-postgres:/var/lib/postgresql/data --size=s3 -v $(pwd)/database:/database postgres:9.6
hyper fip attach -f 209.177.91.235 fbm-postgres-1
