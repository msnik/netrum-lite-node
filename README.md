📦 Netrum Lite Node - Local Compute Node Setup
---------------------------------------------

🛠️ Requirements:

Operating System: Ubuntu 20.04 / 22.04 (Recommended VPS)
Minimum Specs:
  - RAM: 4 GB (6 GB recommended)
  - Disk: 200+ GB (SSD preferred)
  - CPU: 2+ cores

📥 Required Packages:

Install all required dependencies using the following command:

sudo apt update && sudo apt install -y curl bc jq nodejs npm

⚠️ Node.js Version Required: v16.x or v18.x (LTS recommended)

To install Node.js v18 (recommended):

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

Verify installation:
node -v   ➤ should be v18.x.x
npm -v    ➤ should be 8.x.x or above

Then, install `ethers.js` (inside the wallet folder):

cd src/wallet
npm init -y
npm install ethers

🔧 Folder Structure:

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

🚀 How to Start the Node:

1. Clone or copy the files into your VPS.

2. Make both scripts executable:
   chmod +x init.sh
   chmod +x start.sh

3. Run initialization (generates wallet + node ID):
   ./init.sh

   This will:
   - Generate a secure wallet
   - Create a persistent Node ID
   - Save all identity files in `data/` folder
   - Show you your wallet address and node ID

4. Start the node:
   ./start.sh

   This will:
   - Load the identity and wallet
   - Check system requirements
   - Connect to Netrum server
   - Request mining slot

✅ What It Does:

- Generates a secure EVM wallet (address + private key stored locally)
- Generates a persistent Node ID (format: NetrumLite-xxxxxxxxxxxxxx)
- Runs full system check (RAM, Disk, CPU)
- Connects to dummy server endpoint
- Sends request to simulate mining

📁 Notes:

- Wallet file is saved locally at: data/wallet/key.txt
- Node ID is saved at: data/node/id.txt
- Private key never leaves the VPS (full user control)
- Server connection is currently a placeholder (to be replaced with real endpoints)

👤 Author: Netrum Team
