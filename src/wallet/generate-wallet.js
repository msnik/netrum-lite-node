const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Create wallet
const wallet = ethers.Wallet.createRandom();

console.log("🆕 New Wallet Created:");
console.log("Address: ", wallet.address);
console.log("Private Key: ", wallet.privateKey);

// Save to data/wallet/key.txt
const dirPath = path.join(__dirname, "../../data/wallet");
const filePath = path.join(dirPath, "key.txt");

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

fs.writeFileSync(filePath, JSON.stringify({
  address: wallet.address,
  privateKey: wallet.privateKey
}, null, 2));

console.log(`📁 Saved to ${filePath}`);
