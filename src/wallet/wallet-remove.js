#!/usr/bin/env node
import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to both key files
const dataWalletPath = path.join(__dirname, "../../data/wallet/key.txt");
const localWalletPath = path.join(__dirname, "./key.txt");

// Show warning
console.log("⚠️  WARNING: You are about to permanently delete your wallet.");
console.log("?? This will delete the wallet key from both locations:");
console.log("  -", dataWalletPath);
console.log("  -", localWalletPath);

// Setup readline for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask confirmation
rl.question("❓ Are you sure you want to delete the wallet? (Yes / No): ", (answer) => {
  const confirm = answer.trim().toLowerCase();

  if (confirm === "yes" || confirm === "y") {
    let deletedAny = false;

    if (fs.existsSync(dataWalletPath)) {
      fs.unlinkSync(dataWalletPath);
      console.log("✅ Deleted:", dataWalletPath);
      deletedAny = true;
    }

    if (fs.existsSync(localWalletPath)) {
      fs.unlinkSync(localWalletPath);
      console.log("✅ Deleted:", localWalletPath);
      deletedAny = true;
    }

    if (!deletedAny) {
      console.log("⚠️  No wallet files found to delete.");
    } else {
      console.log("??️  Wallet successfully deleted.");
    }

  } else {
    console.log("❎ Wallet deletion cancelled.");
  }

  rl.close();
});
