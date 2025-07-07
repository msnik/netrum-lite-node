#!/usr/bin/env node
import fs from 'fs';
import axios from 'axios';
import path from 'path';

// File paths
const NODE_ID_FILE = path.join('/root', 'netrum-lite-node', 'data', 'node', 'id.txt');
const WALLET_FILE = path.join('/root', 'netrum-lite-node', 'data', 'wallet', 'key.txt');
const TOKEN_FILE = path.join('/root', 'netrum-lite-node', 'src', 'system', 'mining', 'mining-token.txt');
const API_URL = 'https://api.netrumlabs.com/api/node/mining/generate-mining-token/';

// Read file and trim content
function readExactFile(filePath) {
  return fs.readFileSync(filePath, 'utf8').trim();
}

// Main function
async function generateToken() {
  try {
    // 1. Read exact values from files
    const nodeId = readExactFile(NODE_ID_FILE);
    const walletData = JSON.parse(readExactFile(WALLET_FILE));
    const walletAddress = walletData.address;

    // 2. Call API with exact values
    const response = await axios.post(API_URL, {
      nodeId,
      walletAddress
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    const token = response.data.token;
    const expiry = response.data.expiresAt;

    // 3. Save token to file (overwrite every time)
    fs.writeFileSync(TOKEN_FILE, token, 'utf8');

    // 4. Print result
    console.log('✅ Mining Token Generated');
    console.log('-----------------------');
    console.log(`Token: ${token}`);
    console.log(`Expires: ${new Date(expiry).toLocaleString()}`);
    console.log(`📝 Saved to: ${TOKEN_FILE}`);

  } catch (error) {
    console.error('❌ Error generating token:');

    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Error: ${error.response.data.error || 'Unknown error'}`);

      if (error.response.status === 404) {
        console.log('\n💡 Make sure:');
        console.log(`1. Node ID matches exactly: ${readExactFile(NODE_ID_FILE)}`);
        console.log(`2. Wallet address matches exactly: ${JSON.parse(readExactFile(WALLET_FILE)).address}`);
      }
    } else {
      console.error(error.message);
    }

    process.exit(1);
  }
}

// Run the function
generateToken();
