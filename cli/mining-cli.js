#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const miningPath = path.join(__dirname, '../src/system/mining/start-mining.js');

// Help message
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
⛏️  Netrum Mining CLI
Usage:
  netrum-mining                Start mining NPT tokens
  netrum-mining --help         Show this help message

Description:
  Automated mining client for Netrum Protocol Tokens (NPT)
  
Requirements:
  - Node status must be Active (check with netrum-sync)
  - Wallet address registered in key.txt
  - Minimum system requirements:
    • 4 GB RAM
    • 2 CPU cores
    • 50 GB free storage

Mining Process:
  1. Automatically verifies your node address
  2. Checks mining eligibility with Netrum server
  3. Starts mining session if:
     - Node status is Active
     - Mining slot available
  4. Shows real-time mining stats:
     • Mined tokens (NPT)
     • Current mining speed
     • Time remaining
     • Progress percentage

Earnings:
  Mining speed depends on:
  - Your node's contribution level
  - Total network mining power
  - Your node uptime and stability

`);
  process.exit(0);
}

// Directly spawn the mining process
const miningProcess = spawn('node', [miningPath], { 
  stdio: 'inherit'
});

// Handle process exit
miningProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Mining process exited with code ${code}`);
    console.log('Check logs: netrum-mining-log');
  }
});
