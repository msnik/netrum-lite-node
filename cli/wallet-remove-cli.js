#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../src/wallet/wallet-remove.js');

// If user runs --help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
??️  Netrum Wallet Remove CLI

Usage:
  netrum-wallet-remove         Delete your wallet
  netrum-wallet-remove --help  Show this help message

Description:
  Permanently delete your Netrum Node wallet.
  This will remove the key.txt file from the wallet directory.
`);
  process.exit(0);
}

// Run wallet-remove.js using node
spawn('node', [filePath], { stdio: 'inherit' });
