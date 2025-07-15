#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ethers } from 'ethers';

// Get current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// === Constants
const RPC_URL = "https://mainnet.base.org/";
const MINIMUM_BALANCE = 0.00001; // ETH
const NPT_CONTRACT_ADDRESS = "0xB8c2CE84F831175136cebBFD48CE4BAb9c7a6424";

// === ERC-20 ABI for balanceOf
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

// === Path to key.txt in this folder
const keyFilePath = path.join(__dirname, 'key.txt');

// === Load wallet from key file with better error handling
function getWalletFromKeyFile() {
  try {
    if (!fs.existsSync(keyFilePath)) {
      throw new Error("Wallet file not found");
    }

    const fileContent = fs.readFileSync(keyFilePath, 'utf8');
    const walletData = JSON.parse(fileContent);

    if (!walletData.privateKey) {
      throw new Error("Invalid wallet format");
    }

    return new ethers.Wallet(walletData.privateKey);
  } catch (error) {
    console.error("❌ Error loading wallet:");
    console.error("   - Make sure you've created or imported a wallet first");
    console.error("   - If importing, ensure you're using the correct format");
    process.exit(1);
  }
}

// === Check balance (ETH + NPT) with better formatting
async function checkBalance() {
  try {
    const wallet = getWalletFromKeyFile();
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const address = wallet.address;

    console.log("\n🔹 Checking balances...\n");

    // === ETH balance
    const balanceWei = await provider.getBalance(address);
    const balanceEth = parseFloat(ethers.formatEther(balanceWei));

    // === NPT balance
    const tokenContract = new ethers.Contract(NPT_CONTRACT_ADDRESS, ERC20_ABI, provider);
    const [decimals, tokenBalanceRaw] = await Promise.all([
      tokenContract.decimals(),
      tokenContract.balanceOf(address)
    ]);
    const tokenBalance = parseFloat(ethers.formatUnits(tokenBalanceRaw, decimals));

    // === Display with better formatting
    console.log(`📋 Wallet Summary:`);
    console.log(`├─ Address: ${address}`);
    console.log(`├─ ETH Balance: ${balanceEth.toFixed(8)} ETH`);
    console.log(`└─ NPT Balance: ${tokenBalance.toFixed(8)} NPT`);

    // Balance check with color indication
    if (balanceEth < MINIMUM_BALANCE) {
      console.log(`\n⚠️  Warning: ETH balance is low (< ${MINIMUM_BALANCE} ETH)`);
      console.log("   Consider adding more ETH to your wallet");
    } else {
      console.log(`\n✅ ETH balance is sufficient`);
    }

  } catch (error) {
    console.error("\n❌ Error checking balances:");
    console.error(error.message);
    process.exit(1);
  }
}

// Check if running directly (not being imported)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // Check for --no-prompt flag if needed
  const noPrompt = process.argv.includes('--no-prompt');
  checkBalance();
}
