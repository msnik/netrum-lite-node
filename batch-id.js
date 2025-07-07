import dotenv from 'dotenv';
import { ethers } from 'ethers';
import fs from 'fs';

dotenv.config();

// === Load ENV ===
const RPC_URL = process.env.NODE_RPC;
const CONTRACT_ADDRESS = process.env.REGISTR_CONTRACT_ADDRESS;
const ABI_PATH = process.env.REGISTER_ABI;

// === Load ABI ===
if (!fs.existsSync(ABI_PATH)) {
  console.error("❌ ABI file not found at:", ABI_PATH);
  process.exit(1);
}
const abi = JSON.parse(fs.readFileSync(ABI_PATH, 'utf8'));

// === Load wallet address ===
const walletFilePath = 'data/wallet/key.txt';
if (!fs.existsSync(walletFilePath)) {
  console.error("❌ Wallet file not found at:", walletFilePath);
  process.exit(1);
}

let walletAddress = '';
const walletContent = fs.readFileSync(walletFilePath, 'utf8');
try {
  const walletJson = JSON.parse(walletContent);
  walletAddress = walletJson.address;
} catch {
  walletAddress = (new ethers.Wallet(walletContent.trim())).address;
}

console.log(`🔍 Checking batch ID for wallet: ${walletAddress}`);

// === Call contract ===
const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

(async () => {
  try {
    const batchId = await contract.getBatchId(walletAddress);
    console.log(`✅ Batch ID: ${batchId}`);
  } catch (err) {
    console.error("❌ Failed to fetch batch ID:", err.message);
    process.exit(1);
  }
})();
