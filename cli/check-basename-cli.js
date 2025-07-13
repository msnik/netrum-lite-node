#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the actual check-baseusername.js script
const filePath = path.join(__dirname, '../src/identity/node-id/check-baseusername.js');

// If user runs --help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
??  Netrum Base Domain Checker
Usage:
  check-basename              Run .base domain ownership check
  check-basename --help       Show this help message

Description:
  Check if your node wallet has a registered .base domain.
  If not, follow these steps to mint one:

  1️⃣  Retrieve your node wallet’s private key using:
      netrum-wallet-key

  2️⃣  Import this private key into MetaMask.

  3️⃣  Visit the official site:
      https://www.base.org/names

  4️⃣  Connect to Base Mainnet with your wallet and fund ~$1–$2 worth of ETH.

  5️⃣  Mint a .base domain (1–16 characters).

  ⏳  After minting, wait 1–2 minutes, then re-run:
      check-basename
`);
  process.exit(0);
}

// Run the script
spawn('node', [filePath], { stdio: 'inherit' });
