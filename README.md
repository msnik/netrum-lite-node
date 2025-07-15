# 🧠 What is Netrum Lite Node CLI?

 - Netrum Lite Node CLI is a lightweight command-line tool that allows anyone to participate in the Netrum decentralized compute network.
 - It securely creates a wallet, connects to the Netrum server, registers the node on-chain, syncs uptime data, mines NPT tokens, and allows daily token claiming — all from your terminal.

 - Ideal for VPS and low-resource devices, this node is designed for fast setup, full transparency, and passive token rewards.

---

# 🖥️ Hardware & Network Requirements

 - To run the Netrum Lite Node smoothly, make sure your system meets the following minimum requirements:

   ### 🧰 Hardware Requirements

      | Component       | Minimum            | Recommended        |
      |-----------------|--------------------|--------------------|
      | **CPU**         | 2 Cores            | 2+ Cores           |
      | **RAM**         | 4 GB               | 6 GB or more       |
      | **Disk Space**  | 50 GB SSD          | 100 GB SSD         |

      > 💡 SSD storage is highly recommended for faster performance and node stability.


   ### 🌐 Network Requirements

      | Type              | Minimum Speed     |
      |-------------------|-------------------|
      | **Download**      | 10 Mbps           |
      | **Upload**        | 10 Mbps           |

      > ✅ A stable and fast internet connection is important for uptime sync, mining tasks, and daily reward claims.


--- 

# ⚙️ Netrum Lite Node – Setup Guide

  - Follow these steps to install and run the Netrum Lite Node CLI on Ubuntu/Linux:

    ### 1️⃣ Clone the Repository

     ```bash
     git clone https://github.com/NetrumLabs/netrum-lite-node.git
     ```
     
    ### 2️⃣ Navigate to Project Directory

     ```bash
     cd netrum-lite-node
     ```

    ### 3️⃣ Install Required Dependencies

     ```bash
     sudo apt update && sudo apt install -y curl bc jq speedtest-cli nodejs npm axios diskusage speedtest-net
     ```
     
    ### 4️⃣ (Recommended) Install Node.js v20

     - Check your current Node version:

     ```bash
     node -v
     ```

     > If not v20.x.x, install it:

     ```bash
     curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
     sudo apt install -y nodejs
     ```

    ### 5️⃣ Install Project Dependencies

     ```bash
     npm install
     ```

    ### 6️⃣ Link the CLI Globally

     ```bash
     npm link
     ```

    ### 7️⃣ Test the CLI

     ```bash
     netrum
     ```

     > You should see the Netrum Lite Node CLI interface.

     ```bash
       Netrum CLI  Version v1.0.0
       Light-weight node & wallet toolkit for the Netrum network.

       Available Commands:
       netrum-system          System status & logs
       netrum-new-wallet      Create / new a wallet
       netrum-import-wallet   Create / import a wallet
       netrum-wallet          Create / inspect a wallet
       netrum-wallet-key      Export private key
       netrum-wallet-remove   Delete wallet files
       netrum-check-basename  Check basename conflicts
       netrum-node-id         Show current Node ID
       netrum-node-id-remove  Clear Node ID
       netrum-node-sign       Sign a message with node key
       netrum-node-register   Register node on-chain
       netrum-sync            Sync blockchain data
       netrum-sync-log        Node sync logs
       netrum-mining          Start mining
       netrum-mining-log      Node mining logs
       netrum-claim           Claim rewards

       Run netrum <command> --help for command-specific options.
     ```

---

# 🧪 How to Use Netrum CLI Commands

 - 1. Check your system hardware and internet speed  

   ```bash
   netrum-system
   ```

 - 2. Create a new wallet

   ```bash
   netrum-new-wallet
   ```

 - 3. Import an existing wallet

   ```bash
   netrum-import-wallet
   ```

 - 4. Check your Base domain username in the wallet

   ```bash
   netrum-check-basename
   ```

 - 5. Generate your Node ID

   ```bash
   netrum-node-id
   ```

 - 6. Create a signed identity message

   ```bash
   netrum-node-sign
   ```

 - 7. Register your node on-chain (requires 0.0002–0.0005 BASE as gas fee)

   ```bash
   netrum-node-register
   ```

 - 8. Sync your node with the Netrum server

   ```bash
   netrum-sync
   ```

 - 9. View real-time sync logs
      
   ```bash
   netrum-sync-log
   ```

 - 10. Start mining NPT tokens

   ```bash
   netrum-mining
   ```

 - 11. View real-time mining logs

   ```bash
   netrum-mining-log
   ```

 - 12. Claim mined tokens after 24 hours (requires ~0.00002–0.00003 BASE gas)

   ```bash
   netrum-claim
   ```

   > After claiming, mining will auto-restart. You can claim every 24 hours.
Check token balance using the wallet command below:

 - 13. Check wallet info (balance, address, etc.)

   ```bash
   netrum-wallet
   ```

 - 14. View private and public key of your wallet

   ```bash
   netrum-wallet-key
   ```

 - 15. Remove wallet from local system (⚠️ backup first!)

   ```bash
   netrum-wallet-remove
   ```
---


# ✨ Features of Netrum Lite Node
  - Here are the key features of the Netrum Lite Node CLI:

 ### 🔐 Secure Wallet Management
   - Create or import an EVM-compatible wallet
   - Wallet stored locally (never shared externally)
   - Private key stays safe in your system

 ### 🆔 Unique Node Identity
   - Generates a unique Node ID like `netrum.lite.base.username`
   - Connects with base domain and signs identity message
   - Fully verifiable by Netrum server and smart contract

 ### 📡 Server Sync & Uptime Tracking
   - Maintains real-time sync with Netrum backend
   - Tracks uptime to ensure fairness and reward eligibility
   - Auto-connects on restart (ideal for VPS)

 ### ⛓️ On-Chain Registration
   - Registers your node directly on the smart contract
   - Links your wallet and Node ID to the blockchain
   - Ensures full transparency and decentralized ownership

 ### ⛏️ Live NPT Token Mining
   - Mines NPT tokens based on uptime and participation
   - Uses on-chain proof-of-activity mechanism
   - No hardware mining required — just uptime!

 ### 🕒 Daily Reward Claim
   - Claim your mined tokens every 24 hours
   - All claims are on-chain and directly go to your wallet
   - Simple one-command claiming process

 ### ⚙️ Lightweight & Easy to Use
   - CLI-based interface (easy for developers and node operators)
   - Low resource usage — perfect for basic VPS setups
   - Quick setup in less than 5 minutes


---

## 🛠️ Support

If you face any errors while setting up your wallet, registering your node, or during mining:

➡️ **Join the official Netrum Discord for help and community support:**

🔗 [https://discord.gg/Mv6uKBKCZM](https://discord.gg/Mv6uKBKCZM)

The team and community members are active and ready to assist you.

---

## ⚠️ Disclaimer

This software is in early development and is part of the Netrum testnet/lite-node program.  
Use at your own risk. Make sure to securely store your private keys and never share them with anyone.  
Any loss of tokens due to incorrect usage, deletion of files, or private key leaks is your responsibility.

---
