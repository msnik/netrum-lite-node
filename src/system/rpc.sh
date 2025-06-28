#!/bin/bash

# === RPC Configuration Script ===

RPC_FILE="src/system/rpc.txt"

# 📦 Default values (Base Sepolia)
DEFAULT_CHAIN_ID=84532
DEFAULT_RPC_URL="https://base-sepolia.g.alchemy.com/v2/rAN4R_MIKd704_Ow--uMuGp2m4q2Nxtt"

# ✅ Create file if not exists
if [ ! -f "$RPC_FILE" ]; then
  echo "🔌 RPC config not found. Creating default..."
  mkdir -p src/system
  echo "CHAIN_ID=$DEFAULT_CHAIN_ID" > "$RPC_FILE"
  echo "RPC_URL=$DEFAULT_RPC_URL" >> "$RPC_FILE"
  echo "✅ Created RPC config at $RPC_FILE"
else
  echo "🌐 Found existing RPC config:"
  cat "$RPC_FILE"
fi

# 🎯 Load values into environment variables
export CHAIN_ID=$(grep "CHAIN_ID=" "$RPC_FILE" | cut -d'=' -f2)
export RPC_URL=$(grep "RPC_URL=" "$RPC_FILE" | cut -d'=' -f2)

echo "🔗 Using Chain ID: $CHAIN_ID"
echo "🌍 Using RPC URL:  $RPC_URL"
