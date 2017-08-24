#!/usr/bin/env bash

hyper config --accesskey $HYPER_ACCESS --secretkey $HYPER_SECRET

docker pull karllhughes/fbm-collector
docker pull karllhughes/fbm-image-extractor
docker pull karllhughes/fbm-mailer
docker pull karllhughes/fbm-socializer
docker pull karllhughes/fbm-summarizer
docker pull karllhughes/fbm-url-resolver
