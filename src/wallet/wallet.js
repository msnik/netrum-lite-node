#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to key.txt
const keyFilePath = path.join(__dirname, 'key.txt');

// CLI prompt
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

// Run another JS file (sub-process)
const runScript = (file, args = []) => {
  return new Promise((resolve) => {
    const proc = spawn('node', [path.join(__dirname, file), ...args], { 
      stdio: 'inherit' 
    });
    proc.on('close', resolve);
  });
};

const run = async () => {
  console.log(`\n🔹 Welcome to Netrum Node Wallet\n`);

  // Step 1: check if wallet exists
  const walletExists = fs.existsSync(keyFilePath);

  if (walletExists) {
    console.log("🔹 Wallet already set.\n");
    await runScript('balance.js');
    rl.close();
    return;
  }

  // Step 2: No wallet
  console.log("⚠️  Wallet not found.");
  console.log("Please select:\n1. Generate new wallet\n2. Import existing wallet\n");

  const choice = await ask("Enter your choice (1 or 2): ");

  if (choice.trim() === "1") {
    console.log("\n🔹 Generating new wallet...\n");
    await runScript('generate-wallet.js');
  } else if (choice.trim() === "2") {
    console.log("\n🔹 Importing wallet...\n");
    await runScript('import-wallet.js');
  } else {
    console.log("❌ Invalid choice. Exiting.");
    rl.close();
    return;
  }

  // Step 3: After wallet is set, show balance (no need to ask for private key again)
  console.log("\n🔹 Checking your wallet balance...\n");
  await runScript('balance.js', ['--no-prompt']); // Pass flag to skip private key prompt
  rl.close();
};

run();
