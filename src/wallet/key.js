#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Current directory setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to wallet file
const keyFilePath = path.join(__dirname, 'key.txt');

// Check if wallet file exists
if (!fs.existsSync(keyFilePath)) {
  console.log("❌ Wallet not set. Please run: netrum-wallet");
  process.exit(1);
}

try {
  const walletData = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));

  console.log("\n?? Your Netrum Node Wallet Keys\n");
  console.log(`?? Address     : ${walletData.address}`);
  console.log(`?? Private Key : ${walletData.privateKey}\n`);

} catch (err) {
  console.error("❌ Failed to read or parse key.txt:", err.message);
  process.exit(1);
}
