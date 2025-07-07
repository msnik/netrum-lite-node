#!/bin/bash

# === RPC Configuration Script ===

# Paths
RPC_FILE="src/system/rpc.txt"
CHAIN_FILE="src/system/chainid.txt"

# 🔗 Base Sepolia Defaults
DEFAULT_RPC_URL="https://sepolia.base.org"
DEFAULT_CHAIN_ID="84532"

# === Create folder if missing
mkdir -p src/system

# === Create RPC file if not exists
if [ ! -f "$RPC_FILE" ]; then
  echo "🔌 RPC URL not found. Setting default..."
  echo "$DEFAULT_RPC_URL" > "$RPC_FILE"
  echo "✅ Created RPC URL at $RPC_FILE"
else
  echo "🌍 RPC URL already set:"
  cat "$RPC_FILE"
fi

# === Create Chain ID file if not exists
if [ ! -f "$CHAIN_FILE" ]; then
  echo "🆔 Chain ID not found. Setting default..."
  echo "$DEFAULT_CHAIN_ID" > "$CHAIN_FILE"
  echo "✅ Created Chain ID at $CHAIN_FILE"
else
  echo "🧩 Chain ID already set:"
  cat "$CHAIN_FILE"
fi

# === Export for current session
export RPC_URL=$(cat "$RPC_FILE")
export CHAIN_ID=$(cat "$CHAIN_FILE")

# === Summary
echo ""
echo "🚀 Current RPC Configuration:"
echo "🌐 RPC URL:  $RPC_URL"
echo "🆔 Chain ID: $CHAIN_ID"
