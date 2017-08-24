#!/usr/bin/env bash

hyper config --accesskey $HYPER_ACCESS --secretkey $HYPER_SECRET

hyper pull karllhughes/fbm-collector
hyper pull karllhughes/fbm-image-extractor
hyper pull karllhughes/fbm-mailer
hyper pull karllhughes/fbm-socializer
hyper pull karllhughes/fbm-summarizer
hyper pull karllhughes/fbm-url-resolver
