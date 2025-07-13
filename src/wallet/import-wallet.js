#!/usr/bin/env node
import { Wallet } from "ethers";
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const askQuestion = (question, hidden = false) => new Promise((resolve) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  if (hidden) {
    const stdin = process.openStdin();
    process.stdin.on('data', (char) => {
      const str = char.toString();
      if (str === '\r' || str === '\n') return;
      readline.cursorTo(process.stdout, 0);
      readline.clearLine(process.stdout, 0);
    });
  }

  rl.question(question, (answer) => {
    rl.close();
    if (hidden) console.log(); // New line after hidden input
    resolve(answer.trim());
  });
});

(async function run() {
  try {
    console.log("🔐 Ethereum Wallet Setup");
    
    // Get private key (try both methods)
    let privateKey;
    try {
      privateKey = await askQuestion(
        "Enter private key (64 hex chars, no 0x): ", 
        true
      );
    } catch {
      console.log("\nFalling back to visible input...");
      privateKey = await askQuestion(
        "Enter private key (64 hex chars, no 0x): ",
        false
      );
    }

    // Validate
    if (!privateKey || privateKey.length !== 64 || !/^[a-fA-F0-9]+$/.test(privateKey)) {
      throw new Error("Invalid private key - must be 64 hexadecimal characters without 0x prefix");
    }

    // Create wallet
    const wallet = new Wallet(privateKey);
    const walletData = {
      address: wallet.address,
      privateKey: privateKey,
      createdAt: new Date().toISOString()
    };

    // Prepare save locations
    const saveDir = path.join(__dirname, "../../data/wallet");
    const savePaths = [
      path.join(saveDir, "wallet.json"),
      path.join(__dirname, "wallet-backup.json")
    ];

    // Ensure directory exists
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }

    // Save files
    savePaths.forEach(filePath => {
      fs.writeFileSync(
        filePath,
        JSON.stringify(walletData, null, 2),
        { mode: 0o600 } // Secure file permissions
      );
      console.log(`✓ Saved to ${filePath}`);
    });

    console.log("\nWallet created successfully!");
    console.log(`Address: ${wallet.address}`);
    console.log(`Private Key: *****${privateKey.slice(-4)}`);
    console.log("\n⚠️  Keep your private key secure!");

  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
})();
