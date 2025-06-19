#!/bin/bash

echo "⛏️ Requesting Mining Slot..."

SERVER="https://api.netrumlabs.com/compute/mining-slot"
PAYLOAD="{\"node_id\":\"$(hostname)\", \"mode\":\"lite\"}"

RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "$PAYLOAD" $SERVER)

echo "🎯 Mining Slot Status: $RESPONSE"

