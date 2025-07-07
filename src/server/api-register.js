#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '../..');
const TX_HASH = fs.readFileSync(path.join(ROOT_DIR, 'data/tx-hash.txt'), 'utf-8').trim();
const SIGN_FILE = path.join(ROOT_DIR, 'src/identity/signMessage.txt');

function parseSignFile() {
  const content = fs.readFileSync(SIGN_FILE, 'utf-8');
  const data = {
    nodeId: content.match(/NodeID:\s*(.*)/)[1],
    signerAddress: content.match(/SignerAddress:\s*(.*)/)[1],
    timestamp: content.match(/Timestamp:\s*(.*)/)[1],
    signature: content.match(/Signature:\s*(.*)/)[1]
  };
  return data;
}

async function registerNode() {
  const { nodeId, signerAddress, timestamp, signature } = parseSignFile();
  
  const payload = {
    wallet: signerAddress,
    nodeId: nodeId,
    timestamp: parseInt(timestamp),
    signature: signature,
    txHash: TX_HASH
  };

  try {
    const response = await fetch('https://api.netrumlabs.com/api/node/register-node', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const apiResponse = await response.text();
    
    // Ensure data directory exists
    fs.mkdirSync(path.join(ROOT_DIR, 'data'), { recursive: true });
    fs.writeFileSync(path.join(ROOT_DIR, 'data/register-data.txt'), apiResponse);

    if (apiResponse.includes('Node already registered')) {
      console.log('⚠️  Node already registered on Netrum Server.');
    } else if (apiResponse.includes('✅')) {
      console.log('✅  Registration data saved to data/register-data.txt');
    } else {
      console.log('❌  Registration failed. Check response:');
      console.log(apiResponse);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌  Registration request failed:', error.message);
    process.exit(1);
  }
}

registerNode();
