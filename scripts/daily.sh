#!/bin/bash

# Source .env
source .env

# Change directory to scripts
cd scripts

# Fetch latest images
~/.local/bin/instaloader -F -c 5 --latest-stamps daily.stamps --dirname-pattern daily blr.on.this.day

# Build daily JSON
python3 daily.py

# Upload latest images
aws s3 sync --include "*.jpg" ./daily/ "$S3_DESTINATION/daily/" --endpoint-url "$S3_ENDPOINT"

# Upload daily JSON
aws s3 cp daily.json "$S3_DESTINATION/daily.json" --endpoint-url "$S3_ENDPOINT"