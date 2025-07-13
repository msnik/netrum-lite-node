#!/usr/bin/env node
import { Wallet } from "ethers";
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    
    // Get private key
    const privateKey = await ask("Enter your private key: ");

    // Let ethers.js handle the validation
    const wallet = new Wallet(privateKey);
    
    console.log("\n✅ Wallet successfully verified");
    console.log(`Address: ${wallet.address}`);

    // Prepare data
    const walletData = {
      address: wallet.address,
      privateKey: wallet.privateKey, // Use the normalized private key from ethers
      importedAt: new Date().toISOString()
    };

    // Save to key.txt
    const keyFilePath = path.join(__dirname, 'key.txt');
    fs.writeFileSync(keyFilePath, JSON.stringify(walletData, null, 2));
    
    console.log("\n🔏 Wallet successfully imported!");
    console.log(`Location: ${keyFilePath}`);
    console.log("\n⚠️ Keep your private key secure!");

  } catch (error) {
    console.error("\n❌ Error:", error.message.includes("invalid private key") 
      ? "Invalid private key format" 
      : error.message);
    process.exit(1);
  }
})();
