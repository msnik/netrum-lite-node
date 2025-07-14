#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../src/wallet/balance.js');

// If user runs --help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
??  Netrum Wallet CLI

Usage:
  netrum-wallet              Run the Wallet CLI
  netrum-wallet --help       Show this help message

Description:
  Manage your Netrum Lite Node wallet.
  - View ETH & NPT balance
`);
  process.exit(0);
}

// Run wallet.js using node
spawn('node', [filePath], { stdio: 'inherit' });
