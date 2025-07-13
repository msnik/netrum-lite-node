import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current module path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create wallet
const wallet = ethers.Wallet.createRandom();
console.log("?? New Wallet Created:");
console.log("Address: ", wallet.address);
console.log("Private Key: ", wallet.privateKey);

// Prepare file data
const walletData = JSON.stringify({
  address: wallet.address,
  privateKey: wallet.privateKey
}, null, 2);

// ✅ Path 1: Save to data/wallet/key.txt
const dataDirPath = path.join(__dirname, "../../data/wallet");
const dataFilePath = path.join(dataDirPath, "key.txt");
if (!fs.existsSync(dataDirPath)) {
  fs.mkdirSync(dataDirPath, { recursive: true });
}
fs.writeFileSync(dataFilePath, walletData);
console.log(`?? Saved to ${dataFilePath}`);

// ✅ Path 2: Save to src/wallet/key.txt (same folder)
const localFilePath = path.join(__dirname, "key.txt");
fs.writeFileSync(localFilePath, walletData);
console.log(`?? Also saved to ${localFilePath}`);
