#!/bin/bash

# 🧠 Step 1: Import identity and wallet from init.sh
bash ./init.sh

echo "<==============================================================>"

# 📖 Step 2: Read wallet address and node ID
NODE_WALLET=$(cat data/wallet/key.txt | jq -r '.address')
NODE_ID=$(cat data/node/id.txt)

echo "<==============================================================>"

# 📦 Step 3: System Check
bash src/system/check-system.sh || exit 1

echo "<==============================================================>"

# 🌐 Step 4: Connect to Server
bash src/server/connect-netrum.sh "$NODE_WALLET" "$NODE_ID"

echo "<==============================================================>"

# ⛏️ Step 5: Request Mining
bash src/mining/request-mining.sh "$NODE_WALLET" "$NODE_ID"

