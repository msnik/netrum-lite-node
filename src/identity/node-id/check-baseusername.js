#!/usr/bin/env node
import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// === Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Load Wallet
const walletPath = path.join(__dirname, "../../wallet/key.txt");
if (!fs.existsSync(walletPath)) {
  console.error("❌  Wallet not found. Please set it up using: netrum-wallet");
  process.exit(1);
}
const walletJson = JSON.parse(fs.readFileSync(walletPath, "utf8"));
const address = walletJson.address;

// === Base Mainnet Provider
const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");

// === Contract Addresses (from Base Registrar documentation)
const REVERSE_REGISTRAR = "0x79ea96012eea67a83431f1701b3dff7e37f9e282";
const RESOLVER = "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD";

// === ABIs
const REV_ABI = ["function node(address addr) view returns (bytes32)"];
const RESOLVER_ABI = ["function name(bytes32 node) view returns (string)"];

async function checkBaseUsername() {
  console.log(`?? Checking .base name for: ${address}`);

  try {
    const reverse = new ethers.Contract(REVERSE_REGISTRAR, REV_ABI, provider);
    const node = await reverse.node(address);

    const resolver = new ethers.Contract(RESOLVER, RESOLVER_ABI, provider);
    const name = await resolver.name(node);

    if (!name || name.trim() === "") {
      console.log("\n❌  No .base domain is linked to your wallet.\n");
      console.log("?? You can mint a .base name by following these steps:\n");
      console.log("1️⃣  Retrieve your node wallet’s private key using:");
      console.log("    netrum-wallet-key\n");
      console.log("2️⃣  Import this private key into MetaMask.\n");
      console.log("3️⃣  Visit the official site: https://www.base.org/names\n");
      console.log("4️⃣  Connect to Base Mainnet with your wallet and fund ~$1–$2 worth of ETH.");
      console.log("5️⃣  Mint a .base domain (1–16 characters).\n");
      console.log("⏳  Wait 1–2 minutes after minting, then re-run this command.");
      return;
    }

    console.log(`✅  .base name found: ${name}`);

    // Save to basename.txt
    const basenamePath = path.join(__dirname, "basename.txt");
    fs.writeFileSync(basenamePath, name.trim());
    console.log(`??  Saved domain name to: ${basenamePath}`);

  } catch (err) {
    console.error("❌  Error:", err.message);
  }
}

checkBaseUsername();
