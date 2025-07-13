#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../src/wallet/key.js');

// If user runs --help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
??  Netrum Wallet Key CLI

Usage:
  netrum-wallet-key           Show your wallet address & private key
  netrum-wallet-key --help    Show this help message

Description:
  View the current wallet keys stored in key.txt file.
  Make sure your wallet is already set with: netrum-wallet
`);
  process.exit(0);
}

// Run key.js using node
spawn('node', [filePath], { stdio: 'inherit' });
