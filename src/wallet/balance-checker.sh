#!/bin/bash

# === Load RPC and Wallet ===
RPC_URL=$(cat src/system/rpc.txt)
WALLET=$(cat data/wallet/key.txt | jq -r '.address')

echo "💰 Checking balance for wallet: $WALLET"
echo "🔗 Using RPC: $RPC_URL"

# === Get balance from RPC ===
RESPONSE=$(curl -s -X POST --data '{
  "jsonrpc":"2.0",
  "method":"eth_getBalance",
  "params":["'"$WALLET"'", "latest"],
  "id":1
}' -H "Content-Type: application/json" $RPC_URL)

# === Extract balance in wei ===
WEI_HEX=$(echo $RESPONSE | jq -r '.result')
WEI_DEC=$(printf "%d\n" $((0x${WEI_HEX:2})))

# === Convert to ETH ===
ETH=$(echo "scale=6; $WEI_DEC / 1000000000000000000" | bc)

echo "📊 Wallet Balance: $ETH ETH"

# === Optional: Check minimum threshold ===
THRESHOLD=0.00005
if (( $(echo "$ETH < $THRESHOLD" | bc -l) )); then
  echo "❌ Balance too low. Please fund wallet."
  exit 1
else
  echo "✅ Balance is sufficient."
fi
