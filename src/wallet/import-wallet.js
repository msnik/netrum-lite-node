#!/usr/bin/env node
import { Wallet } from "ethers";
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ── Helpers ──────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const askHidden = (question) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Completely hide input
    const stdin = process.openStdin();
    process.stdin.on('data', (char) => {
      const str = char.toString();
      if (str === '\r' || str === '\n') return;
      readline.cursorTo(process.stdout, 0);
      readline.clearLine(process.stdout, 0);
    });

    rl.question(question, (answer) => {
      rl.close();
      console.log(); // move to a new line
      resolve(answer.trim());
    });
  });

// ── Main ────────────────────────────────────────────────
(async function run() {
  console.log("🔐 Please enter your private key (64 characters, no '0x' prefix)");
  console.log("   Note: Your input will be hidden for security\n");

  const privateKey = await askHidden("Private Key: ");

  try {
    // Validate length (64 chars for no 0x prefix)
    if (privateKey.length !== 64 || !/^[a-fA-F0-9]+$/.test(privateKey)) {
      throw new Error("Invalid private key format");
    }

    // Create wallet without 0x prefix
    const wallet = new Wallet(privateKey);
    const walletData = JSON.stringify(
      { 
        address: wallet.address, 
        privateKey: privateKey // Store without 0x
      },
      null,
      2
    );

    // Save to locations
    const dataDir = path.join(__dirname, "../../data/wallet");
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    
    const saveLocations = [
      path.join(dataDir, "key.txt"),
      path.join(__dirname, "key.txt")
    ];

    saveLocations.forEach(path => {
      fs.writeFileSync(path, walletData);
    });

    // Success message
    console.log("\n✅ Wallet created successfully:");
    console.log(`├─ Address: ${wallet.address}`);
    console.log(`├─ Private Key: ${'*'.repeat(6)}${privateKey.slice(-6)}`); // Show only last 6 chars
    console.log(`└─ Saved to: ${saveLocations.join("\n   and: ")}\n`);
    console.log("⚠️  Keep your private key secure!");

  } catch (err) {
    console.error("\n❌ Error:", err.message.includes("invalid private key") 
      ? "Invalid private key (must be 64 hex characters)" 
      : err.message);
    process.exit(1);
  }
})();
