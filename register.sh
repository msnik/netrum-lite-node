#!/bin/bash

echo "🚀 Starting Node Registration..."

# Step 1: System check
echo ""
echo "🔍 Step 1: Checking System Requirements..."
bash src/system/check-system.sh || {
  echo "❌ System requirements failed. Exiting."
  exit 1
}

# Step 2: Init wallet + ID
echo ""
echo "🔐 Step 2: Initializing Wallet & Node ID..."
bash ./init.sh

NODE_WALLET=$(cat data/wallet/key.txt | jq -r '.address')
NODE_ID=$(cat data/node/id.txt)

# Step 3: Signature file check
echo ""
echo "📝 Step 3: Checking Signature Message..."
SIGN_FILE="src/identity/signMessage.txt"
if [ ! -f "$SIGN_FILE" ]; then
  echo "❌ Signature file not found!"
  echo "⚠️  Your wallet or node identity might be corrupted."
  echo "🧹 Please delete and recreate your wallet using: bash ./init.sh"
  exit 1
fi

echo "✅ Signature found:"
cat $SIGN_FILE

# Step 4: Connecting to API
echo ""
echo "🌐 Step 4: Connecting to Netrum Registration Server..."
bash src/system/connecting.sh
bash src/server/registration.sh 

# Step 5: Balance Chack in Wallet 
echo ""
echo "💸 Step 5: Checking Wallet Balance..."
bash src/wallet/balance-checker.sh || exit 1

