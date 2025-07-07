#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function initializeNode() {
  try {
    console.log("?? Starting Node Initialization...");
    
    // 1. First check system requirements
    console.log("\n?? Verifying System Requirements...");
    execSync(`node ${path.join(__dirname, 'src/system/check-system.js')}`, {
      stdio: 'inherit'
    });
    console.log("✅ System verification passed\n");

    // 2. Initialize Node Identity
    console.log("?? Initializing Node Identity...");
    execSync(`node ${path.join(__dirname, 'src/identity/generate-node-id.js')}`, {
      stdio: 'inherit'
    });
    const NODE_ID = fs.readFileSync(
      path.join(__dirname, 'data/node/id.txt'), 
      'utf-8'
    ).trim();

    // 3. Initialize Wallet
    console.log("\n?? Initializing Wallet...");
    const walletPath = path.join(__dirname, 'data/wallet/key.txt');
    if (!fs.existsSync(walletPath)) {
      console.log("?? Generating new wallet...");
      execSync(`node ${path.join(__dirname, 'src/wallet/generate-wallet.js')}`, {
        stdio: 'inherit'
      });
    } else {
      console.log("?? Existing wallet found.");
    }

    // 4. Display Summary
    const walletData = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
    const NODE_WALLET = walletData.address;

    console.log("\n✅ Node Initialization Complete");
    console.log("===============================");
    console.log(`?? Node ID:       ${NODE_ID}`);
    console.log(`?? Wallet Address: ${NODE_WALLET}`);
    console.log(`?? Wallet File:    ${walletPath}`);
    console.log(`?? Node ID File:   ${path.join(__dirname, 'data/node/id.txt')}`);
    console.log("=================================");

    // 5. Generate Signature
    console.log("\n??️ Generating Node Signature...");
    execSync(`node ${path.join(__dirname, 'src/identity/signMessage.js')}`, {
      stdio: 'inherit'
    });

  } catch (error) {
    console.error('\n❌ Initialization Failed:', error.message);
    process.exit(1);
  }
}

initializeNode();
