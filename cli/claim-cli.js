#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const claimPath = path.join(__dirname, '../src/system/mining/claim.js');

// Help message
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
⛏️  Netrum Token Claim CLI
Usage:
  netrum-claim        Claim your mined NPT tokens
  netrum-claim --help Show this help

Description:
  Claims your accumulated mining rewards from the Netrum network

Process:
  1. Automatically checks your claimable token balance
  2. Retrieves the current claim fee from the server
  3. Verifies your wallet has sufficient ETH for the fee
  4. Submits the claim transaction to the blockchain

Requirements:
  - Your mining session must be complete (24 hours)
  - Wallet must contain ETH for the claim fee
  - Node must be in Active status

After Claim:
  - Tokens will be transferred directly to your wallet
  - Check your balance using: netrum-wallet

Claim Fee:
  - The fee is automatically determined by the network
  - Displayed before you confirm the transaction
`);
  process.exit(0);
}

// Spawn the claim process
const claimProcess = spawn('node', [claimPath], {
  stdio: 'inherit'
});

// Handle exit
claimProcess.on('close', (code) => {
  process.exit(code);
});
