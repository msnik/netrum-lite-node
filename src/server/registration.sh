#!/bin/bash

# === Load Node Info ===
SIGN_FILE="src/identity/signMessage.txt"
NODE_WALLET=$(cat data/wallet/key.txt | jq -r '.address')
NODE_ID=$(cat data/node/id.txt)

# === Extract Data from signMessage.txt ===
PUBLIC_KEY=$(grep "PublicKey:" $SIGN_FILE | cut -d':' -f2 | tr -d ' ')
TIMESTAMP=$(grep "Timestamp:" $SIGN_FILE | cut -d':' -f2 | tr -d ' ')
NODE_ID_SIGN=$(grep "NodeID:" $SIGN_FILE | cut -d':' -f2 | tr -d ' ')

# === Validate Consistency
if [ "$NODE_ID" != "$NODE_ID_SIGN" ]; then
  echo "❌ Node ID mismatch! Check your signMessage.txt or regenerate identity."
  exit 1
fi

# === POST to Server
echo ""
echo "📡 Sending registration request to Netrum API..."
API_ENDPOINT="https://api.netrumlabs.com/api/node/register-node/"

RESPONSE=$(curl -s -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{
    \"wallet\": \"$NODE_WALLET\",
    \"publicKey\": \"$PUBLIC_KEY\",
    \"nodeId\": \"$NODE_ID\",
    \"timestamp\": \"$TIMESTAMP\"
  }")

echo "🌐 Server Response:"
echo "$RESPONSE"
