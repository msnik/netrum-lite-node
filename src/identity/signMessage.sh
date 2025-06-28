#!/bin/bash

SIGN_MSG_FILE="src/identity/signMessage.txt"

# === Load Node ID and Wallet Address ===
NODE_ID=$(cat data/node/id.txt)
WALLET_FILE="data/wallet/key.txt"

if [ ! -f "$WALLET_FILE" ]; then
  echo "❌ Wallet not found. Cannot create sign message."
  exit 1
fi

WALLET_ADDRESS=$(cat $WALLET_FILE | jq -r '.address')
TIMESTAMP=$(date +%s)

# === Check if message file already exists ===
if [ -f "$SIGN_MSG_FILE" ]; then
  echo "⚠️ Node identity signature file already exists:"
  echo "   $SIGN_MSG_FILE"
  echo "👉 This file is important. Do not delete it unless you're resetting the node."
  echo ""
else
  echo "📄 Creating Node Signature Message..."
  {
    echo "Netrum Node Register Sign"
    echo "PublicKey: $WALLET_ADDRESS"
    echo "NodeID: $NODE_ID"
    echo "Timestamp: $TIMESTAMP"
  } > "$SIGN_MSG_FILE"

  echo "✅ Node signature message created at: $SIGN_MSG_FILE"
  echo ""
fi
