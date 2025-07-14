import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current module path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define paths
const dataDirPath = path.join(__dirname, "../../data/wallet");
const dataFilePath = path.join(dataDirPath, "key.txt");
const localFilePath = path.join(__dirname, "key.txt");

// Check if wallet file already exists in any path
if (fs.existsSync(dataFilePath) || fs.existsSync(localFilePath)) {
  console.log("❌ Wallet already exists.");
  console.log("ℹ️  Please remove the existing wallet using: netrum-wallet-remove");
  console.log("?? Then run this command again.");
  process.exit(1);
}

// Create wallet
const wallet = ethers.Wallet.createRandom();
console.log("✅ New Wallet Created:");
console.log("Address: ", wallet.address);
console.log("Private Key: ", wallet.privateKey);

// Prepare wallet data
const walletData = JSON.stringify({
  address: wallet.address,
  privateKey: wallet.privateKey
}, null, 2);

// Save to Path 1
if (!fs.existsSync(dataDirPath)) {
  fs.mkdirSync(dataDirPath, { recursive: true });
}
fs.writeFileSync(dataFilePath, walletData);
console.log(`?? Saved to ${dataFilePath}`);

// Save to Path 2
fs.writeFileSync(localFilePath, walletData);
console.log(`?? Also saved to ${localFilePath}`);
