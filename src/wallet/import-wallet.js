#!/usr/bin/env node
import { Wallet } from "ethers";
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ── Helpers ──────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const askHidden = (question) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input:  process.stdin,
      output: process.stdout,
      terminal: true
    });

    // Hide every keystroke
    rl.stdoutMuted = true;
    rl._writeToOutput = function () {
      /* no-echo */   // comment this out if you prefer to see asterisks: rl.output.write("*");
    };

    rl.question(question, (answer) => {
      rl.close();
      console.log();     // move to a new line
      resolve(answer.trim());
    });
  });

// ── Main ────────────────────────────────────────────────
(async function run() {
  const privateKey = await askHidden("Enter private key (must start with 0x): ");

  if (!privateKey.startsWith("0x")) {
    console.error("❌ Private key must start with '0x'. Exiting.");
    process.exit(1);
  }

  try {
    const wallet     = new Wallet(privateKey);
    const walletData = JSON.stringify(
      { address: wallet.address, privateKey: wallet.privateKey },
      null,
      2
    );

    // Path 1: ../../data/wallet/key.txt
    const dataDir = path.join(__dirname, "../../data/wallet");
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const dataPath = path.join(dataDir, "key.txt");
    fs.writeFileSync(dataPath, walletData);

    // Path 2: ./key.txt (same folder as script)
    const localPath = path.join(__dirname, "key.txt");
    fs.writeFileSync(localPath, walletData);

    // Log results
    console.log("✅ Wallet imported successfully:");
    console.log("Address:     ", wallet.address);
    console.log("Private Key: ", wallet.privateKey);
    console.log(`📁 Saved to: ${dataPath}`);
    console.log(`📁 Saved to: ${localPath}`);
  } catch (err) {
    console.error("❌ Invalid private key. Please try again.");
    process.exit(1);
  }
})();
