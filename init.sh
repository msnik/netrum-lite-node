#!/bin/bash

echo "🔧 Initializing Node Identity & Wallet..."

# === NODE ID ===
bash src/identity/generate-node-id.sh
NODE_ID=$(cat data/node/id.txt)

# === WALLET ===
if [ ! -f data/wallet/key.txt ]; then
  echo "🪪 Generating new wallet..."
  node src/wallet/generate-wallet.js
else
  echo "🪪 Existing wallet found."
fi

# 🧾 Load and Show Info
NODE_WALLET=$(cat data/wallet/key.txt | jq -r '.address')

echo ""
echo "✅ Node Initialization Summary:"
echo "-------------------------------"
echo "🆔 Node ID:       $NODE_ID"
echo "🏦 Wallet Address: $NODE_WALLET"
echo "📁 Wallet File:    data/wallet/key.txt"
echo "📁 Node ID File:   data/node/id.txt"
echo "<==============================================================>"

# ✅ NEW: Generate signature message
bash src/identity/signMessage.sh

# Create RPC Generate
bash src/system/rpc.sh
