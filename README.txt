# 📦 Netrum Lite Node Setup

A lightweight decentralized compute node for the Netrum ecosystem.  
This node generates a unique identity, secure wallet, and connects to Netrum server for mining task requests.

---

## 🛠️ Requirements

**Recommended System (VPS):**
- OS: Ubuntu 20.04 / 22.04
- RAM: 4 GB (6 GB recommended)
- Disk: 200+ GB SSD
- CPU: 2+ cores

---

## 📥 Required Packages

Install dependencies:

```bash
sudo apt update && sudo apt install -y curl bc jq nodejs npm
```

### Install Node.js v18 (recommended):

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### Check versions:

```bash
node -v   # ➤ should be v18.x.x
npm -v    # ➤ should be 8.x.x or above
```

### Install `ethers.js` (inside wallet folder):

```bash
cd src/wallet
npm init -y
npm install ethers
```

## 🔧 Folder Structure

```bash
netrum-lite-node/
├── init.sh                      <-- Node ID + Wallet generator (run first)
├── start.sh                     <-- Main runner script
├── data/
│   ├── node/
│   │   └── id.txt               <-- Auto-generated unique Node ID
│   └── wallet/
│       └── key.txt              <-- Auto-generated wallet (address + private key)
├── src/
│   ├── identity/
│   │   └── generate-node-id.sh  <-- Generates NetrumLite-xxxxxx ID
│   ├── wallet/
│   │   └── generate-wallet.js   <-- EVM wallet generator
│   ├── system/
│   │   └── check-system.sh      <-- RAM, Disk, CPU checker
│   ├── server/
│   │   └── connect-netrum.sh    <-- Server connect logic
│   └── mining/
│       └── request-mining.sh    <-- Mining slot requester

```

## 🚀 How to Start the Node

### Step 1: Make Scripts Executable

```bash
chmod +x init.sh
chmod +x start.sh
```

### Step 2: Initialize the Node

```bash
./init.sh
```

✅ This will:

 - Generate a secure EVM wallet

 - Create a persistent Node ID

 - Save both in data/ folder

 - Display your wallet address and Node ID


### Step 3: Start the Node

```bash
./start.sh
```

✅ This will:

 - Load wallet + Node ID

 - Check system requirements

 - Connect to Netrum server (stub)

 - Request a mining slot


### ✅ What It Does

 - 🔐 Generates secure EVM wallet (locally stored)

 - 🆔 Creates unique Node ID (NetrumLite-xxxxxxxxxx)

 - 📊 Checks RAM, Disk, CPU

 - 🌐 Connects to Netrum server (placeholder)

 - ⛏️ Sends request to simulate mining


### 📁 Notes

 - Wallet saved at: data/wallet/key.txt

 - Node ID saved at: data/node/id.txt

 - Private key stays local — never sent externally

 - Server endpoints are dummy for now (to be upgraded)