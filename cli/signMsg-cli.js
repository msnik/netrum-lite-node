#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../src/identity/sign/SignMsg.js');

// If user runs --help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
??  Netrum Signature Message CLI
Usage:
  netrum-node-sign              Run the Signature Message CLI
  netrum-node-sign --help       Show this help message

Description:
  Sign messages for On-Chain Node operations.
  
  Signing messages is crucial for:
  - Node Registration
  - Mining operations
  - Claim functions
  
  The signature uses:
  - Node ID
  - Node wallet address
  - Timestamp
`);
  process.exit(0);
}

// Run SignMsg.js using node
spawn('node', [filePath], { stdio: 'inherit' });
