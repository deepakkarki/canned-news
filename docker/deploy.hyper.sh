#!/usr/bin/env bash

hyper config --accesskey $HYPER_ACCESS --secretkey $HYPER_SECRET
hyper pull karllhughes/fbm-mailer
hyper pull karllhughes/fbm-collector
