# 📦 Netrum Lite Node Cli

A lightweight decentralized compute node for the Netrum ecosystem.  
This node generates a unique identity, secure wallet, and connects to Netrum server for mining task requests.

## 🛠️ Requirements

**Recommended System (VPS):**
- OS: Ubuntu 20.04 / 22.04
- RAM: 4 GB (6 GB recommended)
- Disk: 50+ GB SSD
- CPU: 2+ cores

## 📥 Required Packages


### Install dependencies:

    ```bash
     sudo apt update && sudo apt install -y curl bc jq speedtest-cli nodejs npm
    ```

### Install Node.js v20 (recommended):

    ```bash
     curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
     sudo apt install -y nodejs
    ```

### Check versions:

    ```bash
     node -v 
     npm -v
    ```

### Now go to netrum-lite-node and install npm :

    ```bash
     npm install
    ```

### Now setup Nettum-Cli :

    ```bash
     npm link
    ```

## Now Test Netrum-Cli :

    ```bash
     netrum
    ```


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
