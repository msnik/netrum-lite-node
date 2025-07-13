#!/usr/bin/env node
import { Wallet } from "ethers";
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple input method that works on all systems
const ask = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
};

(async () => {
  try {
    console.log("\n🔐 Import Wallet");
    console.log("---------------------");
    
    // Get private key (with or without 0x prefix)
    const privateKey = await ask("Enter your private key: ");
    
    // Clean the key
    const cleanKey = privateKey.startsWith('0x') 
      ? privateKey.slice(2) 
      : privateKey;

    // Validation
    if (cleanKey.length !== 64 || !/^[a-f0-9]+$/i.test(cleanKey)) {
      throw new Error("Invalid private key - must be 64 hexadecimal characters");
    }

    // Create wallet
    const wallet = new Wallet(cleanKey);
    console.log("\n✅ Wallet successfully verified");
    console.log(`Address: ${wallet.address}`);

    // Prepare data
    const walletData = {
      address: wallet.address,
      privateKey: cleanKey,
      importedAt: new Date().toISOString()
    };

    // Save to key.txt (compatible with main wallet.js)
    const keyFilePath = path.join(__dirname, 'key.txt');
    fs.writeFileSync(keyFilePath, JSON.stringify(walletData, null, 2));
    
    console.log("\n🔏 Wallet successfully imported!");
    console.log(`Location: ${keyFilePath}`);
    console.log("\n⚠️ Keep your private key secure!");

  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
})();
