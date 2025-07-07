#!/bin/bash

echo "📦 Checking Lite Node Requirements..."

# Basic System Resources
RAM=$(free -g | awk '/^Mem:/{print $2}')
DISK=$(df -h / | awk 'NR==2 {print $2}' | sed 's/G//')
CPU=$(nproc)

# Include Internet Speed
if [ -f ../../tmp/speedtest.txt ]; then
    read download upload < ../../tmp/speedtest.txt
else
    download=0
    upload=0
fi

echo "🔍 System Specs:"
echo "- RAM: ${RAM}GB"
echo "- DISK: ${DISK}GB"
echo "- CPU Cores: ${CPU}"
echo "- Download Speed: ${download}Mbps"
echo "- Upload Speed: ${upload}Mbps"

# Requirements Check
FAILED=0

if [ "$RAM" -lt 4 ]; then
  echo "❌ RAM requirement not met (Minimum 4GB)"
  FAILED=1
fi

if [ "$(echo "$DISK < 50" | bc)" -eq 1 ]; then
  echo "❌ Disk space requirement not met (Minimum 200GB)"
  FAILED=1
fi

if [ "$(echo "$download < 10" | bc)" -eq 1 ]; then
  echo "❌ Download speed too low (Minimum 10Mbps)"
  FAILED=1
fi

if [ "$(echo "$upload < 5" | bc)" -eq 1 ]; then
  echo "❌ Upload speed too low (Minimum 5Mbps)"
  FAILED=1
fi

if [ "$FAILED" -eq 1 ]; then
  echo "💔 System does not meet requirements"
  exit 1
fi

echo "✅ System meets all requirements"
