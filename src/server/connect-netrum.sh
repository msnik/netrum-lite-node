#!/bin/bash

echo "🌐 Connecting to Netrum Central Server..."

SERVER="https://api.netrumlabs.com/compute/register"
HOSTNAME=$(hostname)
PAYLOAD="{\"node_id\":\"$HOSTNAME\",\"type\":\"lite\"}"

RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "$PAYLOAD" $SERVER)

echo "📡 Server Response: $RESPONSE"

