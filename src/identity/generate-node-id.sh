#!/bin/bash

# 📁 Ensure data folder exists
mkdir -p data/node

# 🔍 Check if Node ID already exists
if [ ! -f data/node/id.txt ]; then
  NODE_ID="netrumlite_$(openssl rand -hex 16)"
  echo "$NODE_ID" > data/node/id.txt
  echo "🆔 New Node ID generated: $NODE_ID"
else
  NODE_ID=$(cat data/node/id.txt)
  echo "🆔 Existing Node ID: $NODE_ID"
fi
