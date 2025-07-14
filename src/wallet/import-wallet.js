#!/usr/bin/env node
import { Wallet } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readlineSync from "readline-sync";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define both file paths
const dataDirPath = path.join(__dirname, "../../data/wallet");
const dataFilePath = path.join(dataDirPath, "key.txt");
const localFilePath = path.join(__dirname, "key.txt");

// Check for existing wallet files
if (fs.existsSync(dataFilePath) || fs.existsSync(localFilePath)) {
  console.log("❌ Wallet already exists.");
  console.log("ℹ️  Please remove the existing wallet using: netrum-wallet-remove");
  console.log("?? Then run this command again.");
  process.exit(1);
}

(async () => {
  try {
    console.log("\n?? Import Wallet");
    console.log("---------------------");

    // Prompt hidden input for private key
    const privateKey = readlineSync.question("Enter your private key: ", {
      hideEchoBack: true // Hides the input
    });

    const wallet = new Wallet(privateKey);

    console.log("\n✅  Wallet successfully verified");
    console.log(`Address: ${wallet.address}`);

    const walletData = JSON.stringify({
      address: wallet.address,
      privateKey: wallet.privateKey,
      importedAt: new Date().toISOString()
    }, null, 2);

    // Ensure data path exists
    if (!fs.existsSync(dataDirPath)) {
      fs.mkdirSync(dataDirPath, { recursive: true });
    }

    // Save to both locations
    fs.writeFileSync(dataFilePath, walletData);
    fs.writeFileSync(localFilePath, walletData);

    console.log("\n?? Wallet successfully imported!");
    console.log(`?? Saved to: ${dataFilePath}`);
    console.log(`?? Also saved to: ${localFilePath}`);
    console.log("\n⚠️  Keep your private key secure!");
  } catch (error) {
    console.error("\n❌ Error:", error.message.includes("invalid") ? "Invalid private key format" : error.message);
    process.exit(1);
  }
})();
