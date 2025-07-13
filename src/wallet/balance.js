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
const NPT_CONTRACT_ADDRESS = "0x81eb5897F829860A199ca63189f9E8D553cE5121";

// === ERC-20 ABI for balanceOf
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

// === Path to key.txt in this folder
const keyFilePath = path.join(__dirname, 'key.txt');

// === Load wallet from key file
function getWalletFromKeyFile() {
  if (!fs.existsSync(keyFilePath)) {
    console.error("❌ key.txt not found at:", keyFilePath);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(keyFilePath, 'utf8');

  try {
    const { privateKey } = JSON.parse(fileContent);
    return new ethers.Wallet(privateKey);
  } catch (e) {
    try {
      return new ethers.Wallet(fileContent.trim());
    } catch (err) {
      console.error("❌ Invalid key file format.");
      process.exit(1);
    }
  }
}

// === Check balance (ETH + NPT)
async function checkBalance() {
  const wallet = getWalletFromKeyFile();
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const address = wallet.address;

  // === ETH balance
  const balanceWei = await provider.getBalance(address);
  const balanceEth = parseFloat(ethers.formatEther(balanceWei));

  // === NPT balance
  const tokenContract = new ethers.Contract(NPT_CONTRACT_ADDRESS, ERC20_ABI, provider);
  const decimals = await tokenContract.decimals();
  const tokenBalanceRaw = await tokenContract.balanceOf(address);
  const tokenBalance = parseFloat(ethers.formatUnits(tokenBalanceRaw, decimals));

  // === Display
  console.log(`Address       : ${address}`);
  console.log(`ETH Balance   : ${balanceEth} ETH`);
  console.log(`NPT Balance   : ${tokenBalance} NPT`);

  // Optional: ETH balance check
  if (balanceEth < MINIMUM_BALANCE) {
    console.error(`❌ ETH too low (< ${MINIMUM_BALANCE}). Please fund wallet.`);
    process.exit(1);
  } else {
    console.log(`✅ ETH balance is sufficient.`);
  }
}

checkBalance();
