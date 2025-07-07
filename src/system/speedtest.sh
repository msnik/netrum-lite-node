#!/bin/bash

echo "🌐 Checking Internet Speed..."

# Install speedtest-cli if not exists
if ! command -v speedtest-cli &> /dev/null
then
    echo "Installing speedtest-cli..."
    sudo apt-get install -y speedtest-cli
fi

# Run speed test
result=$(speedtest-cli --simple)
download=$(echo "$result" | grep Download | awk '{print $2}')
upload=$(echo "$result" | grep Upload | awk '{print $2}')

echo "🔍 Download: $download Mbps"
echo "🔍 Upload: $upload Mbps"

# Save to file
echo "$download $upload" > ../../tmp/speedtest.txt
