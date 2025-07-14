#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, './register.js');

// Help message
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
?? Netrum Node Registration CLI

Usage:
  netrum-node-register       Start node registration
  netrum-node-register --help  Show this help message

Registration Process:
-----------------------------------------
1. System Check
   - Verify node compatibility requirements

2. Wallet Verification
   - Check if wallet exists
   - Generate Node ID if missing

3. Balance Check
   - 0.005 ETH required for registration
   - On-chain registration fee

4. Network Connection
   - Connects to Netrum Contract & Server
   - Takes 10-12 seconds

5. Final Verification
   - Verify all requirements
   - Completes registration in 1 second

6. Data Storage
   - Save transaction ID & registration data
   - Store locally in node
-----------------------------------------
`);
  process.exit(0);
}

// Show step-by-step progress when running
console.log(`
Starting Netrum Node Registration...
`);

// Run registration with visual progress
const child = spawn('node', [filePath], { stdio: 'inherit' });

child.on('close', (code) => {
  if (code === 0) {
    console.log(`
✅ Registration Completed Successfully!
`);
  } else {
    console.log(`
❌ Registration Failed. Please check requirements.
`);
  }
});
