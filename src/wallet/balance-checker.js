#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ethers } from 'ethers';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Constants
const RPC_URL = "https://mainnet.base.org/";
const MINIMUM_BALANCE = 0.0001; // ETH

// === Load wallet address
const walletFilePath = path.join(__dirname, '../../data/wallet/key.txt');

function getWalletAddress() {
  if (!fs.existsSync(walletFilePath)) {
    console.error("❌ Wallet file not found at:", walletFilePath);
    process.exit(1);
  }

  const walletContent = fs.readFileSync(walletFilePath, 'utf8');
  
  try {
    const walletJson = JSON.parse(walletContent);
    return walletJson.address;
  } catch {
    return (new ethers.Wallet(walletContent.trim())).address;
  }
}

async function checkBalance() {
  const walletAddress = getWalletAddress();
  console.log(`?? Checking balance for wallet: ${walletAddress}`);
  console.log(`?? Using RPC: ${RPC_URL}`);

  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const balanceWei = await provider.getBalance(walletAddress);
    const balanceEth = parseFloat(ethers.formatEther(balanceWei));
    
    console.log(`?? Wallet Balance: ${balanceEth} ETH`);
    
    if (balanceEth < MINIMUM_BALANCE) {
      console.error(`❌ Balance too low. Please fund with at least ${MINIMUM_BALANCE} ETH`);
      process.exit(1);
    }
    
    console.log(`✅ Balance is sufficient.`);
  } catch (err) {
    console.error("❌ Error fetching balance:", err.message);
    process.exit(1);
  }
}

checkBalance();
