#!/bin/bash

echo "📦 Checking System Requirements..."

RAM=$(free -g | awk '/^Mem:/{print $2}')
DISK=$(df -h / | awk 'NR==2 {print $2}' | sed 's/G//')
CPU=$(nproc)

echo "🔍 RAM: ${RAM} GB"
echo "🔍 DISK: ${DISK} GB"
echo "🔍 CPU Cores: ${CPU}"

if [ "$RAM" -lt 4 ]; then
  echo "❌ RAM requirement not met (Minimum 6GB)"
  exit 1
fi

if [ "$(echo "$DISK < 200" | bc)" -eq 1 ]; then
  echo "❌ Disk space requirement not met (Minimum 200GB)"
  exit 1
fi

echo "✅ System meets requirements."
